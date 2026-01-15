const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminMiddleware = async (req, res, next) => {
    let token;

    // Check for Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (format: "Bearer TOKEN")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if it's an Admin (search in Admin collection)
            const admin = await Admin.findById(decoded.id).select('-password');

            if (!admin) {
                return res.status(403).json({ 
                    message: 'Access denied. Not an admin account.' 
                });
            }

            // Attach admin to request
            req.admin = admin;
            next();
        } catch (error) {
            console.error('Admin Auth Error:', error.message);
            return res.status(401).json({ 
                message: 'Not authorized, invalid or expired token' 
            });
        }
    }

    if (!token) {
        return res.status(401).json({ 
            message: 'Not authorized, no token provided' 
        });
    }
};

module.exports = adminMiddleware;

