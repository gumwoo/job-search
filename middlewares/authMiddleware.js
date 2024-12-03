// middlewares/authMiddleware.js

module.exports = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ status: 'error', message: '인증이 필요합니다.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      if (!req.user) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
      next();
    } catch (err) {
      res.status(401).json({ status: 'error', message: '인증이 유효하지 않습니다.' });
    }
  };
  