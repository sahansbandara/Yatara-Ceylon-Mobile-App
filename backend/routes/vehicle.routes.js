const express = require('express');
const controller = require('../controllers/vehicle.controller');
const { protect, adminOrStaff } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', protect, controller.list);
router.get('/availability', protect, controller.availability);
router.get('/:id', protect, controller.detail);
router.post('/', protect, adminOrStaff, upload.single('image'), controller.create);
router.put('/:id', protect, adminOrStaff, upload.single('image'), controller.update);
router.delete('/:id', protect, adminOrStaff, controller.remove);

module.exports = router;
