// routes/auth.js

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 회원 관리 API
 */

const { body } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
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
 *                 description: 이메일 주소
 *               password:
 *                 type: string
 *                 description: 비밀번호 (6자 이상)
 *               name:
 *                 type: string
 *                 description: 사용자 이름
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
 *                 description: 이메일 주소
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *     responses:
 *       200:
 *         description: 로그인 성공
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
 *                   description: 액세스 토큰 (JWT)
 *                 refreshToken:
 *                   type: string
 *                   description: 리프레시 토큰
 *       400:
 *         description: 입력 데이터 오류 또는 인증 실패
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
 *                   example: 존재하지 않는 이메일입니다.
 *       401:
 *         description: 인증 실패 (유효하지 않은 토큰 등)
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
 *                   example: 유효하지 않은 토큰입니다.
 *       500:
 *         description: 서버 내부 오류
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
 *                   example: 서버 오류가 발생했습니다.
 */
// 로그인
router.post('/login',
    validate([
      body('email').isEmail().withMessage('유효한 이메일을 입력하세요.'),
      body('password').isLength({ min: 6 }).withMessage('비밀번호가 올바르지 않습니다.'),
    ]),
    authController.login
  );

// 회원 정보 수정
router.put('/profile', authMiddleware, authController.updateProfile);

// 회원 탈퇴
router.delete('/profile', authMiddleware, authController.deleteAccount);
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
 *                   description: 새로운 액세스 토큰 (JWT)
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
router.post('/refresh', authController.refreshToken);
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
 *       500:
 *         description: 서버 오류
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
 *                   example: 서버 오류가 발생했습니다.
 */
// 로그아웃
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
