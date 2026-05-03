const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Package = require('../models/Package');
const Destination = require('../models/Destination');
const Vehicle = require('../models/Vehicle');
const Partner = require('../models/Partner');

async function upsertUser({ name, email, role }) {
  const passwordHash = await bcrypt.hash('Password123!', 12);
  return User.findOneAndUpdate(
    { email },
    { name, email, role, passwordHash, status: 'ACTIVE', emailVerified: true, isDeleted: false },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seed() {
  await connectDB();

  await Promise.all([
    upsertUser({ name: 'Yatara Admin', email: 'admin@yataraceylon.com', role: 'ADMIN' }),
    upsertUser({ name: 'Yatara Staff', email: 'staff@yataraceylon.com', role: 'STAFF' }),
    upsertUser({ name: 'Demo Traveler', email: 'traveler@yataraceylon.com', role: 'USER' }),
  ]);

  await Package.findOneAndUpdate(
    { slug: 'luxury-sri-lanka-in-10-days' },
    {
      title: 'Luxury Sri Lanka in 10 Days',
      slug: 'luxury-sri-lanka-in-10-days',
      summary: 'A premium island journey through culture, coast, wildlife, and hill country.',
      duration: '10 Days',
      durationDays: 10,
      type: 'journey',
      style: 'luxury',
      priceMin: 250000,
      priceMax: 450000,
      highlights: ['Private chauffeur', 'Boutique stays', 'Wildlife safari'],
      inclusions: ['Hotel pickup', 'Breakfast', 'Guide support'],
      tags: ['luxury', 'culture', 'wildlife'],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Destination.findOneAndUpdate(
    { slug: 'kandy' },
    {
      title: 'Kandy',
      slug: 'kandy',
      description: 'A heritage hill capital centered around the Temple of the Tooth.',
      region: 'Hill Country',
      bestSeason: 'December to April',
      idealNights: '2 nights',
      highlights: ['Temple of the Tooth', 'Royal Botanical Gardens'],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Vehicle.findOneAndUpdate(
    { plateNumber: 'YC-1001' },
    {
      type: 'SUV',
      model: 'Toyota Land Cruiser Prado',
      plateNumber: 'YC-1001',
      seats: 4,
      luggage: 4,
      dailyRate: 45000,
      status: 'AVAILABLE',
      features: ['A/C', 'Leather seats', 'Private chauffeur'],
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Partner.findOneAndUpdate(
    { email: 'reservations@ceylonheritage.example' },
    {
      type: 'HOTEL',
      name: 'Ceylon Heritage Resort',
      contactPerson: 'Reservations Manager',
      phone: '+94770000000',
      email: 'reservations@ceylonheritage.example',
      address: 'Kandy, Sri Lanka',
      status: 'ACTIVE',
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
