const { z } = require('zod');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Partner = require('../models/Partner');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

const bookingSchema = z.object({
  packageId: z.string().optional(),
  vehicleId: z.string().optional(),
  customerName: z.string().min(2).optional(),
  phone: z.string().min(7).optional(),
  email: z.string().email().optional(),
  type: z.enum(['PACKAGE', 'TRANSFER', 'CUSTOM']).default('PACKAGE'),
  pax: z.coerce.number().min(1).default(1),
  pickupLocation: z.string().optional(),
  dateFrom: z.coerce.date(),
  dateTo: z.coerce.date().optional(),
  notes: z.string().optional(),
  specialRequests: z.string().optional(),
  totalCost: z.coerce.number().min(0).optional(),
});

const statusSchema = z.object({
  status: z.enum(['NEW', 'PAYMENT_PENDING', 'ADVANCE_PAID', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  vehicleId: z.string().optional().or(z.literal('')),
  hotelPartnerId: z.string().optional().or(z.literal('')),
  supplierPartnerId: z.string().optional().or(z.literal('')),
  adminNote: z.string().optional(),
});

function minimumTravelDate() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 2);
  return date;
}

async function createBooking(req, res, next) {
  try {
    const data = bookingSchema.parse(req.body);
    if (!/^\+94\d{9}$/.test(data.phone || '')) {
      return res.status(400).json({ error: 'Phone number must be +94 followed by 9 digits' });
    }
    const selectedDate = new Date(data.dateFrom);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < minimumTravelDate()) {
      return res.status(400).json({ error: 'Travel date must be at least 2 days from today' });
    }
    let totalCost = data.totalCost || 0;
    let dateTo = data.dateTo;

    if (data.packageId) {
      const pkg = await Package.findById(data.packageId);
      if (pkg) {
        totalCost = totalCost || Number(pkg.priceMin || 0) * data.pax;
        const durationDays = Number(pkg.durationDays || 1);
        if (!dateTo) {
          dateTo = new Date(data.dateFrom);
          dateTo.setDate(dateTo.getDate() + Math.max(1, durationDays) - 1);
        }
      }
    }

    if (!dateTo) dateTo = data.dateFrom;

    const item = await Booking.create({
      customerId: req.user._id,
      customerName: data.customerName || req.user.name,
      phone: data.phone || req.user.phone || 'Not provided',
      email: data.email || req.user.email,
      type: data.type,
      packageId: data.packageId,
      vehicleId: data.vehicleId,
      pax: data.pax,
      pickupLocation: data.pickupLocation,
      dates: { from: data.dateFrom, to: dateTo },
      notes: data.notes,
      specialRequests: data.specialRequests,
      totalCost,
    });

    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
}

async function myBookings(req, res, next) {
  try {
    const bookings = await Booking.find({
      isDeleted: { $ne: true },
      $or: [{ customerId: req.user._id }, { email: req.user.email }],
    })
      .populate('packageId', 'title duration images priceMin')
      .populate('vehicleId', 'model type plateNumber seats')
      .populate('hotelPartnerId', 'name type phone')
      .populate('supplierPartnerId', 'name type phone')
      .sort({ createdAt: -1 });
    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
}

async function listBookings(_req, res, next) {
  try {
    const bookings = await Booking.find({ isDeleted: { $ne: true } })
      .populate('packageId', 'title duration images priceMin')
      .populate('customerId', 'name email')
      .populate('vehicleId', 'model type plateNumber seats')
      .populate('hotelPartnerId', 'name type phone')
      .populate('supplierPartnerId', 'name type phone')
      .sort({ createdAt: -1 });
    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
}

async function updateBookingStatus(req, res, next) {
  try {
    const { status, vehicleId, hotelPartnerId, supplierPartnerId, adminNote } = statusSchema.parse(req.body);
    const item = await Booking.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!item) return res.status(404).json({ error: 'Booking not found' });

    if (item.type === 'TRANSFER' && (hotelPartnerId || supplierPartnerId)) {
      return res.status(400).json({ error: 'Transfer requests can only be assigned a vehicle' });
    }

    const hasAssignmentChange =
      vehicleId !== undefined || hotelPartnerId !== undefined || supplierPartnerId !== undefined;
    const assignmentsLocked = !['NEW', 'PAYMENT_PENDING'].includes(item.status);
    if (hasAssignmentChange && assignmentsLocked) {
      return res.status(400).json({ error: 'Assignments are locked after booking confirmation' });
    }

    item.status = status;
    if (vehicleId !== undefined) item.vehicleId = vehicleId || null;
    if (item.type === 'TRANSFER') {
      item.hotelPartnerId = null;
      item.supplierPartnerId = null;
    } else {
      if (hotelPartnerId !== undefined) item.hotelPartnerId = hotelPartnerId || null;
      if (supplierPartnerId !== undefined) item.supplierPartnerId = supplierPartnerId || null;
    }
    if (adminNote !== undefined) item.adminNote = adminNote;
    await item.save();
    res.json({ data: item });
  } catch (error) {
    next(error);
  }
}

async function createDemoBooking(req, res, next) {
  try {
    const [traveler, pkg, vehicle, hotel, supplier] = await Promise.all([
      User.findOne({ email: 'traveler@yataraceylon.com', isDeleted: { $ne: true } }),
      Package.findOne({ isDeleted: { $ne: true }, isPublished: true }).sort({ createdAt: -1 }),
      Vehicle.findOne({ isDeleted: { $ne: true }, status: 'AVAILABLE' }).sort({ createdAt: -1 }),
      Partner.findOne({ isDeleted: { $ne: true }, type: 'HOTEL' }).sort({ createdAt: -1 }),
      Partner.findOne({ isDeleted: { $ne: true }, type: { $in: ['SUPPLIER', 'ACTIVITY', 'RESTAURANT'] } }).sort({ createdAt: -1 }),
    ]);

    if (!traveler) return res.status(404).json({ error: 'Demo Traveler seed user not found' });
    if (!pkg) return res.status(404).json({ error: 'No package found for demo booking' });

    const from = new Date();
    from.setDate(from.getDate() + 21);
    const to = new Date(from);
    to.setDate(to.getDate() + Math.max(1, Number(pkg.durationDays || 3)) - 1);

    const item = await Booking.create({
      customerId: traveler._id,
      customerName: traveler.name,
      phone: traveler.phone || '+94771234567',
      email: traveler.email,
      type: 'PACKAGE',
      packageId: pkg._id,
      vehicleId: vehicle?._id,
      hotelPartnerId: hotel?._id,
      supplierPartnerId: supplier?._id,
      pax: 2,
      pickupLocation: 'Demo pickup - Colombo hotel',
      dates: { from, to },
      status: 'NEW',
      notes: 'Admin-created demo booking for manage booking viva testing.',
      totalCost: Number(pkg.priceMin || 0) * 2,
      paidAmount: 0,
    });

    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
}

async function deleteBooking(req, res, next) {
  try {
    const query = { _id: req.params.id, isDeleted: { $ne: true } };
    if (!['ADMIN', 'STAFF'].includes(req.user.role)) {
      query.$or = [{ customerId: req.user._id }, { email: req.user.email }];
    }
    const item = await Booking.findOneAndUpdate(query, { isDeleted: true, deletedAt: new Date(), status: 'CANCELLED' }, { new: true });
    if (!item) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { createBooking, createDemoBooking, myBookings, listBookings, updateBookingStatus, deleteBooking };
