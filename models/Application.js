// models/Application.js

const mongoose = require('mongoose');

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
