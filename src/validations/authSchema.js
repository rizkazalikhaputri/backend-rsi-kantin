const { z } = require('zod');

const text = (field) =>
  z.string({
    error: (issue) =>
      issue.input === undefined ? `${field} wajib diisi` : `${field} harus berupa teks`,
  });

exports.registerBody = z.object({
  name: text('name')
    .trim()
    .min(3, { error: 'name minimal 3 karakter' })
    .max(100, { error: 'name maksimal 100 karakter' }),
  email: text('email')
    .trim()
    .toLowerCase()
    .max(150, { error: 'email maksimal 150 karakter' })
    .pipe(z.string().email({ error: 'format email tidak valid' })),
  password: text('password')
    .min(8, { error: 'password minimal 8 karakter' })
    .max(72, { error: 'password maksimal 72 karakter' }),
});

exports.loginBody = z.object({
  email: text('email')
    .trim()
    .toLowerCase()
    .pipe(z.string().email({ error: 'format email tidak valid' })),
  password: text('password').min(1, { error: 'password wajib diisi' }),
});