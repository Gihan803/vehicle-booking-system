const express = require('express');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

// @route   GET /api/vehicles
// @desc    Get all vehicles with optional filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, transmission, fuelType, available } = req.query;

        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (minPrice || maxPrice) {
            filter.pricePerDay = {};
            if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
        }

        if (transmission) {
            filter.transmission = transmission;
        }

        if (fuelType) {
            filter.fuelType = fuelType;
        }

        if (available !== undefined) {
            filter.available = available === 'true';
        }

        const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error) {
        console.error('Get vehicles error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/vehicles/categories
// @desc    Get all unique categories with vehicle counts
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const categories = await Vehicle.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    minPrice: { $min: '$pricePerDay' },
                    image: { $first: { $arrayElemAt: ['$images', 0] } },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/vehicles/:id
// @desc    Get single vehicle by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        console.error('Get vehicle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
