// models/Company.js

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  industry: String,
  size: String,
  location: String,
});
// 인덱스 설정
companySchema.index({ name: 1 });
module.exports = mongoose.model('Company', companySchema);
