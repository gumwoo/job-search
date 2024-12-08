// controllers/notificationController.js

const Notification = require('../models/Notification');
const CustomError = require('../utils/customError');

// 알림 목록 조회
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalItems = await Notification.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = parseInt(page, 10);

    const notifications = await Notification.find({ user: req.user._id })
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
};

// 알림 읽음 처리
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { read: true }, // 'read' 필드 사용
      { new: true }
    );

    if (!notification) {
      throw new CustomError(404, '알림을 찾을 수 없습니다.');
    }

    res.json({ status: 'success', data: notification });
  } catch (err) {
    next(err);
  }
};

// 알림 삭제
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({ _id: id, user: req.user._id });

    if (!notification) {
      throw new CustomError(404, '알림을 찾을 수 없습니다.');
    }

    res.json({ status: 'success', message: "알림이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};
