const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, unique: true },
    description: { type: String, required: true },
    location: String,
    region: { type: String, index: true },
    bestSeason: String,
    idealNights: String,
    images: [String],
    highlights: [String],
    isPublished: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
