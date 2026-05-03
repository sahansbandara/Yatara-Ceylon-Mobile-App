const mongoose = require('mongoose');
const { BookingStatus, BookingTypes } = require('../utils/constants');

const BookingSchema = new mongoose.Schema(
  {
    bookingNo: { type: String, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    type: { type: String, enum: Object.values(BookingTypes), default: BookingTypes.PACKAGE },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    pax: { type: Number, required: true, min: 1 },
    pickupLocation: String,
    dates: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.NEW, index: true },
    notes: String,
    specialRequests: String,
    totalCost: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    remainingBalance: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true }
);

BookingSchema.pre('save', async function setBookingNo(next) {
  if (!this.bookingNo) {
    const count = await mongoose.models.Booking.countDocuments();
    this.bookingNo = `YC-MOB-${String(count + 1001).padStart(5, '0')}`;
  }
  this.remainingBalance = Math.max(0, Number(this.totalCost || 0) - Number(this.paidAmount || 0));
  next();
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
