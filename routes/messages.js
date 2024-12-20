// routes/messages.js

const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');
const Message = require('../models/Message');
const User = require('../models/User');
const CustomError = require('../utils/customError');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, query, param } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: 메시지 관련 API
 */

// MessageController 인스턴스 생성 시 의존성 주입
const messageController = new MessageController(Message, User, CustomError);

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
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: 입력 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
  (req, res, next) => messageController.sendMessage(req, res, next)
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
 *                     $ref: '#/components/schemas/Message'
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
 *       400:
 *         description: 입력 데이터 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
  (req, res, next) => messageController.getMessages(req, res, next)
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
 *         description: 메시지 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 메시지를 찾을 수 없음
 */
 // 메시지 상세 조회
// 메시지 상세 조회
router.get('/:id',
  authMiddleware,
  validate([
    param('id').isMongoId().withMessage('유효한 메시지 ID를 입력하세요.')
  ]),
  (req, res, next) => messageController.getMessageById(req, res, next)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Message'
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
  (req, res, next) => messageController.markAsRead(req, res, next)
);

module.exports = router;
