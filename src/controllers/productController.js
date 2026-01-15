const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public (for clienttesting.vervel.app)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching product' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin (for admintesting.vercel.app)
const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, imageURL, stock } = req.body;

        const product = new Product({
            name,
            price,
            description,
            category,
            imageURL,
            stock: stock || 0
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ message: 'Server error creating product' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = req.body.name || product.name;
            product.price = req.body.price || product.price;
            product.description = req.body.description || product.description;
            product.category = req.body.category || product.category;
            product.imageURL = req.body.imageURL || product.imageURL;
            product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

