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
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  link: { type: String, unique: true, required: true },
  location: { type: String, required: true },
  experience: { type: String, required: true },
  education: { type: String, required: true },
  employmentType: { type: String, required: true },
  deadline: { type: String, required: true },
  sector: { type: String, required: true },
  salary: { type: String, required: true },
  skills: { type: [String], required: true },
  views: { type: Number, default: 0 }, // 조회수 필드 추가
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 조회 시 `updatedAt` 업데이트
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
//skills 필드에 텍스트 인덱스를 추가
jobSchema.index({ skills: 'text' });
// 복합 인덱스 설정 (자주 사용하는 필드 조합)
jobSchema.index({ location: 1, experience: 1, salary: 1, sector: 1 });
module.exports = mongoose.model('Job', jobSchema);
