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
  skills: String,
  // 필요한 추가 필드들을 여기에 정의하세요.
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
