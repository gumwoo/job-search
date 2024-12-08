// models/Job.js
/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         company:
 *           type: string
 *           description: 회사명
 *         title:
 *           type: string
 *           description: 채용 공고 제목
 *         link:
 *           type: string
 *           description: 채용 공고 링크
 *         location:
 *           type: string
 *           description: 지역
 *         experience:
 *           type: string
 *           description: 경력
 *         education:
 *           type: string
 *           description: 학력
 *         employmentType:
 *           type: string
 *           description: 고용 형태
 *         deadline:
 *           type: string
 *           description: 마감일
 *         sector:
 *           type: string
 *           description: 직무 분야
 *         salary:
 *           type: string
 *           description: 연봉 정보
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: 기술 스택
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: String,
  title: String,
  link: { type: String, unique: true },
  location: String,
  experience: String,
  education: String,
  employmentType: String,
  deadline: String,
  sector: String,
  salary: String,
  skills: [String],
  views: { type: Number, default: 0 }, // 조회수 필드 추가
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 조회 시 `updatedAt` 업데이트
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', jobSchema);
