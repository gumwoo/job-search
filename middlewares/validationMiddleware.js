// middlewares/validationMiddleware.js

const { validationResult } = require('express-validator');
const CustomError = require('../utils/customError');

/**
 * 유효성 검사 미들웨어
 * Express Validator의 유효성 검사 결과를 처리합니다.
 * @param {Array} validations - 유효성 검사 체인 배열
 * @returns {Function} - 미들웨어 함수
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // 모든 유효성 검사를 실행
    await Promise.all(validations.map(validation => validation.run(req)));

    // 검증 결과를 가져옴
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // 오류를 추출하여 커스텀 에러 생성
    const extractedErrors = errors.array().map(err => ({
      msg: err.msg,
      param: err.param,
      location: err.location
    }));

    return next(new CustomError(400, '입력 데이터 검증 오류', 'VALIDATION_ERROR', extractedErrors));
  };
};

module.exports = { validate };
