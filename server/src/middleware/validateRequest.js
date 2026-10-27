const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: errorMessages[0]?.message || 'Validation failed. Please check your input.',
      errors: errorMessages,
    });
  }
  next();
};

module.exports = validateRequest;
