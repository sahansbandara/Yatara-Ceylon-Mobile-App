const mongoose = require('mongoose');
const { PartnerStatus, PartnerTypes } = require('../utils/constants');

const PartnerSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: Object.values(PartnerTypes), required: true },
    name: { type: String, required: true, trim: true },
    contactPerson: String,
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: String,
    status: { type: String, enum: Object.values(PartnerStatus), default: PartnerStatus.ACTIVE, index: true },
    images: [String],
    notes: String,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
