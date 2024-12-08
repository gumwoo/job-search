// middlewares/adminMiddleware.js

module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: '권한이 없습니다.' });
    }
    next();
  };
  