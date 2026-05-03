const Destination = require('../models/Destination');
const crudController = require('./crudFactory');
const { z } = require('zod');

const destinationSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(3),
  location: z.string().optional(),
  region: z.string().optional(),
  bestSeason: z.string().optional(),
  idealNights: z.string().optional(),
  images: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  isPublished: z.coerce.boolean().default(true),
});

module.exports = crudController(Destination, {
  name: 'Destination',
  slugFrom: 'title',
  arrayFields: ['images', 'highlights'],
  schema: destinationSchema,
});
