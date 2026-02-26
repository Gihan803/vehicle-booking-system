const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true,
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
        default: 'pending',
    },
    rejectionReason: {
        type: String,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Populate customer and vehicle info when querying
bookingSchema.pre(/^find/, function () {
    this.populate('customer', 'name email phone nic drivingLicense')
        .populate('vehicle', 'name category pricePerDay images plateNumber');
});

module.exports = mongoose.model('Booking', bookingSchema);
