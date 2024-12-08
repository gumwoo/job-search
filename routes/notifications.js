// routes/notifications.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');
const { param,query } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: 알림 관련 API
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: 알림 목록 조회
 *     tags: [Notifications]
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
 *         description: 알림 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Notification'
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
 // 알림 목록 조회
 router.get('/',
  authMiddleware,
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('페이지 번호는 1 이상의 정수여야 합니다.')
  ]),
  notificationController.getNotifications
);
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
 *           example: 60d0fe4f5311236168a109d1
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
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 알림을 찾을 수 없음
 */
 // 알림 읽음 처리
 router.put('/:id/read',
    authMiddleware,
    validate([
      param('id').isMongoId().withMessage('유효한 알림 ID를 입력하세요.')
    ]),
    notificationController.markAsRead
  );
/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: 알림 삭제
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
 *           example: 60d0fe4f5311236168a109d1
 *     responses:
 *       200:
 *         description: 알림 삭제 성공
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
 *                   example: 알림이 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 알림을 찾을 수 없음
 */
// 알림 삭제
router.delete('/:id',
    authMiddleware,
    validate([
      param('id').isMongoId().withMessage('유효한 알림 ID를 입력하세요.')
    ]),
    notificationController.deleteNotification
  );
module.exports = router;
