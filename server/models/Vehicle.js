const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vehicle name is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Alto', 'WagonR', 'Every', 'Buddy', 'Premio', 'Axio', 'Aqua', 'Prius', 'Van', 'SUV', 'Other'],
        trim: true,
    },
    pricePerDay: {
        type: Number,
        required: [true, 'Price per day is required'],
        min: 0,
    },
    features: [{
        type: String,
        trim: true,
    }],
    images: [{
        type: String,
    }],
    seats: {
        type: Number,
        required: true,
        min: 1,
    },
    transmission: {
        type: String,
        enum: ['Automatic', 'Manual'],
        default: 'Manual',
    },
    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
        default: 'Petrol',
    },
    year: {
        type: Number,
    },
    plateNumber: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
