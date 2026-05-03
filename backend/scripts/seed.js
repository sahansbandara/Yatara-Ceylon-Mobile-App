const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const Vehicle = require('../models/Vehicle');
const Partner = require('../models/Partner');

const GITHUB_RAW = "https://raw.githubusercontent.com/sahansbandara/Yatara-Ceylon/main/public";

async function upsertUser({ name, email, role, status = 'ACTIVE', phone }) {
  const passwordHash = await bcrypt.hash('Password123!', 12);
  return User.findOneAndUpdate(
    { email },
    { name, email, phone, role, passwordHash, status, emailVerified: true, isDeleted: false },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seed() {
  await connectDB();

  const [, , traveler] = await Promise.all([
    upsertUser({ name: 'Yatara Admin', email: 'admin@yataraceylon.com', role: 'ADMIN' }),
    upsertUser({ name: 'Yatara Staff', email: 'staff@yataraceylon.com', role: 'STAFF' }),
    upsertUser({ name: 'Demo Traveler', email: 'traveler@yataraceylon.com', role: 'USER', phone: '+94771234567' }),
  ]);

  await Promise.all([
    upsertUser({
      name: 'Pending Customer',
      email: 'pending.customer@yataraceylon.com',
      role: 'USER',
      status: 'PENDING_APPROVAL',
      phone: '+94771230001',
    }),
    upsertUser({
      name: 'Pending Vehicle Owner',
      email: 'pending.vehicle@yataraceylon.com',
      role: 'VEHICLE_OWNER',
      status: 'PENDING_APPROVAL',
      phone: '+94771230002',
    }),
    upsertUser({
      name: 'Pending Hotel Owner',
      email: 'pending.hotel@yataraceylon.com',
      role: 'HOTEL_OWNER',
      status: 'PENDING_APPROVAL',
      phone: '+94771230003',
    }),
    upsertUser({
      name: 'Inactive Test User',
      email: 'inactive.user@yataraceylon.com',
      role: 'USER',
      status: 'INACTIVE',
      phone: '+94771230004',
    }),
  ]);

  // PACKAGES
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
      images: [`${GITHUB_RAW}/images/places/matale-sigiriya.webp`],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Package.findOneAndUpdate(
    { slug: 'adventure-and-highlands' },
    {
      title: 'Adventure & Highlands',
      slug: 'adventure-and-highlands',
      summary: 'A refined soft-adventure journey through Sri Lanka’s misty mountains, rivers, and scenic routes.',
      duration: '6 Days',
      durationDays: 6,
      type: 'journey',
      style: 'adventure',
      priceMin: 180000,
      priceMax: 350000,
      highlights: ['White Water Rafting', 'Scenic Train', 'Horton Plains'],
      inclusions: ['Hotel pickup', 'Breakfast', 'Adventure Fees'],
      tags: ['adventure', 'highlands', 'scenic'],
      images: [`${GITHUB_RAW}/images/places/nuwaraeliya-horton.webp`],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );
  
  await Package.findOneAndUpdate(
    { slug: 'heritage-triangle-private-edition' },
    {
      title: 'Heritage Triangle Private Edition',
      slug: 'heritage-triangle-private-edition',
      summary: 'Private-guide access through Sigiriya, Dambulla, Polonnaruwa, and boutique heritage stays.',
      duration: '5 Days',
      durationDays: 5,
      type: 'journey',
      style: 'heritage',
      priceMin: 195000,
      priceMax: 360000,
      highlights: ['Sigiriya sunrise', 'Ancient kingdoms', 'Private cultural host'],
      inclusions: ['Boutique hotel', 'Daily breakfast', 'Private guide'],
      tags: ['heritage', 'culture', 'private'],
      images: [`${GITHUB_RAW}/images/packages/heritage-triangle-private-edition-hero.webp`],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Package.findOneAndUpdate(
    { slug: 'ramayana-trail' },
    {
      title: 'Ramayana Trail',
      slug: 'ramayana-trail',
      summary: 'Follow the epic trail of the Ramayana through Sri Lanka.',
      duration: '7 Days',
      durationDays: 7,
      type: 'journey',
      style: 'heritage',
      priceMin: 150000,
      priceMax: 300000,
      highlights: ['Ashoka Vatika', 'Seetha Amman Temple', 'Rumassala'],
      inclusions: ['Hotel pickup', 'Breakfast', 'Guide'],
      tags: ['heritage', 'culture'],
      images: [`${GITHUB_RAW}/images/places/anuradhapura-ruwanweli.webp`],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  // DESTINATIONS
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
      images: [`${GITHUB_RAW}/images/places/kandy-tooth.webp`],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Destination.findOneAndUpdate(
    { slug: 'galle' },
    {
      title: 'Galle',
      slug: 'galle',
      description: 'UNESCO World Heritage 16th-century Dutch-Portuguese coastal fort.',
      region: 'South Coast',
      bestSeason: 'December to April',
      idealNights: '3 nights',
      highlights: ['Galle Fort', 'Lighthouse', 'Beaches'],
      images: [`${GITHUB_RAW}/images/places/galle-fort.webp`],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Destination.findOneAndUpdate(
    { slug: 'yala' },
    {
      title: 'Yala',
      slug: 'yala',
      description: 'Highest leopard density on earth — early-dawn safari magic.',
      region: 'Deep South',
      bestSeason: 'February to July',
      idealNights: '2 nights',
      highlights: ['Leopard Safari', 'Wildlife', 'Beach'],
      images: [`${GITHUB_RAW}/images/places/hambantota-yala.webp`],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );
  
  await Destination.findOneAndUpdate(
    { slug: 'ella' },
    {
      title: 'Ella',
      slug: 'ella',
      description: 'Misty ridge walks, tea-country viewpoints, waterfalls, and the Nine Arches Bridge.',
      region: 'Hill Country',
      bestSeason: 'January to September',
      idealNights: '2 nights',
      highlights: ['Nine Arches Bridge', 'Little Adam’s Peak', 'Tea estates'],
      images: [`${GITHUB_RAW}/images/places/ella-nine-arches.webp`],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Destination.findOneAndUpdate(
    { slug: 'sigiriya' },
    {
      title: 'Sigiriya',
      slug: 'sigiriya',
      description: 'Ancient rock fortress rising 200m above the jungle canopy.',
      region: 'Cultural Triangle',
      bestSeason: 'December to April',
      idealNights: '2 nights',
      highlights: ['Lion Rock', 'Pidurangala', 'Village Tour'],
      images: [`${GITHUB_RAW}/images/places/matale-sigiriya.webp`],
      isPublished: true,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  // VEHICLES
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
      images: [`${GITHUB_RAW}/images/places/colombo-galle-face.webp`], // Generic image since no car images
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Vehicle.findOneAndUpdate(
    { plateNumber: 'YC-2005' },
    {
      type: 'VAN',
      model: 'Toyota Hiace KDH',
      plateNumber: 'YC-2005',
      seats: 9,
      luggage: 8,
      dailyRate: 25000,
      status: 'AVAILABLE',
      features: ['A/C', 'Spacious', 'Comfortable'],
      images: [`${GITHUB_RAW}/images/places/kurunegala-ethagala.webp`], // Generic image
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Vehicle.findOneAndUpdate(
    { plateNumber: 'YC-3008' },
    {
      type: 'SEDAN',
      model: 'Toyota Premio Executive Sedan',
      plateNumber: 'YC-3008',
      seats: 3,
      luggage: 2,
      dailyRate: 18000,
      status: 'AVAILABLE',
      features: ['A/C', 'Airport transfer', 'Executive comfort'],
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Vehicle.findOneAndUpdate(
    { plateNumber: 'YC-4012' },
    {
      type: 'LUXURY',
      model: 'Range Rover Ultra SUV',
      plateNumber: 'YC-4012',
      seats: 4,
      luggage: 4,
      dailyRate: 65000,
      status: 'MAINTENANCE',
      features: ['Premium cabin', 'Private chauffeur', 'Concierge support'],
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  // PARTNERS
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

  await Partner.findOneAndUpdate(
    { email: 'info@southcoastsurfs.example' },
    {
      type: 'ACTIVITY',
      name: 'South Coast Surfs',
      contactPerson: 'Activity Manager',
      phone: '+94770000001',
      email: 'info@southcoastsurfs.example',
      address: 'Mirissa, Sri Lanka',
      status: 'ACTIVE',
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Partner.findOneAndUpdate(
    { email: 'bookings@ella-tea-bungalows.example' },
    {
      type: 'HOTEL',
      name: 'Ella Tea Bungalows',
      contactPerson: 'Front Office Manager',
      phone: '+94770000002',
      email: 'bookings@ella-tea-bungalows.example',
      address: 'Ella, Sri Lanka',
      status: 'PENDING',
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  const [
    luxuryPackage,
    heritagePackage,
    adventurePackage,
    ramayanaPackage,
    pradoVehicle,
    hiaceVehicle,
    premioVehicle,
    heritageHotel,
    surfSupplier,
    ellaHotel,
  ] = await Promise.all([
    Package.findOne({ slug: 'luxury-sri-lanka-in-10-days' }),
    Package.findOne({ slug: 'heritage-triangle-private-edition' }),
    Package.findOne({ slug: 'adventure-and-highlands' }),
    Package.findOne({ slug: 'ramayana-trail' }),
    Vehicle.findOne({ plateNumber: 'YC-1001' }),
    Vehicle.findOne({ plateNumber: 'YC-2005' }),
    Vehicle.findOne({ plateNumber: 'YC-3008' }),
    Partner.findOne({ email: 'reservations@ceylonheritage.example' }),
    Partner.findOne({ email: 'info@southcoastsurfs.example' }),
    Partner.findOne({ email: 'bookings@ella-tea-bungalows.example' }),
  ]);

  // BOOKINGS
  await Booking.findOneAndUpdate(
    { bookingNo: 'YC-MOB-01001' },
    {
      bookingNo: 'YC-MOB-01001',
      customerId: traveler._id,
      customerName: 'Demo Traveler',
      phone: '+94771234567',
      email: 'traveler@yataraceylon.com',
      type: 'PACKAGE',
      packageId: luxuryPackage?._id,
      vehicleId: pradoVehicle?._id,
      hotelPartnerId: heritageHotel?._id,
      pax: 2,
      pickupLocation: 'Bandaranaike International Airport',
      dates: { from: new Date('2026-06-15'), to: new Date('2026-06-24') },
      status: 'NEW',
      notes: 'Demo booking for admin approval testing.',
      totalCost: 500000,
      paidAmount: 0,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Booking.findOneAndUpdate(
    { bookingNo: 'YC-MOB-01002' },
    {
      bookingNo: 'YC-MOB-01002',
      customerId: traveler._id,
      customerName: 'Demo Traveler',
      phone: '+94771234567',
      email: 'traveler@yataraceylon.com',
      type: 'PACKAGE',
      packageId: heritagePackage?._id,
      vehicleId: hiaceVehicle?._id,
      hotelPartnerId: heritageHotel?._id,
      pax: 4,
      pickupLocation: 'Colombo hotel',
      dates: { from: new Date('2026-07-04'), to: new Date('2026-07-08') },
      status: 'CONFIRMED',
      notes: 'Confirmed sample for completion workflow.',
      totalCost: 780000,
      paidAmount: 150000,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Booking.findOneAndUpdate(
    { bookingNo: 'YC-MOB-01003' },
    {
      bookingNo: 'YC-MOB-01003',
      customerId: traveler._id,
      customerName: 'Demo Traveler',
      phone: '+94771234567',
      email: 'traveler@yataraceylon.com',
      type: 'CUSTOM',
      packageId: adventurePackage?._id,
      vehicleId: premioVehicle?._id,
      supplierPartnerId: surfSupplier?._id,
      pax: 3,
      pickupLocation: 'Kandy railway station',
      dates: { from: new Date('2026-08-10'), to: new Date('2026-08-15') },
      status: 'COMPLETED',
      notes: 'Completed custom tour sample.',
      totalCost: 420000,
      paidAmount: 420000,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Booking.findOneAndUpdate(
    { bookingNo: 'YC-MOB-01004' },
    {
      bookingNo: 'YC-MOB-01004',
      customerId: traveler._id,
      customerName: 'Nimal Perera',
      phone: '+94771230011',
      email: 'nimal.perera@example.com',
      type: 'PACKAGE',
      packageId: ramayanaPackage?._id,
      pax: 2,
      pickupLocation: 'Negombo beach hotel',
      dates: { from: new Date('2026-09-02'), to: new Date('2026-09-08') },
      status: 'PAYMENT_PENDING',
      notes: 'Pending payment sample for viva filter.',
      totalCost: 300000,
      paidAmount: 0,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Booking.findOneAndUpdate(
    { bookingNo: 'YC-MOB-01005' },
    {
      bookingNo: 'YC-MOB-01005',
      customerId: traveler._id,
      customerName: 'Ayesha Fernando',
      phone: '+94771230012',
      email: 'ayesha.fernando@example.com',
      type: 'TRANSFER',
      vehicleId: premioVehicle?._id,
      pax: 2,
      pickupLocation: 'Bandaranaike International Airport to Colombo Fort',
      dates: { from: new Date('2026-06-01'), to: new Date('2026-06-01') },
      status: 'CONFIRMED',
      notes: 'Airport transfer test booking.',
      adminNote: 'Sedan assigned for arrival transfer.',
      totalCost: 18000,
      paidAmount: 5000,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Booking.findOneAndUpdate(
    { bookingNo: 'YC-MOB-01006' },
    {
      bookingNo: 'YC-MOB-01006',
      customerId: traveler._id,
      customerName: 'Ruwan Silva',
      phone: '+94771230013',
      email: 'ruwan.silva@example.com',
      type: 'PACKAGE',
      packageId: adventurePackage?._id,
      vehicleId: hiaceVehicle?._id,
      hotelPartnerId: ellaHotel?._id,
      supplierPartnerId: surfSupplier?._id,
      pax: 6,
      pickupLocation: 'Kandy city hotel',
      dates: { from: new Date('2026-10-12'), to: new Date('2026-10-17') },
      status: 'ASSIGNED',
      notes: 'Assigned workflow sample with vehicle, hotel, and supplier.',
      adminNote: 'Check hotel approval before final confirmation.',
      totalCost: 1080000,
      paidAmount: 250000,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Booking.findOneAndUpdate(
    { bookingNo: 'YC-MOB-01007' },
    {
      bookingNo: 'YC-MOB-01007',
      customerId: traveler._id,
      customerName: 'Kasun Jayasinghe',
      phone: '+94771230014',
      email: 'kasun.jayasinghe@example.com',
      type: 'PACKAGE',
      packageId: heritagePackage?._id,
      pax: 1,
      pickupLocation: 'Colombo hotel',
      dates: { from: new Date('2026-05-22'), to: new Date('2026-05-26') },
      status: 'CANCELLED',
      notes: 'Cancelled booking sample.',
      totalCost: 195000,
      paidAmount: 0,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  await Booking.findOneAndUpdate(
    { bookingNo: 'YC-MOB-01008' },
    {
      bookingNo: 'YC-MOB-01008',
      customerId: traveler._id,
      customerName: 'Maya Wijesinghe',
      phone: '+94771230015',
      email: 'maya.wijesinghe@example.com',
      type: 'PACKAGE',
      packageId: luxuryPackage?._id,
      vehicleId: pradoVehicle?._id,
      hotelPartnerId: heritageHotel?._id,
      pax: 2,
      pickupLocation: 'Galle Face hotel',
      dates: { from: new Date('2026-11-05'), to: new Date('2026-11-14') },
      status: 'IN_PROGRESS',
      notes: 'In-progress operations sample.',
      adminNote: 'Guest currently in hill country segment.',
      totalCost: 500000,
      paidAmount: 300000,
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
