const mongoose = require('mongoose');
const { UserRoles, UserStatus } = require('../utils/constants');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: { type: String, trim: true },
    avatar: String,
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRoles), default: UserRoles.USER, index: true },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE, index: true },
    emailVerified: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
