// models/Notification.js
/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - user
 *         - type
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *           description: 알림 ID
 *         user:
 *           type: string
 *           description: 알림을 받는 사용자 ID
 *         type:
 *           type: string
 *           description: 알림 유형 (예: application_status, new_job)
 *         message:
 *           type: string
 *           description: 알림 메시지 내용
 *         isRead:
 *           type: boolean
 *           description: 알림 읽음 여부
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 알림 생성 시각
 */
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // 예: 'application_status', 'new_job', etc.
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  // 추가 필드...
});

module.exports = mongoose.model('Notification', notificationSchema);
