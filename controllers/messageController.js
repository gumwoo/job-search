// controllers/messageController.js

/**
 * MessageController 클래스는 메시지 관련 모든 비즈니스 로직을 처리합니다.
 */
class MessageController {
  /**
   * MessageController 생성자
   * @param {Model} messageModel - Message Mongoose 모델
   * @param {Model} userModel - User Mongoose 모델
   * @param {CustomError} customError - 커스텀 에러 클래스
   */
  constructor(messageModel, userModel, customError) {
    this.Message = messageModel;
    this.User = userModel;
    this.CustomError = customError;
  }

  /**
   * 메시지 전송
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 수신자 미존재 시 발생
   */
  async sendMessage(req, res, next) {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.user._id;

      // 수신자 존재 여부 확인
      const receiver = await this.User.findById(receiverId);
      if (!receiver) {
        throw new this.CustomError(404, '수신자를 찾을 수 없습니다.');
      }

      const message = new this.Message({
        sender: senderId,
        receiver: receiverId,
        content,
      });

      await message.save();

      res.status(201).json({ status: 'success', data: message });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 메시지 목록 조회
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 대화 상대방 미존재 시 발생
   */
  async getMessages(req, res, next) {
    try {
      const { conversationWith, page = 1 } = req.query;
      const userId = req.user._id;
      const limit = 20;
      const skip = (page - 1) * limit;

      // 대화 상대방 존재 여부 확인
      const conversationUser = await this.User.findById(conversationWith);
      if (!conversationUser) {
        throw new this.CustomError(404, '대화 상대방을 찾을 수 없습니다.');
      }

      const query = {
        $or: [
          { sender: userId, receiver: conversationWith },
          { sender: conversationWith, receiver: userId },
        ]
      };

      const totalItems = await this.Message.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
      const currentPage = parseInt(page, 10);

      const messages = await this.Message.find(query)
        .sort({ sentAt: -1 })
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
  }

  /**
   * 메시지 상세 조회
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 메시지 미존재 시 발생
   */
  async getMessageById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const message = await this.Message.findOne({ _id: id, $or: [{ sender: userId }, { receiver: userId }] });
      if (!message) {
        throw new this.CustomError(404, '메시지를 찾을 수 없습니다.');
      }

      res.json({ status: 'success', data: message });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 메시지 읽음 처리
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 메시지 미존재 시 발생
   */
  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const message = await this.Message.findOne({ _id: id, receiver: userId });
      if (!message) {
        throw new this.CustomError(404, '메시지를 찾을 수 없습니다.');
      }

      message.read = true;
      await message.save();

      res.json({ status: 'success', data: message });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MessageController;
