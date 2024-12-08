// routes/auth.js

const { body } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 사용자 인증 관련 API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원 가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: password123
 *               name:
 *                 type: string
 *                 description: 사용자 이름
 *                 example: 홍길동
 *     responses:
 *       201:
 *         description: 회원 가입 성공
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
 *                   example: 회원 가입 성공
 *       400:
 *         description: 입력 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// 회원 가입
router.post('/register',
    validate([
      body('email').isEmail().withMessage('유효한 이메일을 입력하세요.'),
      body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
      body('name').notEmpty().withMessage('이름을 입력하세요.'),
    ]),
    authController.register
  );

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: password123
 *     responses:
 *       200:
 *         description: 로그인 성공, 토큰 발급
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *       400:
 *         description: 입력 데이터 오류 또는 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// 로그인
router.post('/login',
    validate([
      body('email').isEmail().withMessage('유효한 이메일을 입력하세요.'),
      body('password').isLength({ min: 6 }).withMessage('비밀번호가 올바르지 않습니다.'),
    ]),
    authController.login
  );
/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: 회원 정보 수정
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 사용자 이름
 *                 example: 홍길동
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: 회원 정보 수정 성공
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
 *                   example: 회원 정보가 수정되었습니다.
 *       400:
 *         description: 입력 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// 회원 정보 수정
router.put('/profile',
  authMiddleware,
  validate([
    body('name').optional().notEmpty().withMessage('이름을 입력하세요.'),
    body('password').optional().isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
  ]),
  authController.updateProfile
);
/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: 회원 정보 조회
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 회원 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// 회원 정보 조회
router.get('/profile', authMiddleware, authController.getProfile);
/**
 * @swagger
 * /auth/account:
 *   delete:
 *     summary: 회원 탈퇴
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 회원 탈퇴 성공
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
 *                   example: 회원 탈퇴가 완료되었습니다.
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// 회원 탈퇴
router.delete('/account', authMiddleware, authController.deleteAccount);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 토큰 갱신
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: 리프레시 토큰
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 accessToken:
 *                   type: string
 *                   description: "새로운 액세스 토큰 (JWT)"
 *       400:
 *         description: Refresh Token이 없습니다.
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
 *                   example: Refresh Token이 없습니다.
 *       401:
 *         description: 유효하지 않은 Refresh Token입니다.
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
 *                   example: 유효하지 않은 Refresh Token입니다.
 */
// 토큰 갱신
router.post('/refresh',
  validate([
    body('refreshToken').notEmpty().withMessage('Refresh Token을 제공해야 합니다.'),
  ]),
  authController.refreshToken
);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
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
 *                   example: 로그아웃 되었습니다.
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// 로그아웃
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
