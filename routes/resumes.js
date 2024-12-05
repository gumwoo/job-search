// routes/resumes.js
/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: 이력서 관리 API
 */
const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');
/**
 * @swagger
 * /resumes:
 *   post:
 *     summary: 이력서 작성
 *     tags: [Resumes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: 이력서 제목
 *               content:
 *                 type: string
 *                 description: 이력서 내용
 *     responses:
 *       201:
 *         description: 이력서 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Resume'
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 인증 실패
 */
// 이력서 작성
router.post('/',
    authMiddleware,
    validate([
      body('title').notEmpty().withMessage('제목을 입력하세요.'),
      body('content').notEmpty().withMessage('내용을 입력하세요.'),
    ]),
    resumeController.createResume
  );

/**
 * @swagger
 * /resumes:
 *   get:
 *     summary: 이력서 목록 조회
 *     tags: [Resumes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 이력서 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resume'
 *       401:
 *         description: 인증 실패
 */
// 이력서 목록 조회
router.get('/', authMiddleware, resumeController.getResumes);
/**
 * @swagger
 * /resumes/{id}:
 *   put:
 *     summary: 이력서 수정
 *     tags: [Resumes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 이력서 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 이력서 제목
 *               content:
 *                 type: string
 *                 description: 이력서 내용
 *     responses:
 *       200:
 *         description: 이력서 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Resume'
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 이력서를 찾을 수 없음
 */
// 이력서 수정
router.put('/:id', authMiddleware, resumeController.updateResume);
/**
 * @swagger
 * /resumes/{id}:
 *   delete:
 *     summary: 이력서 삭제
 *     tags: [Resumes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 이력서 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 이력서 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 이력서를 찾을 수 없음
 */
// 이력서 삭제
router.delete('/:id', authMiddleware, resumeController.deleteResume);

module.exports = router;
