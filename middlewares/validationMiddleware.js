// middlewares/validationMiddleware.js

const { validationResult } = require('express-validator');

exports.validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  };
};
