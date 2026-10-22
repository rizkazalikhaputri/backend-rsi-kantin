const AppError = require('../utils/AppError');

exports.notFound = (req, res, next) => {
  next(new AppError(404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`));
};

exports.errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  // JSON di body rusak
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Body request bukan JSON yang valid';
  }

  // Error dari SQL Server
  if (err.number === 2627 || err.number === 2601) {
    statusCode = 409;
    message = 'Data sudah ada (duplikat)';
  } else if (err.number === 547) {
    statusCode = 409;
    message = 'Data tidak bisa diproses karena berhubungan dengan data lain';
  }

  if (statusCode >= 500) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }

  const body = { status: 'fail', message };
  if (err.errors) body.errors = err.errors;
  res.status(statusCode).json(body);
};