const { z } = require('zod');

const text = (field) =>
  z.string({
    error: (issue) =>
      issue.input === undefined ? `${field} wajib diisi` : `${field} harus berupa teks`,
  });

exports.listQuery = z.object({
  search: text('search').trim().max(100, { error: 'search maksimal 100 karakter' }).optional(),
  category: text('category').trim().max(50, { error: 'category maksimal 50 karakter' }).optional(),
  page: z.coerce
    .number({ error: 'page harus berupa angka' })
    .int({ error: 'page harus bilangan bulat' })
    .min(1, { error: 'page minimal 1' })
    .default(1),
  limit: z.coerce
    .number({ error: 'limit harus berupa angka' })
    .int({ error: 'limit harus bilangan bulat' })
    .min(1, { error: 'limit minimal 1' })
    .max(100, { error: 'limit maksimal 100' })
    .default(10),
});

exports.createStallBody = z.object({
  name: text('name')
    .trim()
    .min(3, { error: 'name minimal 3 karakter' })
    .max(100, { error: 'name maksimal 100 karakter' }),
  category: text('category').trim().max(50, { error: 'category maksimal 50 karakter' }).optional(),
  location: text('location').max(100, { error: 'location maksimal 100 karakter' }).optional(),
  description: text('description').max(1000, { error: 'description maksimal 1000 karakter' }).optional(),
});

exports.updateStallBody = exports.createStallBody.partial();

exports.reviewBody = z.object({
  rating: z
    .number({
      error: (issue) =>
        issue.input === undefined ? 'rating wajib diisi' : 'rating harus berupa angka',
    })
    .int({ error: 'rating harus bilangan bulat' })
    .min(1, { error: 'rating minimal 1' })
    .max(5, { error: 'rating maksimal 5' }),
  comment: text('comment').trim().max(1000, { error: 'comment maksimal 1000 karakter' }).optional(),
});