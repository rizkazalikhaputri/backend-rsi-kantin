const { poolPromise, sql } = require('../config/db');

exports.getMenuItems = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT m.*, s.name AS stall_name 
      FROM MENU_ITEMS m 
      JOIN STALLS s ON m.stall_id = s.id
    `);
    res.json({ status: 'success', data: result.recordset });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT m.*, s.name AS stall_name FROM MENU_ITEMS m JOIN STALLS s ON m.stall_id = s.id WHERE m.id = @id');
    res.json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { stall_id, name, price, is_available } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('stall_id', sql.Int, stall_id)
      .input('name', sql.NVarChar(100), name)
      .input('price', sql.Int, price)
      .input('is_available', sql.Bit, is_available)
      .query(`INSERT INTO MENU_ITEMS (stall_id, name, price, is_available) 
              OUTPUT INSERTED.* VALUES (@stall_id, @name, @price, @is_available)`);
    res.status(201).json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { name, price, is_available } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('name', sql.NVarChar(100), name)
      .input('price', sql.Int, price)
      .input('is_available', sql.Bit, is_available)
      .query(`UPDATE MENU_ITEMS SET name = @name, price = @price, is_available = @is_available 
              OUTPUT INSERTED.* WHERE id = @id`);
    res.json({ status: 'success', data: result.recordset[0] });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request().input('id', sql.Int, req.params.id).query('DELETE FROM MENU_ITEMS WHERE id = @id');
    res.json({ status: 'success', message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};