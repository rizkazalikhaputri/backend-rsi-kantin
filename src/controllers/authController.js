const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../config/db');
const AppError = require('../utils/AppError');

exports.register = async (req, res) => {
  const { name, email, password } = req.validated.body;
  const pool = await poolPromise;

  const existing = await pool.request()
    .input('email', sql.NVarChar(150), email)
    .query('SELECT id FROM USERS WHERE email = @email');
  if (existing.recordset.length > 0) {
    throw new AppError(409, 'Email sudah terdaftar');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.request()
    .input('name', sql.NVarChar(100), name)
    .input('email', sql.NVarChar(150), email)
    .input('password_hash', sql.NVarChar(255), passwordHash)
    .input('role', sql.NVarChar(20), 'customer')
    .query(`INSERT INTO USERS (name, email, password_hash, role)
            OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.created_at
            VALUES (@name, @email, @password_hash, @role)`);

  res.status(201).json({ status: 'success', data: result.recordset[0] });
};

exports.login = async (req, res) => {
  const { email, password } = req.validated.body;
  const pool = await poolPromise;

  const result = await pool.request()
    .input('email', sql.NVarChar(150), email)
    .query('SELECT id, name, email, password_hash, role FROM USERS WHERE email = @email');
  const user = result.recordset[0];

  const ok = user && (await bcrypt.compare(password, user.password_hash));
  if (!ok) {
    throw new AppError(401, 'Email atau password salah');
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({
    status: 'success',
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
  });
};

exports.me = async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, req.user.id)
    .query('SELECT id, name, email, role, created_at FROM USERS WHERE id = @id');

  if (result.recordset.length === 0) {
    throw new AppError(401, 'User dari token ini sudah tidak ada');
  }
  res.json({ status: 'success', data: result.recordset[0] });
};