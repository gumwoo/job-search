// models/Resume.js

const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     Resume:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d0fe4f5311236168a109d2
 *         user:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *         title:
 *           type: string
 *           example: 경력직 이력서
 *         content:
 *           type: string
 *           example: 경력 내용...
 *         file:
 *           type: string
 *           example: /uploads/resumes/60d0fe4f5311236168a109d2.pdf
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-01T12:34:56.789Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-01T12:34:56.789Z
 */
const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  file: { type: String }, // 이력서 파일 경로
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 조회 시 `updatedAt` 업데이트
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
// 인덱스 설정
resumeSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
