const bcrypt = require('bcryptjs');
const { z } = require('zod');
const User = require('../models/User');
const { signToken } = require('../utils/tokens');

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
  password: z.string().min(8),
  role: z.enum(['USER', 'VEHICLE_OWNER', 'HOTEL_OWNER']).default('USER'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
  };
}

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email.toLowerCase(), isDeleted: { $ne: true } });
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      passwordHash,
      role: data.role,
      status: 'ACTIVE',
      emailVerified: true,
    });

    const token = signToken(user);
    res.status(201).json({ success: true, token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email.toLowerCase(), isDeleted: { $ne: true } }).select('+passwordHash');
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    if (user.status !== 'ACTIVE') return res.status(403).json({ error: 'Account is not active' });

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(user);
    res.json({ success: true, token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

async function logout(_req, res) {
  res.json({ success: true });
}

module.exports = { register, login, me, logout };
