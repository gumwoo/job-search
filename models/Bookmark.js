// models/Bookmark.js

const mongoose = require('mongoose');

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
