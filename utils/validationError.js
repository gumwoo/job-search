// utils/validationError.js

const CustomError = require('./customError');

class ValidationError extends CustomError {
  constructor(errors) {
    super(400, '입력 데이터가 유효하지 않습니다.', errors);
  }
}

module.exports = ValidationError;
