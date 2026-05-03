const mongoose = require('mongoose');
const { VehicleStatus, VehicleTypes } = require('../utils/constants');

const VehicleSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true, enum: Object.values(VehicleTypes) },
    model: { type: String, required: true, trim: true },
    plateNumber: { type: String, trim: true },
    seats: { type: Number, required: true, min: 1 },
    luggage: { type: Number, min: 0 },
    dailyRate: { type: Number, required: true, min: 0 },
    status: { type: String, enum: Object.values(VehicleStatus), default: VehicleStatus.AVAILABLE, index: true },
    images: [String],
    features: [String],
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);
