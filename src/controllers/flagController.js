const { poolPromise, sql } = require('../config/db');

exports.getFlags = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM FLAGS');
    res.json({ status: 'success', data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.updateFlagStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('status', sql.NVarChar(20), status)
      .query('UPDATE FLAGS SET status = @status OUTPUT INSERTED.* WHERE id = @id');
    res.json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};