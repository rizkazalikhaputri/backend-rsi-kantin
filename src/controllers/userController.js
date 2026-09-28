const { poolPromise, sql } = require('../config/db');

exports.getUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT id, name, email, role, created_at FROM USERS');
    res.json({ status: 'success', data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password_hash, role } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVarChar(100), name)
      .input('email', sql.NVarChar(150), email)
      .input('password_hash', sql.NVarChar(255), password_hash)
      .input('role', sql.NVarChar(20), role)
      .query(`INSERT INTO USERS (name, email, password_hash, role) 
              OUTPUT INSERTED.* VALUES (@name, @email, @password_hash, @role)`);
    res.status(201).json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};