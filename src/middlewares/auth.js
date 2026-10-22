const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

exports.authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(new AppError(401, 'Token tidak ditemukan. Gunakan header Authorization: Bearer <token>'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch (err) {
    next(new AppError(401, 'Token tidak valid atau sudah kedaluwarsa'));
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError(403, 'Anda tidak memiliki akses ke endpoint ini'));
  }
  next();
};