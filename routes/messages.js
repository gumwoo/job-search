// routes/messages.js
/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: 메시지 관련 API
 */
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, query } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: 메시지 전송
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - content
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: 수신자 ID
 *               content:
 *                 type: string
 *                 description: 메시지 내용
 *     responses:
 *       201:
 *         description: 메시지 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 수신자를 찾을 수 없음
 */
// 메시지 전송
router.post('/',
    authMiddleware,
    validate([
      body('receiverId').notEmpty().withMessage('수신자 ID를 입력하세요.'),
      body('content').notEmpty().withMessage('메시지 내용을 입력하세요.'),
    ]),
    messageController.sendMessage
  );
/**
 * @swagger
 * /messages:
 *   get:
 *     summary: 메시지 목록 조회
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: conversationWith
 *         required: true
 *         schema:
 *           type: string
 *         description: 대화 상대방의 사용자 ID
 *     responses:
 *       200:
 *         description: 메시지 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Message'
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 인증 실패
 */
// 메시지 목록 조회
router.get('/',
    authMiddleware,
    validate([
      query('conversationWith').notEmpty().withMessage('대화 상대방의 사용자 ID를 입력하세요.'),
    ]),
    messageController.getMessages
  );

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: 메시지 상세 조회
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 메시지 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 메시지 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 메시지를 찾을 수 없음
 */
// 메시지 상세 조회
router.get('/:id', authMiddleware, messageController.getMessageById);

module.exports = router;
