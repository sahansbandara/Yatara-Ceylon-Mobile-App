const Vehicle = require('../models/Vehicle');
const crudController = require('./crudFactory');
const { z } = require('zod');

const vehicleSchema = z.object({
  type: z.enum(['SEDAN', 'SUV', 'VAN', 'BUS', 'LUXURY']),
  model: z.string().min(2),
  plateNumber: z.string().optional(),
  seats: z.coerce.number().min(1),
  luggage: z.coerce.number().min(0).optional(),
  dailyRate: z.coerce.number().min(0),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE']).default('AVAILABLE'),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
});

const controller = crudController(Vehicle, {
  name: 'Vehicle',
  arrayFields: ['images', 'features'],
  schema: vehicleSchema,
});

async function availability(_req, res, next) {
  try {
    const vehicles = await Vehicle.find({ isDeleted: { $ne: true }, status: 'AVAILABLE' }).sort({ model: 1 });
    res.json({ data: vehicles });
  } catch (error) {
    next(error);
  }
}

module.exports = { ...controller, availability };
