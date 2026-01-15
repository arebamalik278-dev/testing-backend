const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db.js');

// Import Routes
const userRoutes = require('./src/routes/userRoutes.js');
const adminRoutes = require('./src/routes/adminRoutes.js');
const productRoutes = require('./src/routes/productRoutes.js');

const app = new express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: ['https://clienttesting.vervel.app', 'https://admintesting.vercel.app']
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/products', productRoutes);

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
