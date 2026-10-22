const AppError = require('../utils/AppError');

module.exports = (schemas) => (req, res, next) => {
  const errors = [];
  req.validated = {};

  for (const key of ['params', 'query', 'body']) {
    if (!schemas[key]) continue;

    const input = key === 'body' ? (req.body ?? {}) : req[key];
    const result = schemas[key].safeParse(input);

    if (result.success) {
      req.validated[key] = result.data;
    } else {
      for (const issue of result.error.issues) {
        errors.push({ field: issue.path.join('.') || key, message: issue.message });
      }
    }
  }

  if (errors.length > 0) {
    return next(new AppError(400, 'Validasi gagal', errors));
  }
  next();
};