// models/Company.js

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  industry: String,
  size: String,
  location: String,
  // 추가 필드들...
});

module.exports = mongoose.model('Company', companySchema);
