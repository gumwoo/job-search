// utils/customError.js

class CustomError extends Error {
  /**
   * @param {number} statusCode - HTTP 상태 코드
   * @param {string} message - 에러 메시지
   * @param {string} [errorCode] - 커스텀 에러 코드 (선택 사항)
   * @param {Array} [errors] - 추가 에러 정보 (선택 사항)
   */
  constructor(statusCode, message, errorCode = null, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = true; // 운영적 에러임을 표시

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
