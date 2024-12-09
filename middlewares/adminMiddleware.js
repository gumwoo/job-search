// middlewares/adminMiddleware.js

/**
 * 관리자 권한 확인 미들웨어
 * 사용자가 'admin' 역할을 가지고 있는지 확인합니다.
 * @param {Request} req - Express 요청 객체
 * @param {Response} res - Express 응답 객체
 * @param {Function} next - Express next 미들웨어 함수
 */
module.exports = (req, res, next) => {
  if (req.user.role !== 'admin') {
    // 관리자가 아닌 경우 403 Forbidden 응답
    return res.status(403).json({ status: 'error', message: '권한이 없습니다.' });
  }
  // 관리자인 경우 다음 미들웨어로 진행
  next();
};
