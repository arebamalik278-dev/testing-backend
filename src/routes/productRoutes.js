const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @route   GET /api/products
// @access  Public (for clienttesting.vervel.app)
router.get('/', getProducts);

// @route   GET /api/products/:id
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @access  Private/Admin (for admintesting.vercel.app)
router.post('/', protect, adminMiddleware, createProduct);

// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, adminMiddleware, updateProduct);

// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, adminMiddleware, deleteProduct);

module.exports = router;

