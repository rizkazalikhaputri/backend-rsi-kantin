const { poolPromise, sql } = require('../config/db');
const AppError = require('../utils/AppError');

exports.getReviews = async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT r.*, u.name AS user_name, u.email AS user_email
    FROM REVIEWS r
    JOIN USERS u ON r.user_id = u.id
  `);
  res.json({ status: 'success', data: result.recordset });
};

exports.createStallReview = async (req, res) => {
  const { id: stallId } = req.validated.params;
  const { rating, comment } = req.validated.body;
  const pool = await poolPromise;

  const stall = await pool.request()
    .input('id', sql.Int, stallId)
    .query('SELECT id FROM STALLS WHERE id = @id');
  if (stall.recordset.length === 0) throw new AppError(404, 'Warung tidak ditemukan');
    const dup = await pool.request()
    .input('stall_id', sql.Int, stallId)
    .input('user_id', sql.Int, req.user.id)
    .query('SELECT id FROM REVIEWS WHERE stall_id = @stall_id AND user_id = @user_id');
  if (dup.recordset.length > 0) {
    throw new AppError(409, 'Anda sudah memberi review untuk warung ini');
  }

  const result = await pool.request()
    .input('stall_id', sql.Int, stallId)
    .input('user_id', sql.Int, req.user.id)
    .input('rating', sql.Int, rating)
    .input('comment', sql.NVarChar(sql.MAX), comment ?? null)
    .query(`INSERT INTO REVIEWS (stall_id, user_id, rating, comment)
            OUTPUT INSERTED.* VALUES (@stall_id, @user_id, @rating, @comment)`);

  res.status(201).json({ status: 'success', data: result.recordset[0] });
};

exports.deleteReview = async (req, res) => {
  const { id } = req.validated.params;
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM REVIEWS WHERE id = @id');

  if (result.rowsAffected[0] === 0) throw new AppError(404, 'Review tidak ditemukan');
  res.json({ status: 'success', message: 'Review berhasil dihapus' });
};