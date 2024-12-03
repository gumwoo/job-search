// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

// 회원 가입
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError(400, '이미 존재하는 이메일입니다.');
    }

    const user = new User({ email, password, name });
    await user.save();

    res.status(201).json({ status: 'success', message: '회원 가입 성공' });
  } catch (err) {
    next(err);
  }
};

// 로그인
exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      // 사용자 확인
      const user = await User.findOne({ email });
      if (!user) {
        throw new CustomError(400, '존재하지 않는 이메일입니다.');
      }
  
      // 비밀번호 검증
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
        throw new CustomError(400, '비밀번호가 일치하지 않습니다.');
        }
  
      // 토큰 생성
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
  
      // Refresh Token 저장
      user.refreshToken = refreshToken;
      await user.save();
  
      res.json({
        status: 'success',
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  };

// 로그아웃
exports.logout = async (req, res, next) => {
    try {
      req.user.refreshToken = null;
      await req.user.save();
  
      res.json({ status: 'success', message: '로그아웃 되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

// 회원 정보 수정
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    if (name) req.user.name = name;
    if (password) req.user.password = password;

    await req.user.save();

    res.json({ status: 'success', message: '회원 정보가 수정되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// 회원 탈퇴
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ status: 'success', message: '회원 탈퇴가 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
};

// 토큰 갱신
exports.refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
  
      if (!refreshToken) {
        throw new CustomError(400, 'Refresh Token이 없습니다.');
      }
  
      // Refresh Token 검증
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  
      // 사용자 확인
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new CustomError(401, '유효하지 않은 Refresh Token입니다.');
      }
  
      // 새로운 Access Token 발급
      const newAccessToken = generateAccessToken(user._id);
  
      res.json({
        status: 'success',
        accessToken: newAccessToken,
      });
    } catch (err) {
      next(err);
    }
  };
