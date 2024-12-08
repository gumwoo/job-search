// models/Bookmark.js

const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     Bookmark:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d0fe4f5311236168a109cf
 *         user:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *         job:
 *           type: string
 *           example: 60d0fe4f5311236168a109cb
 *         bookmarkedAt:
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
const bookmarkSchema = new mongoose.Schema({
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
  bookmarkedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 조회 시 `updatedAt` 업데이트
bookmarkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
// 복합 인덱스 설정
bookmarkSchema.index({ user: 1, job: 1 });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
