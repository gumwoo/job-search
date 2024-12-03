// routes/applications.js

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');

// 지원하기
router.post('/', authMiddleware, applicationController.applyJob);

// 지원 내역 조회
router.get('/', authMiddleware, applicationController.getApplications);

// 지원 취소
router.delete('/:id', authMiddleware, applicationController.cancelApplication);

module.exports = router;
