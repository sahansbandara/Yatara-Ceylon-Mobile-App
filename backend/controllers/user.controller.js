const { z } = require('zod');
const User = require('../models/User');

const statusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING_APPROVAL']),
});

function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

async function listUsers(_req, res, next) {
  try {
    const users = await User.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    res.json({ data: users.map(publicUser) });
  } catch (error) {
    next(error);
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const { status } = statusSchema.parse(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { status },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({ error: 'You cannot delete your own admin account' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date(), status: 'INACTIVE' },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { listUsers, updateUserStatus, deleteUser };
