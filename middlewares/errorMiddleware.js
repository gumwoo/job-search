// middlewares/errorMiddleware.js

const CustomError = require('../utils/customError');
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  // 로깅
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  logger.error(err.stack);

  // 에러 응답 포맷
  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 에러가 발생했습니다.';
  const errors = err.errors || [];

  // 운영적 에러인지 확인
  if (err.isOperational) {
    res.status(statusCode).json({
      status: statusCode >= 400 && statusCode < 500 ? 'error' : 'fail',
      message,
      errors,
    });
  } else {
    // 비운영적 에러인 경우 (예: 프로그래밍 오류)
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({
        status: 'error',
        message: '서버 에러가 발생했습니다.',
        error: err,
        stack: err.stack,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: '서버 에러가 발생했습니다.',
      });
    }
  }
};
