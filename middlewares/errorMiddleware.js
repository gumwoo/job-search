// middlewares/errorMiddleware.js

const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  // HTTP 상태 코드 설정
  const statusCode = err.statusCode || 500;

  // 에러 로깅
  logger.error(`${req.method} ${req.url} - ${err.message}`, {
    stack: err.stack,
    statusCode: statusCode,
    errors: err.errors || null,
  });

  // 에러 응답 포맷 통일
  res.status(statusCode).json({
    status: 'error',
    message: err.message || '서버 오류가 발생했습니다.',
    errors: err.errors || null,
  });
};
