// routes/resumes.js

const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, param } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');
const multer = require('multer');
const path = require('path');

// Multer 설정 for 이력서 업로드
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

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
 *         multipart/form-data:
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
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 이력서 파일 (선택)
 *     responses:
 *       201:
 *         description: 이력서 작성 성공
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 인증 실패
 */
 // 이력서 작성
router.post('/',
    authMiddleware,
    upload.single('file'),
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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "페이지 번호 (기본값: 1)"
 *     responses:
 *       200:
 *         description: 이력서 목록 조회 성공
 *       401:
 *         description: 인증 실패
 */
 // 이력서 목록 조회
router.get('/',
    authMiddleware,
    validate([
      // 추가적인 쿼리 파라미터 검증 가능
      // 예: page 파라미터 검증
      body('page').optional().isInt({ min: 1 }).withMessage('페이지 번호는 1 이상의 정수여야 합니다.')
    ]),
    resumeController.getResumes
  );

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 이력서 제목
 *               content:
 *                 type: string
 *                 description: 이력서 내용
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 이력서 파일 (선택)
 *     responses:
 *       200:
 *         description: 이력서 수정 성공
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 이력서를 찾을 수 없음
 */
 // 이력서 수정
router.put('/:id',
    authMiddleware,
    upload.single('file'),
    validate([
      body('title').optional().notEmpty().withMessage('제목을 입력하세요.'),
      body('content').optional().notEmpty().withMessage('내용을 입력하세요.'),
    ]),
    resumeController.updateResume
  );

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
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 이력서를 찾을 수 없음
 */
 // 이력서 삭제
router.delete('/:id',
    authMiddleware,
    validate([
      param('id').isMongoId().withMessage('유효한 이력서 ID를 입력하세요.')
    ]),
    resumeController.deleteResume
  );

module.exports = router;
