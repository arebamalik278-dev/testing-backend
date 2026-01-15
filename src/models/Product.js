const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['Electronics', 'Clothing', 'Home', 'Sports', 'Books', 'Other']
    },
    imageURL: {
        type: String,
        required: [true, 'Product image URL is required'],
        validate: {
            validator: function(v) {
                return /^(https?:\/\/)/.test(v);
            },
            message: 'Please provide a valid image URL'
        }
    },
    stock: {
        type: Number,
        required: [true, 'Product stock is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Product', productSchema);

