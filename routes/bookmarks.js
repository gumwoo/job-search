// routes/bookmarks.js

const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmarkController');
const Bookmark = require('../models/Bookmark');
const CustomError = require('../utils/customError');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, param, query } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');

// BookmarkController 인스턴스 생성 시 의존성 주입
const bookmarkController = new BookmarkController(Bookmark, CustomError);
/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: 북마크 관련 API
 */

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: 북마크 토글 (추가/제거)
 *     tags: [Bookmarks]
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
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: 북마크할 채용 공고 ID
 *     responses:
 *       201:
 *         description: 북마크 추가 성공
 *       200:
 *         description: 북마크 제거 성공
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 */
// 북마크 토글 (추가/제거)
router.post('/',
  authMiddleware,
  validate([
    body('jobId').isMongoId().withMessage('유효한 채용 공고 ID를 입력하세요.')
  ]),
  (req, res, next) => bookmarkController.toggleBookmark(req, res, next)
);

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: 관심 공고 목록 조회
 *     tags: [Bookmarks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "페이지 번호 (기본값: 1)"
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: 지역 필터링
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: 경력 필터링
 *       - in: query
 *         name: salary
 *         schema:
 *           type: string
 *         description: 급여 필터링
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: 기술 스택 필터링 (쉼표로 구분)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 키워드 검색
 *     responses:
 *       200:
 *         description: 북마크 목록 조회 성공
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 인증 실패
 */
 // 북마크 목록 조회 with 필터링 및 검색
router.get('/',
  authMiddleware,
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('페이지 번호는 1 이상의 정수여야 합니다.'),
    query('location').optional().isString().withMessage('유효한 지역을 입력하세요.'),
    query('experience').optional().isString().withMessage('유효한 경력을 입력하세요.'),
    query('salary').optional().isString().withMessage('유효한 급여를 입력하세요.'),
    query('skills').optional().isString().withMessage('유효한 기술 스택을 입력하세요.'),
    query('keyword').optional().isString().withMessage('유효한 키워드를 입력하세요.'),
  ]),
  (req, res, next) => bookmarkController.getBookmarks(req, res, next)
);

/**
 * @swagger
 * /bookmarks/{id}:
 *   delete:
 *     summary: 북마크 제거
 *     tags: [Bookmarks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 제거할 북마크 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 북마크 제거 성공
 *       404:
 *         description: 북마크를 찾을 수 없음
 *       401:
 *         description: 인증 실패
 */
// 북마크 제거
router.delete('/:id',
  authMiddleware,
  validate([
    param('id').isMongoId().withMessage('유효한 북마크 ID를 입력하세요.')
  ]),
  (req, res, next) => bookmarkController.removeBookmark(req, res, next)
);

module.exports = router;
