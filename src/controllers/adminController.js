const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT Token for Admin
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new admin
// @route   POST /api/admins/register
// @access  Public (change to private for production)
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists with this email' });
        }

        // Create admin
        const admin = await Admin.create({
            name,
            email,
            password
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token: generateToken(admin._id)
            });
        }
    } catch (error) {
        console.error('Admin Register Error:', error);
        res.status(500).json({ message: 'Server error during admin registration' });
    }
};

module.exports = {
    registerAdmin
};

