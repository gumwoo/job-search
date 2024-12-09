// controllers/AuthController.js

const jwt = require('jsonwebtoken');

/**
 * AuthController 클래스는 인증 관련 모든 비즈니스 로직을 처리합니다.
 */
class AuthController {
  /**
   * AuthController 생성자
   * @param {Model} userModel - User Mongoose 모델
   * @param {CustomError} CustomError - 커스텀 에러 클래스
   * @param {Object} tokenUtils - 토큰 생성 유틸리티 함수 객체
   */
  constructor(userModel, CustomError, tokenUtils) {
    this.User = userModel;
    this.CustomError = CustomError;
    this.generateAccessToken = tokenUtils.generateAccessToken;
    this.generateRefreshToken = tokenUtils.generateRefreshToken;
  }

  /**
   * 회원가입을 처리합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 이미 존재하는 이메일일 경우 발생
   */
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      // 이메일 중복 확인
      const existingUser = await this.User.findOne({ email });
      if (existingUser) {
        throw new this.CustomError(400, '이미 존재하는 이메일입니다.');
      }
       // 새로운 사용자 생성
      const user = new this.User({ email, password, name });
      await user.save();

      res.status(201).json({ status: 'success', message: '회원 가입 성공' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 로그인을 처리합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - 이메일 또는 비밀번호가 올바르지 않을 경우 발생
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // 사용자 확인
      const user = await this.User.findOne({ email });
      if (!user) {
        throw new this.CustomError(400, '존재하지 않는 이메일입니다.');
      }

      // 비밀번호 검증
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new this.CustomError(400, '비밀번호가 일치하지 않습니다.');
      }

      // 토큰 생성
      const accessToken = this.generateAccessToken(user._id);
      const refreshToken = this.generateRefreshToken(user._id);

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
  }

  /**
   * 로그아웃을 처리합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   */
  async logout(req, res, next) {
    try {
      // 사용자에게 저장된 Refresh Token 제거
      req.user.refreshToken = null;
      await req.user.save();

      res.json({ status: 'success', message: '로그아웃 되었습니다.' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 회원 정보를 조회합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   */
  async getProfile(req, res, next) {
    try {
      const user = req.user; // authMiddleware에서 설정
      res.json({ status: "success", data: user });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 회원 정보를 수정합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   */
  async updateProfile(req, res, next) {
    try {
      const { name, password } = req.body;
      // 이름과 비밀번호 업데이트 (선택 사항)
      if (name) req.user.name = name;
      if (password) req.user.password = password;

      await req.user.save();

      res.json({ status: 'success', message: '회원 정보가 수정되었습니다.' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * 회원 탈퇴를 처리합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   */
  async deleteAccount(req, res, next) {
    try {
      // 사용자 계정 삭제 (Cascade Delete는 User 모델에서 처리)
      await this.User.findByIdAndDelete(req.user._id);
      res.json({ status: 'success', message: '회원 탈퇴가 완료되었습니다.' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Refresh Token을 사용하여 새로운 Access Token을 발급합니다.
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express next 미들웨어 함수
   * @returns {Promise<void>}
   * @throws {CustomError} - Refresh Token이 없거나 유효하지 않을 경우 발생
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new this.CustomError(400, 'Refresh Token이 없습니다.');
      }

      // Refresh Token 검증
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

      // 사용자 확인
      const user = await this.User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new this.CustomError(401, '유효하지 않은 Refresh Token입니다.');
      }

      // 새로운 Access Token 발급
      const newAccessToken = this.generateAccessToken(user._id);

      res.json({
        status: 'success',
        accessToken: newAccessToken,
      });
    } catch (err) {
      // JWT 오류 처리
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        return next(new this.CustomError(401, '유효하지 않은 Refresh Token입니다.'));
      }
      next(err);
    }
  }
}

module.exports = AuthController;
