// routes/messages.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, query, param } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: 메시지 관련 API
 */

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
      body('receiverId').isMongoId().withMessage('유효한 수신자 ID를 입력하세요.'),
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "페이지 번호 (기본값: 1)"
 *     responses:
 *       200:
 *         description: 메시지 목록 조회 성공
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 인증 실패
 */
 // 메시지 목록 조회
router.get('/',
    authMiddleware,
    validate([
      query('conversationWith').isMongoId().withMessage('유효한 대화 상대방 ID를 입력하세요.'),
      query('page').optional().isInt({ min: 1 }).withMessage('페이지 번호는 1 이상의 정수여야 합니다.')
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
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 메시지를 찾을 수 없음
 */
 // 메시지 상세 조회
router.get('/:id',
    authMiddleware,
    validate([
      param('id').isMongoId().withMessage('유효한 메시지 ID를 입력하세요.')
    ]),
    messageController.getMessageById
  );

/**
 * @swagger
 * /messages/{id}/read:
 *   patch:
 *     summary: 메시지 읽음 처리
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
 *         description: 메시지 읽음 처리 성공
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 메시지를 찾을 수 없음
 */
 // 메시지 읽음 처리
router.patch('/:id/read',
    authMiddleware,
    validate([
      param('id').isMongoId().withMessage('유효한 메시지 ID를 입력하세요.')
    ]),
    messageController.markAsRead
  );

module.exports = router;
