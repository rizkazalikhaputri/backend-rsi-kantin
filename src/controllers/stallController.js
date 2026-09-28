const { poolPromise, sql } = require('../config/db');

exports.getStalls = async (req, res) => {
  try {
    const { category, page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    const pool = await poolPromise;
    let query = 'SELECT * FROM STALLS WHERE 1=1';
    const request = pool.request();

    if (category) {
      query += ' AND category LIKE @category';
      request.input('category', sql.NVarChar, `%${category}%`);
    }

    query += ' ORDER BY id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
    request.input('offset', sql.Int, parseInt(offset));
    request.input('limit', sql.Int, parseInt(limit));

    const result = await request.query(query);
    res.json({ status: 'success', page: parseInt(page), limit: parseInt(limit), data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getStallById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM STALLS WHERE id = @id');
    if (result.recordset.length === 0) return res.status(404).json({ status: 'error', message: 'Stall not found' });
    res.json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createStall = async (req, res) => {
  try {
    const { owner_id, name, category, location, description } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('owner_id', sql.Int, owner_id)
      .input('name', sql.NVarChar(100), name)
      .input('category', sql.NVarChar(50), category)
      .input('location', sql.NVarChar(100), location)
      .input('description', sql.NVarChar(sql.MAX), description)
      .query(`INSERT INTO STALLS (owner_id, name, category, location, description) 
              OUTPUT INSERTED.* VALUES (@owner_id, @name, @category, @location, @description)`);
    res.status(201).json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.updateStall = async (req, res) => {
  try {
    const { name, category, location, description } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('name', sql.NVarChar(100), name)
      .input('category', sql.NVarChar(50), category)
      .input('location', sql.NVarChar(100), location)
      .input('description', sql.NVarChar(sql.MAX), description)
      .query(`UPDATE STALLS SET name = @name, category = @category, location = @location, description = @description 
              OUTPUT INSERTED.* WHERE id = @id`);
    res.json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.deleteStall = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request().input('id', sql.Int, req.params.id).query('DELETE FROM STALLS WHERE id = @id');
    res.json({ status: 'success', message: 'Stall deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};