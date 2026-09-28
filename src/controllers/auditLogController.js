const { poolPromise, sql } = require('../config/db');

exports.getAuditLogs = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM AUDIT_LOGS');
    res.json({ status: 'success', data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createAuditLog = async (req, res) => {
  try {
    const { user_id, action, target_table, target_id, metadata } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('action', sql.NVarChar(50), action)
      .input('target_table', sql.NVarChar(50), target_table)
      .input('target_id', sql.Int, target_id)
      .input('metadata', sql.NVarChar(sql.MAX), metadata)
      .query(`INSERT INTO AUDIT_LOGS (user_id, action, target_table, target_id, metadata) 
              OUTPUT INSERTED.* VALUES (@user_id, @action, @target_table, @target_id, @metadata)`);
    res.status(201).json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};