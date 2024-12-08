// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CustomError = require('../utils/customError');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: '인증이 필요합니다.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new CustomError(401, '사용자를 찾을 수 없습니다.');
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: '인증이 유효하지 않습니다.' });
  }
};
