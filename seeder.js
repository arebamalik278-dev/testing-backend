const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Models
const User = require('./src/models/User');
const Admin = require('./src/models/Admin');
const Product = require('./src/models/Product');

// Mock Data
const users = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        isAdmin: false
    }
];

const admins = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123'
    }
];

const products = [
    {
        name: 'iPhone 15 Pro',
        price: 999,
        description: 'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
        category: 'Electronics',
        imageURL: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
        stock: 50
    },
    {
        name: 'MacBook Pro 14"',
        price: 1999,
        description: 'Powerful laptop with M3 Pro chip, stunning Liquid Retina XDR display.',
        category: 'Electronics',
        imageURL: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        stock: 25
    },
    {
        name: 'Nike Air Jordan 1',
        price: 180,
        description: 'Classic basketball shoes with premium leather and iconic design.',
        category: 'Clothing',
        imageURL: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500',
        stock: 100
    },
    {
        name: 'Sony WH-1000XM5',
        price: 349,
        description: 'Industry-leading noise canceling wireless headphones.',
        category: 'Electronics',
        imageURL: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500',
        stock: 75
    },
    {
        name: 'Yoga Mat Premium',
        price: 45,
        description: 'Non-slip yoga mat with extra cushioning for comfortable workouts.',
        category: 'Sports',
        imageURL: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        stock: 200
    },
    {
        name: 'Coffee Maker Deluxe',
        price: 129,
        description: 'Programmable coffee maker with built-in grinder and thermal carafe.',
        category: 'Home',
        imageURL: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
        stock: 60
    },
    {
        name: 'The Great Gatsby',
        price: 15,
        description: 'Classic American novel by F. Scott Fitzgerald.',
        category: 'Books',
        imageURL: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        stock: 500
    },
    {
        name: 'Running Shoes Pro',
        price: 120,
        description: 'Lightweight running shoes with advanced cushioning technology.',
        category: 'Sports',
        imageURL: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        stock: 150
    }
];

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing collections...');
        await User.deleteMany({});
        await Admin.deleteMany({});
        await Product.deleteMany({});

        // Seed Users
        console.log('👤 Seeding Users...');
        const salt = await bcrypt.genSalt(10);
        const seededUsers = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, salt);
                return await User.create({ ...user, password: hashedPassword });
            })
        );
        console.log(`   ✅ ${seededUsers.length} Users created`);

        // Seed Admins
        console.log('👑 Seeding Admins...');
        const seededAdmins = await Promise.all(
            admins.map(async (admin) => {
                const hashedPassword = await bcrypt.hash(admin.password, salt);
                return await Admin.create({ ...admin, password: hashedPassword });
            })
        );
        console.log(`   ✅ ${seededAdmins.length} Admins created`);

        // Seed Products
        console.log('📦 Seeding Products...');
        const seededProducts = await Product.insertMany(products);
        console.log(`   ✅ ${seededProducts.length} Products created`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('   User: john@example.com / password123');
        console.log('   Admin: admin@example.com / admin123');
        console.log('   Product Count: 8 products\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed Error:', error);
        process.exit(1);
    }
};

// Run seeder
seedData();

