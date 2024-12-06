// utils/authError.js

const CustomError = require('./customError');

class AuthError extends CustomError {
  constructor(message = '인증 오류가 발생했습니다.') {
    super(401, message);
  }
}

module.exports = AuthError;
