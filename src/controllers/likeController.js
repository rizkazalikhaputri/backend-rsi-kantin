const { poolPromise, sql } = require('../config/db');

exports.createLike = async (req, res) => {
  try {
    const { review_id, user_id } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('review_id', sql.Int, review_id)
      .input('user_id', sql.Int, user_id)
      .query(`INSERT INTO LIKES (review_id, user_id) OUTPUT INSERTED.* VALUES (@review_id, @user_id)`);
    res.status(201).json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.deleteLike = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request().input('id', sql.Int, req.params.id).query('DELETE FROM LIKES WHERE id = @id');
    res.json({ status: 'success', message: 'Like removed' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};