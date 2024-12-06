// middlewares/validationMiddleware.js

const { validationResult } = require('express-validator');
const ValidationError = require('../utils/validationError');

exports.validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // 에러를 커스텀 에러 클래스로 전달
    return next(new ValidationError(errors.array()));
  };
};
