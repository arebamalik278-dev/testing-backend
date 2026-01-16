const express = require('express');
const router = express.Router();
const { registerAdmin } = require('../controllers/adminController');

// @route   POST /api/admins/register
router.post('/register', registerAdmin);

module.exports = router;

