// routes/jobs.js

const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobController');
const Job = require('../models/Job');
const Company = require('../models/Company');
const CustomError = require('../utils/customError');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { param, body, query } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');

// JobController 인스턴스 생성 시 의존성 주입
const jobController = new JobController(Job, Company, CustomError);
/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 채용 공고 API
 */
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
 *       - in: query
 *         name: companyName
 *         schema:
 *           type: string
 *         description: 회사명 필터링
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, views]
 *         description: 정렬 기준 필드
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: 정렬 순서
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
router.get('/',
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('페이지 번호는 1 이상의 정수여야 합니다.'),
    query('sortBy').optional().isString(),
    query('order').optional().isIn(['asc', 'desc']),
    query('location').optional().isString(),
    query('experience').optional().isString(),
    query('salary').optional().isString(),
    query('skills').optional().isString(),
    query('keyword').optional().isString(),
    query('companyName').optional().isString(), // 추가
  ]),
  (req, res, next) => jobController.getJobs(req, res, next)
);

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
 *               - companyId
 *               - title
 *               - location
 *               - experience
 *               - education
 *               - employmentType
 *               - deadline
 *               - sector
 *               - salary
 *               - skills
 *               - link
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: 회사 ID (참조)
 *                 example: 60d0fe4f5311236168a109cc
 *               title:
 *                 type: string
 *                 description: 채용 공고 제목
 *                 example: 백엔드 개발자
 *               location:
 *                 type: string
 *                 description: 지역
 *                 example: 서울
 *               experience:
 *                 type: string
 *                 description: 경력
 *                 example: 3년 이상
 *               education:
 *                 type: string
 *                 description: 학력
 *                 example: 학사
 *               employmentType:
 *                 type: string
 *                 description: 고용 형태
 *                 example: 정규직
 *               deadline:
 *                 type: string
 *                 description: 마감일
 *                 example: 2024-12-31
 *               sector:
 *                 type: string
 *                 description: 직무 분야
 *                 example: 소프트웨어 개발
 *               salary:
 *                 type: string
 *                 description: 연봉 정보
 *                 example: 연봉 5000만원 이상
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: Node.js
 *               link:
 *                 type: string
 *                 description: 채용 공고 링크
 *                 example: https://www.saramin.co.kr/job/123456
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
 *         description: 입력 데이터 오류 또는 중복 공고
 *       401:
 *         description: 인증 실패
 */
