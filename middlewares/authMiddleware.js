// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    console.log('=== Auth Middleware Log ===');
    console.log('Headers:', req.headers);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Extracted token:', token);
  
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ status: 'error', message: '인증이 필요합니다.' });
    }
  
    try {
      console.log('JWT Secret:', process.env.JWT_SECRET?.substring(0, 10) + '...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      
      req.user = await User.findById(decoded.userId);
      console.log('Found user:', req.user ? 'Yes' : 'No');
      
      if (!req.user) {
        console.log('User not found in database');
        return res.status(401).json({ status: 'error', message: '사용자를 찾을 수 없습니다.' });
      }
      
      next();
    } catch (err) {
      console.error('Token verification error:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      return res.status(401).json({ status: 'error', message: '인증이 유효하지 않습니다.' });
    }
};
