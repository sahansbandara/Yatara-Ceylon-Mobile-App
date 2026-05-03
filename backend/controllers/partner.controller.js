const Partner = require('../models/Partner');
const crudController = require('./crudFactory');
const { z } = require('zod');

const partnerSchema = z.object({
  type: z.enum(['HOTEL', 'RESTAURANT', 'ACTIVITY', 'SUPPLIER']),
  name: z.string().min(2),
  contactPerson: z.string().optional(),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('ACTIVE'),
  images: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

module.exports = crudController(Partner, {
  name: 'Partner',
  arrayFields: ['images'],
  schema: partnerSchema,
});
