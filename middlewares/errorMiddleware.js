// middlewares/errorMiddleware.js

const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 에러가 발생했습니다.';
  const errors = err.errors || [];

  res.status(statusCode).json({
    status: statusCode >= 400 && statusCode < 500 ? 'error' : 'fail',
    message,
    errors,
  });
};
