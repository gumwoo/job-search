// models/Message.js
/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d0fe4f5311236168a109d0
 *         sender:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *         receiver:
 *           type: string
 *           example: 60d0fe4f5311236168a109cb
 *         content:
 *           type: string
 *           example: 안녕하세요!
 *         read:
 *           type: boolean
 *           example: false
 *         sentAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-01T12:34:56.789Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-01T12:34:56.789Z
 */
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: { // 일관성 있게 'receiver' 사용
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 조회 시 `updatedAt` 업데이트
messageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
// 복합 인덱스 설정
messageSchema.index({ sender: 1, receiver: 1, sentAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
