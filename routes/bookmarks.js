// routes/bookmarks.js

const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const authMiddleware = require('../middlewares/authMiddleware');

// 북마크 추가/제거
router.post('/', authMiddleware, bookmarkController.toggleBookmark);

// 북마크 목록 조회
router.get('/', authMiddleware, bookmarkController.getBookmarks);

module.exports = router;
