// models/Message.js
/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - sender
 *         - receiver
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: 메시지 ID
 *         sender:
 *           type: string
 *           description: 발신자 ID
 *         receiver:
 *           type: string
 *           description: 수신자 ID
 *         content:
 *           type: string
 *           description: 메시지 내용
 *         isRead:
 *           type: boolean
 *           description: 메시지 읽음 여부
 *           default: false
 *         sentAt:
 *           type: string
 *           format: date-time
 *           description: 메시지 보낸 시각
 */
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
