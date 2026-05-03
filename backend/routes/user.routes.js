const express = require('express');
const { listUsers, updateUserStatus, deleteUser } = require('../controllers/user.controller');
const { protect, adminOrStaff } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminOrStaff, listUsers);
router.put('/:id/status', protect, adminOrStaff, updateUserStatus);
router.delete('/:id', protect, adminOrStaff, deleteUser);

module.exports = router;
