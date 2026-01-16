const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const connectDB = require('./src/config/db.js');

// Import Routes
const userRoutes = require('./src/routes/userRoutes.js');
const adminRoutes = require('./src/routes/adminRoutes.js');
const productRoutes = require('./src/routes/productRoutes.js');

// Import Models
const User = require('./src/models/User');
const Admin = require('./src/models/Admin');
const Product = require('./src/models/Product');

const app = new express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: ['https://clienttesting.vercel.app', 'https://admintesting.vercel.app']
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/products', productRoutes);

// Seeder Endpoint (for development only)
app.post('/api/seed', async (req, res) => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Admin.deleteMany({});
        await Product.deleteMany({});

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        await User.create([
            { name: 'John Doe', email: 'john@example.com', password: hashedPassword, isAdmin: false },
            { name: 'Jane Smith', email: 'jane@example.com', password: hashedPassword, isAdmin: false }
        ]);

        // Create Admin
        const adminHashedPassword = await bcrypt.hash('admin123', salt);
        await Admin.create([
            { name: 'Admin User', email: 'admin@example.com', password: adminHashedPassword }
        ]);

        // Create Products
        await Product.create([
            { name: 'iPhone 15 Pro', price: 999, description: 'The latest iPhone', category: 'Electronics', imageURL: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', stock: 50 },
            { name: 'MacBook Pro 14"', price: 1999, description: 'Powerful laptop', category: 'Electronics', imageURL: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', stock: 25 },
            { name: 'Nike Air Jordan 1', price: 180, description: 'Classic basketball shoes', category: 'Clothing', imageURL: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500', stock: 100 }
        ]);

        res.json({ 
            message: 'Database seeded successfully!',
            credentials: {
                admin: { email: 'admin@example.com', password: 'admin123' },
                user: { email: 'john@example.com', password: 'password123' }
            }
        });
    } catch (error) {
        console.error('Seed Error:', error);
        res.status(500).json({ message: 'Error seeding database' });
    }
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'MERN Backend API',
        endpoints: {
            users: '/api/users',
            admins: '/api/admins',
            products: '/api/products',
            health: '/health'
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server spinning on port ${PORT}`));
