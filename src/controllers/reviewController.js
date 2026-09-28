const { poolPromise, sql } = require('../config/db');

exports.getReviews = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT r.*, u.name AS user_name, u.email AS user_email 
      FROM REVIEWS r 
      JOIN USERS u ON r.user_id = u.id
    `);
    res.json({ status: 'success', data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { stall_id, user_id, rating, comment } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('stall_id', sql.Int, stall_id)
      .input('user_id', sql.Int, user_id)
      .input('rating', sql.Int, rating)
      .input('comment', sql.NVarChar(sql.MAX), comment)
      .query(`INSERT INTO REVIEWS (stall_id, user_id, rating, comment) 
              OUTPUT INSERTED.* VALUES (@stall_id, @user_id, @rating, @comment)`);
    res.status(201).json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request().input('id', sql.Int, req.params.id).query('DELETE FROM REVIEWS WHERE id = @id');
    res.json({ status: 'success', message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};