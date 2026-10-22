const bcrypt = require('bcryptjs');
const { poolPromise, sql } = require('./config/db');

const users = [
  { email: 'admin@kantin.ac.id', password: 'Admin12345' },
  { email: 'budi.santoso@kantin.ac.id', password: 'Owner12345' },
  { email: 'siti.aminah@kantin.ac.id', password: 'Owner12345' },
  { email: 'rizky.pratama@student.ac.id', password: 'Customer12345' },
];

(async () => {
  const pool = await poolPromise;
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    const result = await pool.request()
      .input('email', sql.NVarChar(150), u.email)
      .input('password_hash', sql.NVarChar(255), hash)
      .query('UPDATE USERS SET password_hash = @password_hash WHERE email = @email');

    if (result.rowsAffected[0] > 0) {
      console.log(`OK    : ${u.email}`);
    } else {
      console.log(`TIDAK ADA: ${u.email} (cek penulisan email di tabel USERS)`);
    }
  }
  await pool.close();
})().catch((err) => {
  console.error('Seed gagal:', err);
  process.exit(1);
});