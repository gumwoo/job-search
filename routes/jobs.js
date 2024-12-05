// routes/jobs.js
/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 채용 공고 API
 */
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');
/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: 채용 공고 목록 조회
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "페이지 번호 (기본값: 1)"
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: 지역 필터링
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: 경력 필터링
 *       - in: query
 *         name: salary
 *         schema:
 *           type: string
 *         description: 급여 필터링
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: 기술 스택 필터링 (쉼표로 구분)
 *     responses:
 *       200:
 *         description: 채용 공고 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       400:
 *         description: 잘못된 요청
 */
// 공고 목록 조회
router.get('/', jobController.getJobs);

// 공고 상세 조회
router.get('/:id', jobController.getJobById);
/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: 채용 공고 등록
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company
 *               - title
 *               - link
 *               - location
 *               - experience
 *               - education
 *               - employmentType
 *               - deadline
 *               - sector
 *               - salary
 *               - skills
 *             properties:
 *               company:
 *                 type: string
 *                 description: 회사명
 *               title:
 *                 type: string
 *                 description: 채용 공고 제목
 *               link:
 *                 type: string
 *                 description: 채용 공고 링크
 *               location:
 *                 type: string
 *                 description: 지역
 *               experience:
 *                 type: string
 *                 description: 경력
 *               education:
 *                 type: string
 *                 description: 학력
 *               employmentType:
 *                 type: string
 *                 description: 고용 형태
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: 마감일
 *               sector:
 *                 type: string
 *                 description: 직무 분야
 *               salary:
 *                 type: string
 *                 description: 연봉 정보
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 기술 스택
 *     responses:
 *       201:
 *         description: 채용 공고 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: 입력 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       401:
 *         description: 인증 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: 인증 토큰이 없습니다.
 */
// 채용 공고 등록 (인증 필요)
router.post('/', authMiddleware, jobController.createJob);

// 채용 공고 수정 (인증 필요)
router.put('/:id', authMiddleware, jobController.updateJob);

// 채용 공고 삭제 (인증 필요)
router.delete('/:id', authMiddleware, jobController.deleteJob);

module.exports = router;
