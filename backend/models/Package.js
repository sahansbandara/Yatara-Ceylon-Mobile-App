const mongoose = require('mongoose');

const ItineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const PackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, unique: true },
    summary: { type: String, required: true },
    fullDescription: String,
    duration: { type: String, required: true },
    durationDays: { type: Number, min: 1 },
    type: { type: String, enum: ['journey', 'transfer'], default: 'journey', index: true },
    style: { type: String },
    itinerary: [ItineraryDaySchema],
    priceMin: { type: Number, required: true, min: 0 },
    priceMax: { type: Number, required: true, min: 0 },
    images: [String],
    highlights: [String],
    inclusions: [String],
    tags: [String],
    isPublished: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true }
);

PackageSchema.index({ type: 1, style: 1 });

module.exports = mongoose.models.Package || mongoose.model('Package', PackageSchema);
