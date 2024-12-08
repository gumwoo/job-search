// routes/applications.js

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, param, query } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');
/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: 지원 관련 API
 */
/**
 * @swagger
 * /applications:
 *   post:
 *     summary: 지원하기
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - resumeId
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: 채용 공고 ID
 *                 example: 60d0fe4f5311236168a109cb
 *               resumeId:
 *                 type: string
 *                 description: 이력서 ID
 *                 example: 60d0fe4f5311236168a109ce
 *     responses:
 *       201:
 *         description: 지원 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: 입력 데이터 오류 또는 중복 지원
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 채용 공고 또는 이력서를 찾을 수 없음
 */
// 지원하기
router.post('/',
    authMiddleware,
    validate([
      body('jobId').isMongoId().withMessage('유효한 채용 공고 ID를 입력하세요.'),
      body('resumeId').isMongoId().withMessage('유효한 이력서 ID를 입력하세요.'),
    ]),
    applicationController.applyJob
  );
// 지원 내역 조회
/**
 * @swagger
 * /applications:
 *   get:
 *     summary: 지원 내역 조회
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "페이지 번호 (기본값: 1)"
 *     responses:
 *       200:
 *         description: 지원 내역 조회 성공
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
 *                     $ref: '#/components/schemas/Application'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *       401:
 *         description: 인증 실패
 */
router.get('/',
    authMiddleware,
    validate([
      query('page').optional().isInt({ min: 1 }).withMessage('페이지 번호는 1 이상의 정수여야 합니다.')
    ]),
    applicationController.getApplications
  );
  
// 지원 취소
/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: 지원 취소
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 지원 ID
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109cd
 *     responses:
 *       200:
 *         description: 지원 취소 성공
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
 *                   example: 지원이 취소되었습니다.
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 지원을 찾을 수 없음
 */
router.delete('/:id',
    authMiddleware,
    validate([
      param('id').isMongoId().withMessage('유효한 지원 ID를 입력하세요.')
    ]),
    applicationController.cancelApplication
  );
module.exports = router;
