// routes/notifications.js
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: 알림 관련 API
 */
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: 알림 목록 조회
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 알림 목록 조회 성공
 *       401:
 *         description: 인증 실패
 */
// 알림 목록 조회
router.get('/', authMiddleware, notificationController.getNotifications);
/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: 알림 읽음 처리
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 알림 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 알림 읽음 처리 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 알림을 찾을 수 없음
 */
// 알림 읽음 처리
router.put('/:id/read', authMiddleware, notificationController.markAsRead);

module.exports = router;
