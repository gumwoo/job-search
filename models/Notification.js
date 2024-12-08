// models/Notification.js

const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d0fe4f5311236168a109d1
 *         user:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *         type:
 *           type: string
 *           example: application
 *         content:
 *           type: string
 *           example: 새로운 지원이 접수되었습니다.
 *         read:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-01T12:34:56.789Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-01T12:34:56.789Z
 */
const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: { 
    type: String,
    required: true
  },
  content: { type: String, required: true },
  read: { type: Boolean, default: false }, // 'read' 필드 사용
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 조회 시 `updatedAt` 업데이트
notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
// 복합 인덱스 설정
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