router.post('/',
  authMiddleware,
  adminMiddleware,
  validate([
    body('companyId').isMongoId().withMessage('유효한 회사 ID를 입력하세요.'),
    body('title').notEmpty().withMessage('채용 공고 제목을 입력하세요.'),
    body('location').notEmpty().withMessage('지역을 입력하세요.'),
    body('experience').notEmpty().withMessage('경력을 입력하세요.'),
    body('education').notEmpty().withMessage('학력을 입력하세요.'),
    body('employmentType').notEmpty().withMessage('고용 형태를 입력하세요.'),
    body('deadline').isISO8601().withMessage('유효한 마감일을 입력하세요.'),
    body('sector').notEmpty().withMessage('직무 분야를 입력하세요.'),
    body('salary').notEmpty().withMessage('연봉 정보를 입력하세요.'),
    body('skills').isArray().withMessage('기술 스택은 배열 형태로 입력하세요.'),
    body('link').isURL().withMessage('유효한 채용 공고 링크를 입력하세요.'),
  ]),
  (req, res, next) => jobController.createJob(req, res, next)
);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: 채용 공고 수정
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 채용 공고 ID
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109cb
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: 회사 ID (참조)
 *                 example: 60d0fe4f5311236168a109cc
 *               title:
 *                 type: string
 *                 description: 채용 공고 제목
 *                 example: 백엔드 개발자
 *               location:
 *                 type: string
 *                 description: 지역
 *                 example: 서울
 *               experience:
 *                 type: string
 *                 description: 경력
 *                 example: 3년 이상
 *               education:
 *                 type: string
 *                 description: 학력
 *                 example: 학사
 *               employmentType:
 *                 type: string
 *                 description: 고용 형태
 *                 example: 정규직
 *               deadline:
 *                 type: string
 *                 description: 마감일
 *                 example: 2024-12-31
 *               sector:
 *                 type: string
 *                 description: 직무 분야
 *                 example: 소프트웨어 개발
 *               salary:
 *                 type: string
 *                 description: 연봉 정보
 *                 example: 연봉 5000만원 이상
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: Node.js
 *               link:
 *                 type: string
 *                 description: 채용 공고 링크
 *                 example: https://www.saramin.co.kr/job/123456
 *     responses:
 *       200:
 *         description: 채용 공고 수정 성공
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
 *         description: 입력 데이터 오류 또는 중복 링크
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 */
router.put('/:id',
  authMiddleware,
  adminMiddleware,
  validate([
    body('companyId').optional().isMongoId().withMessage('유효한 회사 ID를 입력하세요.'),
    body('title').optional().notEmpty().withMessage('채용 공고 제목을 입력하세요.'),
    body('location').optional().notEmpty().withMessage('지역을 입력하세요.'),
    body('experience').optional().notEmpty().withMessage('경력을 입력하세요.'),
    body('education').optional().notEmpty().withMessage('학력을 입력하세요.'),
    body('employmentType').optional().notEmpty().withMessage('고용 형태를 입력하세요.'),
    body('deadline').optional().isISO8601().withMessage('유효한 마감일을 입력하세요.'),
    body('sector').optional().notEmpty().withMessage('직무 분야를 입력하세요.'),
    body('salary').optional().notEmpty().withMessage('연봉 정보를 입력하세요.'),
    body('skills').optional().isArray().withMessage('기술 스택은 배열 형태로 입력하세요.'),
    body('link').optional().isURL().withMessage('유효한 채용 공고 링크를 입력하세요.'),
  ]),
  (req, res, next) => jobController.updateJob(req, res, next)
);
/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: 채용 공고 상세 조회
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 채용 공고 ID
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109cb
 *     responses:
 *       200:
 *         description: 채용 공고 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobDetailResponse'
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id',
  validate([
    param('id').isMongoId().withMessage('유효한 채용 공고 ID를 입력하세요.')
  ]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const job = await Job.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } }, // 조회수 1 증가
        { new: true }           // 업데이트된 문서를 반환
      ).populate('company');

      if (!job) {
        return res.status(404).json({ status: 'error', message: '채용 공고를 찾을 수 없습니다.', code: 'JOB_NOT_FOUND' });
      }

      // 관련 공고 추천 (예: 동일한 직무 분야 또는 기술 스택을 가진 공고)
      const relatedJobs = await Job.find({
        _id: { $ne: id },
        $or: [
          { sector: job.sector },
          { skills: { $in: job.skills } }
        ]
      }).limit(5).populate('company');

      res.json({
        status: 'success',
        data: job,
        relatedJobs
      });
    } catch (err) {
      next(err);
    }
  }
);
/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: 채용 공고 삭제
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 채용 공고 ID
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109cb
 *     responses:
 *       200:
 *         description: 채용 공고 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: 채용 공고가 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:id',
  authMiddleware,
  adminMiddleware,
  validate([
    param('id').isMongoId().withMessage('유효한 채용 공고 ID를 입력하세요.')
  ]),
  (req, res, next) => jobController.deleteJob(req, res, next)
);

/**
 * @swagger
 * /jobs/aggregate/skills:
 *   get:
 *     summary: 기술 스택별 채용 공고 수 집계
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 기술 스택별 채용 공고 수 집계 성공
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
// 기술 스택별 채용 공고 수 집계
router.get('/aggregate/skills',
  authMiddleware,
  (req, res, next) => jobController.aggregateSkills(req, res, next)
);

module.exports = router;
