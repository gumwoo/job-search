// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CustomError = require('../utils/customError');

/**
 * 인증 미들웨어
 * 사용자의 JWT를 검증하고, 인증된 사용자를 req.user에 설정합니다.
 * @param {Request} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 * @param {Function} next - Express next 미들웨어 함수
 */
module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  // Authorization 헤더 확인
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: '인증이 필요합니다.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // JWT 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 사용자 존재 여부 확인
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new CustomError(401, '사용자를 찾을 수 없습니다.');
    }
    
    // 인증된 사용자 정보 설정
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: '인증이 유효하지 않습니다.' });
  }
};
