// controllers/notificationController.js

/**
 * NotificationController 클래스는 알림과 관련된 모든 비즈니스 로직을 처리합니다.
 */
class NotificationController {
  /**
   * NotificationController 생성자
   * @param {Model} notificationModel - Notification Mongoose 모델
   * @param {CustomError} customError - 커스텀 에러 클래스
   */
  constructor(notificationModel, customError) {
    this.Notification = notificationModel;
    this.CustomError = customError;
  }

  /**
   * 알림 목록 조회
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 데이터베이스 오류 시 발생
   */
  async getNotifications(req, res, next) {
    try {
      const userId = req.user._id;
      const { page = 1 } = req.query;
      const limit = 20;
      const skip = (page - 1) * limit;

      const query = { user: userId };

      const totalItems = await this.Notification.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
      const currentPage = parseInt(page, 10);

      const notifications = await this.Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.json({
        status: 'success',
        data: notifications,
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
   * 알림 읽음 처리
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 알림 미존재 시 발생
   */
  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const notification = await this.Notification.findOne({ _id: id, user: userId });
      if (!notification) {
        throw new this.CustomError(404, '알림을 찾을 수 없습니다.');
      }

      notification.read = true;
      await notification.save();

      res.json({ status: 'success', data: notification });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 알림 삭제
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 알림 미존재 시 발생
   */
  async deleteNotification(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const notification = await this.Notification.findOne({ _id: id, user: userId });
      if (!notification) {
        throw new this.CustomError(404, '알림을 찾을 수 없습니다.');
      }

      await this.Notification.deleteOne({ _id: id });

      res.json({ status: 'success', message: '알림이 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NotificationController;
