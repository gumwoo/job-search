// models/Application.js

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  // 추가 필드들...
});

module.exports = mongoose.model('Application', applicationSchema);
