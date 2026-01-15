# Backend Connection Plan: Frontend & Admin Panel

## 📋 Current Backend Structure Analysis

### ✅ Already Configured:
- **CORS**: Enabled for `https://clienttesting.vervel.app` (frontend) and `https://admintesting.vercel.app` (admin)
- **Authentication**: JWT-based with separate user and admin authentication
- **Database**: MongoDB connection configured
- **API Endpoints**: RESTful endpoints for users, admins, and products

---

## 🎨 Frontend Connection Guide (clienttesting.vervel.app)

### 1. User Authentication API

#### **Register User**
```http
POST /api/users/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword123"
}
```

**Frontend Implementation:**
```javascript
// Register user
const registerUser = async (userData) => {
    const response = await fetch('https://your-backend-domain.com/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
        // Store token in localStorage or secure storage
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
            isAdmin: data.isAdmin
        }));
        return { success: true, user: data };
    } else {
        return { success: false, message: data.message };
    }
};
```

#### **Login User**
```http
POST /api/users/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "yourpassword123"
}
```

**Frontend Implementation:**
```javascript
// Login user
const loginUser = async (email, password) => {
    const response = await fetch('https://your-backend-domain.com/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return { success: true, user: data };
    } else {
        return { success: false, message: data.message };
    }
};
```

#### **Get User Profile (Protected)**
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Frontend Implementation:**
```javascript
// Get user profile
const getUserProfile = async () => {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('https://your-backend-domain.com/api/users/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    const data = await response.json();
    return data;
};
```

### 2. Product Display API (Public)

#### **Get All Products**
```http
GET /api/products
```

**Frontend Implementation:**
```javascript
// Fetch all products
const getProducts = async () => {
    const response = await fetch('https://your-backend-domain.com/api/products');
    const products = await response.json();
    return products;
};
```

#### **Get Single Product**
```http
GET /api/products/:id
```

**Frontend Implementation:**
```javascript
// Fetch single product
const getProductById = async (productId) => {
    const response = await fetch(`https://your-backend-domain.com/api/products/${productId}`);
    const product = await response.json();
    return product;
};
```

### 3. Frontend Token Management

```javascript
// auth.js - Authentication utilities

// Check if user is logged in
export const isLoggedIn = () => {
    const token = localStorage.getItem('userToken');
    return !!token;
};

// Get auth token
export const getAuthToken = () => {
    return localStorage.getItem('userToken');
};

// Logout user
export const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
};

// Authenticated request helper
export const authenticatedFetch = async (url, options = {}) => {
    const token = getAuthToken();
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    const response = await fetch(url, { ...options, ...defaultOptions });
    return response;
};
```

---

## 👨‍💼 Admin Panel Connection Guide (admintesting.vercel.app)

### 1. Admin Authentication API

#### **Login Admin**
```http
POST /api/admins/login
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "adminpassword123"
}
```

**Admin Panel Implementation:**
```javascript
// Login admin
const loginAdmin = async (email, password) => {
    const response = await fetch('https://your-backend-domain.com/api/admins/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminInfo', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email
        }));
        return { success: true, admin: data };
    } else {
        return { success: false, message: data.message };
    }
};
```

### 2. Admin Product Management (Protected)

#### **Create Product (Admin Only)**
```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "name": "New Product",
    "price": 99.99,
    "description": "Product description",
    "category": "Electronics",
    "imageURL": "https://example.com/image.jpg",
    "stock": 50
}
```

**Admin Panel Implementation:**
```javascript
// Create product (admin)
const createProduct = async (productData) => {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch('https://your-backend-domain.com/api/products', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });
    
    const data = await response.json();
    return { success: response.ok, data };
};
```

#### **Update Product (Admin Only)**
```http
PUT /api/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "name": "Updated Product Name",
    "price": 149.99,
    "stock": 100
}
```

#### **Delete Product (Admin Only)**
```http
DELETE /api/products/:id
Authorization: Bearer <admin_token>
```

### 3. Admin Panel Helper Functions

```javascript
// adminAuth.js - Admin authentication utilities

// Check if admin is logged in
export const isAdminLoggedIn = () => {
    const token = localStorage.getItem('adminToken');
    return !!token;
};

// Get admin token
export const getAdminToken = () => {
    return localStorage.getItem('adminToken');
};

// Admin logout
export const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    window.location.href = '/admin/login';
};

// Admin authenticated request helper
export const adminAuthenticatedFetch = async (url, options = {}) => {
    const token = getAdminToken();
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    const response = await fetch(url, { ...options, ...defaultOptions });
    return response;
};
```

---

## 🔧 Backend Configuration Checklist

### 1. Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
```

