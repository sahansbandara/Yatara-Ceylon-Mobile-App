const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const packageRoutes = require('./routes/package.routes');
const bookingRoutes = require('./routes/booking.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const destinationRoutes = require('./routes/destination.routes');
const partnerRoutes = require('./routes/partner.routes');

const app = express();
const port = process.env.PORT || 5000;

connectDB().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

app.use(cors({
  origin: process.env.CORS_ORIGIN === '*' || !process.env.CORS_ORIGIN
    ? true
    : process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'yatara-mobile-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/partners', partnerRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
  }
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File is too large. Maximum upload size is 5MB.' });
  }
  return res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Yatara mobile API listening on http://localhost:${port}`);
});
