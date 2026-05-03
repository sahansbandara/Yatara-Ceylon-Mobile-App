const express = require('express');
const controller = require('../controllers/booking.controller');
const { protect, adminOrStaff } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, controller.createBooking);
router.get('/my', protect, controller.myBookings);
router.get('/', protect, adminOrStaff, controller.listBookings);
router.put('/:id/status', protect, adminOrStaff, controller.updateBookingStatus);
router.delete('/:id', protect, controller.deleteBooking);

module.exports = router;
