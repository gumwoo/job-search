// controllers/messageController.js

const Message = require('../models/Message');
const User = require('../models/User');
const CustomError = require('../utils/customError');

// 메시지 전송
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;

    // 수신자 존재 여부 확인
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      throw new CustomError(404, '수신자를 찾을 수 없습니다.');
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId, // 일관성 있게 'receiver' 사용
      content,
    });

    await message.save();

    res.status(201).json({ status: 'success', data: message });
  } catch (err) {
    next(err);
  }
};

// 메시지 목록 조회
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationWith, page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    if (!conversationWith) {
      throw new CustomError(400, '대화 상대방 ID가 필요합니다.');
    }

    // 대화 상대방 존재 여부 확인
    const conversationUser = await User.findById(conversationWith);
    if (!conversationUser) {
      throw new CustomError(404, '대화 상대방을 찾을 수 없습니다.');
    }

    const query = {
      $or: [
        { sender: req.user._id, receiver: conversationWith },
        { sender: conversationWith, receiver: req.user._id },
      ],
    };

    const totalItems = await Message.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = parseInt(page, 10);

    const messages = await Message.find(query)
      .sort({ sentAt: 1 }) // 메시지 보낸 시간순 정렬
      .skip(skip)
      .limit(limit);

    res.json({
      status: 'success',
      data: messages,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 메시지 읽음 처리
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.findOneAndUpdate(
      { _id: id, receiver: req.user._id }, // 'receiver'로 수정
      { read: true },
      { new: true }
    );

    if (!message) {
      throw new CustomError(404, '메시지를 찾을 수 없습니다.');
    }

    res.json({ status: 'success', data: message });
  } catch (err) {
    next(err);
  }
};

// 메시지 상세 조회
exports.getMessageById = async (req, res, next) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    });

    if (!message) {
      throw new CustomError(404, '메시지를 찾을 수 없습니다.');
    }

    res.json({ status: 'success', data: message });
  } catch (err) {
    next(err);
  }
};
