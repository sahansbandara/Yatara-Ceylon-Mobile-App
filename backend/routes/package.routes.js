const express = require('express');
const controller = require('../controllers/package.controller');
const { protect, adminOrStaff } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', controller.listPackages);
router.get('/:id', controller.getPackage);
router.post('/', protect, adminOrStaff, upload.single('image'), controller.createPackage);
router.put('/:id', protect, adminOrStaff, upload.single('image'), controller.updatePackage);
router.delete('/:id', protect, adminOrStaff, controller.deletePackage);

module.exports = router;
