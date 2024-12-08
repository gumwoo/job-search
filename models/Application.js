// models/Application.js

const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d0fe4f5311236168a109cd
 *         user:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *         job:
 *           type: string
 *           example: 60d0fe4f5311236168a109cb
 *         resume:
 *           type: string
 *           example: 60d0fe4f5311236168a109ce
 *         status:
 *           type: string
 *           example: Pending
 *         appliedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-01T12:34:56.789Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-01T12:34:56.789Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-01T12:34:56.789Z
 */
const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'],
    default: 'Pending'
  },
  appliedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 조회 시 `updatedAt` 업데이트
applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
// 복합 인덱스 설정
applicationSchema.index({ user: 1, job: 1 });

module.exports = mongoose.model('Application', applicationSchema);
