// models/Resume.js
/**
 * @swagger
 * components:
 *   schemas:
 *     Resume:
 *       type: object
 *       required:
 *         - user
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: 이력서 ID
 *         user:
 *           type: string
 *           description: 이력서 소유자 ID
 *         title:
 *           type: string
 *           description: 이력서 제목
 *         content:
 *           type: string
 *           description: 이력서 내용 (HTML 또는 마크다운)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 이력서 생성 시각
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 이력서 수정 시각
 */
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // 이력서 내용 (HTML 또는 마크다운)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // 추가 필드: 학력, 경력, 기술 스택 등
});

module.exports = mongoose.model('Resume', resumeSchema);
