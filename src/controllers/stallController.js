const { poolPromise, sql } = require('../config/db');
const AppError = require('../utils/AppError');

exports.getStalls = async (req, res) => {
  const { search, category, page, limit } = req.validated.query;
  const offset = (page - 1) * limit;
  const pool = await poolPromise;

  let where = ' WHERE 1=1';
  const request = pool.request();

  if (search) {
    where += ' AND (name LIKE @search OR description LIKE @search)';
    request.input('search', sql.NVarChar(102), `%${search}%`);
  }
  if (category) {
    where += ' AND category LIKE @category';
    request.input('category', sql.NVarChar(52), `%${category}%`);
  }

  request.input('offset', sql.Int, offset);
  request.input('limit', sql.Int, limit);
  const result = await request.query(
    `SELECT * FROM STALLS${where} ORDER BY id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`
  );

  res.json({ status: 'success', page, limit, data: result.recordset });
};

exports.getStallById = async (req, res) => {
  const { id } = req.validated.params;
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM STALLS WHERE id = @id');

  if (result.recordset.length === 0) throw new AppError(404, 'Warung tidak ditemukan');
  res.json({ status: 'success', data: result.recordset[0] });
};

exports.createStall = async (req, res) => {
  const { name, category, location, description } = req.validated.body;
  const pool = await poolPromise;
  const result = await pool.request()
    .input('owner_id', sql.Int, req.user.id)
    .input('name', sql.NVarChar(100), name)
    .input('category', sql.NVarChar(50), category ?? null)
    .input('location', sql.NVarChar(100), location ?? null)
    .input('description', sql.NVarChar(sql.MAX), description ?? null)
    .query(`INSERT INTO STALLS (owner_id, name, category, location, description)
            OUTPUT INSERTED.* VALUES (@owner_id, @name, @category, @location, @description)`);

  res.status(201).json({ status: 'success', data: result.recordset[0] });
};

exports.updateStall = async (req, res) => {
  const { id } = req.validated.params;
  const body = req.validated.body;
  const pool = await poolPromise;

  const found = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT id, owner_id FROM STALLS WHERE id = @id');
  const stall = found.recordset[0];
  if (!stall) throw new AppError(404, 'Warung tidak ditemukan');

  if (req.user.role === 'owner' && stall.owner_id !== req.user.id) {
    throw new AppError(403, 'Anda bukan pemilik warung ini');
  }

  const columns = {
    name: sql.NVarChar(100),
    category: sql.NVarChar(50),
    location: sql.NVarChar(100),
    description: sql.NVarChar(sql.MAX),
  };
  const sets = [];
  const request = pool.request().input('id', sql.Int, id);
  for (const [col, type] of Object.entries(columns)) {
    if (body[col] !== undefined) {
      sets.push(`${col} = @${col}`);
      request.input(col, type, body[col]);
    }
  }
  if (sets.length === 0) {
    throw new AppError(400, 'Tidak ada data yang diubah', [
      { field: 'body', message: 'Kirim minimal satu field: name, category, location, atau description' },
    ]);
  }

  const result = await request.query(
    `UPDATE STALLS SET ${sets.join(', ')} OUTPUT INSERTED.* WHERE id = @id`
  );
  res.json({ status: 'success', data: result.recordset[0] });
};

exports.deleteStall = async (req, res) => {
  const { id } = req.validated.params;
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM STALLS WHERE id = @id');

  if (result.rowsAffected[0] === 0) throw new AppError(404, 'Warung tidak ditemukan');
  res.json({ status: 'success', message: 'Warung berhasil dihapus' });
};