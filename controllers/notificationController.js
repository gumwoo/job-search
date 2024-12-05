// controllers/notificationController.js

const Notification = require('../models/Notification');
const CustomError = require('../utils/customError');

// 알림 목록 조회
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ status: 'success', data: notifications });
  } catch (err) {
    next(err);
  }
};

// 알림 읽음 처리
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      throw new CustomError(404, '알림을 찾을 수 없습니다.');
    }

    res.json({ status: 'success', data: notification });
  } catch (err) {
    next(err);
  }
};
