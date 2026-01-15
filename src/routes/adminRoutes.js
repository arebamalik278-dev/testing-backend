const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin } = require('../controllers/adminController');

// @route   POST /api/admins/login
router.post('/login', loginAdmin);

// @route   POST /api/admins/register
router.post('/register', registerAdmin);

module.exports = router;

