const { z } = require('zod');
const Booking = require('../models/Booking');
const Package = require('../models/Package');

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
});

async function createBooking(req, res, next) {
  try {
    const data = bookingSchema.parse(req.body);
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
      .sort({ createdAt: -1 });
    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
}

async function updateBookingStatus(req, res, next) {
  try {
    const { status } = statusSchema.parse(req.body);
    const item = await Booking.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { status },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Booking not found' });
    res.json({ data: item });
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

module.exports = { createBooking, myBookings, listBookings, updateBookingStatus, deleteBooking };
