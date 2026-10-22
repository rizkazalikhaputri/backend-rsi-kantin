const { z } = require('zod');

const id = z.coerce
  .number({ error: 'id harus berupa angka' })
  .int({ error: 'id harus bilangan bulat' })
  .gt(0, { error: 'id harus lebih dari 0' })
  .max(2147483647, { error: 'id terlalu besar' });

exports.idParams = z.object({ id });