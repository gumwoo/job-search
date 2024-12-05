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
      receiver: receiverId,
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
    const { conversationWith } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: conversationWith },
        { sender: conversationWith, receiver: req.user._id },
      ],
    })
      .sort({ sentAt: 1 }); // 메시지 보낸 시간순 정렬

    res.json({ status: 'success', data: messages });
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