### 2. CORS Configuration ✅ (Already configured in index.js)
- Frontend: `https://clienttesting.vervel.app`
- Admin: `https://admintesting.vercel.app`

### 3. Required Backend Improvements

#### **A. Add Protected Admin Routes for Product Management**
Update `src/routes/productRoutes.js`:

```javascript
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

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin protected routes
router.post('/', protect, adminMiddleware, createProduct);
router.put('/:id', protect, adminMiddleware, updateProduct);
router.delete('/:id', protect, adminMiddleware, deleteProduct);

module.exports = router;
```

#### **B. Add Logout Endpoint (Optional but Recommended)**
Add to `src/routes/userRoutes.js`:
```javascript
// @route   POST /api/users/logout
router.post('/logout', (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
});
```

#### **C. Add User Profile Update (Optional)**
Add to `src/controllers/userController.js`:
```javascript
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            
            if (req.body.password) {
                user.password = req.body.password;
            }
            
            const updatedUser = await user.save();
            
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
```

Add route to `src/routes/userRoutes.js`:
```javascript
router.put('/profile', protect, updateUserProfile);
```

---

## 📝 Frontend Code Examples

### React Integration Example

```javascript
// api.js - Centralized API calls
const API_BASE = 'https://your-backend-domain.com';

// User APIs
export const userAPI = {
    register: (userData) => 
        fetch(`${API_BASE}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        }).then(res => res.json()),
    
    login: (credentials) => 
        fetch(`${API_BASE}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }).then(res => res.json()),
    
    getProfile: () => {
        const token = localStorage.getItem('userToken');
        return fetch(`${API_BASE}/api/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    }
};

// Product APIs (Public)
export const productAPI = {
    getAll: () => 
        fetch(`${API_BASE}/api/products`).then(res => res.json()),
    
    getById: (id) => 
        fetch(`${API_BASE}/api/products/${id}`).then(res => res.json())
};

// Admin APIs
export const adminAPI = {
    login: (credentials) => 
        fetch(`${API_BASE}/api/admins/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }).then(res => res.json()),
    
    createProduct: (productData) => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE}/api/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        }).then(res => res.json());
    },
    
    updateProduct: (id, productData) => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE}/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        }).then(res => res.json());
    },
    
    deleteProduct: (id) => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE}/api/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    }
};
```

---

## 🚀 Deployment Checklist

### Backend (Render/Heroku/AWS):
- [ ] Set environment variables (MONGODB_URI, JWT_SECRET, PORT)
- [ ] Update CORS origins for production URLs
- [ ] Enable SSL/HTTPS
- [ ] Set up proper error handling
- [ ] Configure logging

### Frontend (Vercel/Netlify):
- [ ] Set API base URL in environment variables
- [ ] Configure redirect URLs for authentication
- [ ] Set up proper error handling and loading states
- [ ] Implement proper token storage (avoid localStorage for sensitive data if possible)

### Admin Panel (Vercel/Netlify):
- [ ] Set admin API base URL
- [ ] Implement proper authentication guards
- [ ] Set up role-based access control
- [ ] Configure admin-specific error handling

---

## 🔒 Security Recommendations

1. **Use HTTPS in production** for all API calls
2. **Store tokens securely** (consider HttpOnly cookies for production)
3. **Implement proper error handling** to avoid exposing sensitive information
4. **Add rate limiting** to prevent brute force attacks
5. **Validate all inputs** on both frontend and backend
6. **Implement proper CORS** restrictions
7. **Use environment variables** for all sensitive configuration
8. **Regularly update dependencies** to patch security vulnerabilities

---

## 📞 API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/users/register | Public | Register new user |
| POST | /api/users/login | Public | Login user |
| GET | /api/users/profile | Private | Get user profile |
| POST | /api/admins/login | Public | Login admin |
| POST | /api/admins/register | Public | Register admin |
| GET | /api/products | Public | Get all products |
| GET | /api/products/:id | Public | Get single product |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |

---

## ✅ Next Steps

1. **Update product routes** to protect admin endpoints (shown above)
2. **Add JWT_SECRET** to your `.env` file (at least 32 characters)
3. **Update CORS** if needed for your production URLs
4. **Deploy backend** and get the production URL
5. **Configure frontend** with the production backend URL
6. **Test all endpoints** before going live
7. **Implement proper error handling** in frontend applications
8. **Add loading states and notifications** for better UX

This plan provides everything you need to connect your backend with both the frontend and admin panel successfully!

