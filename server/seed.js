const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Vehicle.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const admin = new User({
            name: 'Admin',
            email: 'admin@pelmadullatxi.com',
            password: 'admin123',
            phone: '0771234567',
            nic: '200012345678',
            drivingLicense: 'DL-00001',
            role: 'admin',
        });
        await admin.save();
        console.log('✅ Admin user created');

        // Create sample vehicles
        const vehicles = [
            // Alto category
            {
                name: 'Suzuki Alto 800',
                category: 'Alto',
                pricePerDay: 3500,
                features: ['AC', 'Power Steering', 'Fuel Efficient', 'Compact'],
                images: ['/vehicles/alto-1.jpg'],
                seats: 4,
                transmission: 'Manual',
                fuelType: 'Petrol',
                year: 2020,
                plateNumber: 'CAB-1234',
                description: 'Compact and fuel-efficient Suzuki Alto, perfect for city driving around Pelmadulla and nearby areas.',
                available: true,
            },
            {
                name: 'Suzuki Alto K10',
                category: 'Alto',
                pricePerDay: 4000,
                features: ['AC', 'Power Steering', 'Power Windows', 'Central Lock'],
                images: ['/vehicles/alto-2.jpg'],
                seats: 4,
                transmission: 'Automatic',
                fuelType: 'Petrol',
                year: 2021,
                plateNumber: 'CAB-2345',
                description: 'Upgraded Alto K10 with automatic transmission for a smoother ride.',
                available: true,
            },
            // WagonR category
            {
                name: 'Suzuki WagonR FX',
                category: 'WagonR',
                pricePerDay: 4500,
                features: ['AC', 'Power Steering', 'USB Charging', 'Spacious Interior'],
                images: ['/vehicles/wagonr-1.jpg'],
                seats: 5,
                transmission: 'Manual',
                fuelType: 'Petrol',
                year: 2021,
                plateNumber: 'CAC-3456',
                description: 'Spacious WagonR with excellent mileage. Great for family trips from Pelmadulla.',
                available: true,
            },
            {
                name: 'Suzuki WagonR Stingray',
                category: 'WagonR',
                pricePerDay: 5000,
                features: ['AC', 'Push Start', 'Alloy Wheels', 'LED Headlights', 'Reverse Camera'],
                images: ['/vehicles/wagonr-2.jpg'],
                seats: 5,
                transmission: 'Automatic',
                fuelType: 'Hybrid',
                year: 2022,
                plateNumber: 'CAC-4567',
                description: 'Premium WagonR Stingray hybrid with push start and modern features.',
                available: true,
            },
            // Every category
            {
                name: 'Suzuki Every Van',
                category: 'Every',
                pricePerDay: 5500,
                features: ['AC', 'Sliding Doors', 'Large Cargo Space', 'Power Steering'],
                images: ['/vehicles/every-1.jpg'],
                seats: 7,
                transmission: 'Automatic',
                fuelType: 'Petrol',
                year: 2020,
                plateNumber: 'LB-5678',
                description: 'Versatile Suzuki Every with ample space for passengers and luggage.',
                available: true,
            },
            {
                name: 'Suzuki Every Wagon',
                category: 'Every',
                pricePerDay: 6000,
                features: ['AC', 'Turbo Engine', 'Sliding Doors', 'Alloy Wheels', 'Rear AC'],
                images: ['/vehicles/every-2.jpg'],
                seats: 7,
                transmission: 'Automatic',
                fuelType: 'Petrol',
                year: 2021,
                plateNumber: 'LB-6789',
                description: 'Premium Every Wagon with turbo engine and rear AC for maximum comfort.',
                available: true,
            },
            // Buddy category
            {
                name: 'Suzuki Buddy Van',
                category: 'Buddy',
                pricePerDay: 5000,
                features: ['AC', 'Sliding Doors', 'Rear Seats', 'Power Steering'],
                images: ['/vehicles/buddy-1.jpg'],
                seats: 7,
                transmission: 'Manual',
                fuelType: 'Petrol',
                year: 2019,
                plateNumber: 'LB-7890',
                description: 'Reliable Buddy Van, perfect for group travels and tours.',
                available: true,
            },
            // Premio category
            {
                name: 'Toyota Premio G Superior',
                category: 'Premio',
                pricePerDay: 7000,
                features: ['AC', 'Leather Seats', 'Push Start', 'Cruise Control', 'Alloy Wheels'],
                images: ['/vehicles/premio-1.jpg'],
                seats: 5,
                transmission: 'Automatic',
                fuelType: 'Petrol',
                year: 2018,
                plateNumber: 'KE-8901',
                description: 'Luxury Toyota Premio sedan with leather interior and premium features.',
                available: true,
            },
            {
                name: 'Toyota Premio F EX Package',
                category: 'Premio',
                pricePerDay: 6500,
                features: ['AC', 'Fabric Seats', 'Keyless Entry', 'ABS', 'Airbags'],
                images: ['/vehicles/premio-2.jpg'],
                seats: 5,
                transmission: 'Automatic',
                fuelType: 'Petrol',
                year: 2017,
                plateNumber: 'KE-9012',
                description: 'Well-maintained Toyota Premio, comfortable and reliable for long-distance travel.',
                available: true,
            },
            // Axio category
            {
                name: 'Toyota Axio G Grade',
                category: 'Axio',
                pricePerDay: 6000,
                features: ['AC', 'Push Start', 'Reverse Camera', 'Bluetooth', 'USB'],
                images: ['/vehicles/axio-1.jpg'],
                seats: 5,
                transmission: 'Automatic',
                fuelType: 'Hybrid',
                year: 2019,
                plateNumber: 'KF-0123',
                description: 'Fuel-efficient Toyota Axio hybrid. Lower running costs for longer trips.',
                available: true,
            },
            // Aqua category
            {
                name: 'Toyota Aqua S Grade',
                category: 'Aqua',
                pricePerDay: 5500,
                features: ['AC', 'Hybrid Economy', 'Push Start', 'Navigation', 'Reverse Camera'],
                images: ['/vehicles/aqua-1.jpg'],
                seats: 5,
                transmission: 'Automatic',
                fuelType: 'Hybrid',
                year: 2020,
                plateNumber: 'KG-1234',
                description: 'Toyota Aqua — one of the most fuel-efficient vehicles for eco-friendly travel.',
                available: true,
            },
            {
                name: 'Toyota Aqua Crossover',
                category: 'Aqua',
                pricePerDay: 6000,
                features: ['AC', 'Hybrid', 'Crossover Style', 'Roof Rails', 'LED Lights'],
                images: ['/vehicles/aqua-2.jpg'],
                seats: 5,
                transmission: 'Automatic',
                fuelType: 'Hybrid',
                year: 2021,
                plateNumber: 'KG-2345',
                description: 'Stylish Aqua Crossover with raised ground clearance, great for Pelmadulla roads.',
                available: true,
            },
            // Prius category
            {
                name: 'Toyota Prius S Touring',
                category: 'Prius',
                pricePerDay: 7500,
                features: ['AC', 'Hybrid', 'Leather Seats', 'JBL Audio', 'Heads-up Display'],
                images: ['/vehicles/prius-1.jpg'],
                seats: 5,
                transmission: 'Automatic',
                fuelType: 'Hybrid',
                year: 2020,
                plateNumber: 'KH-3456',
                description: 'Premium Toyota Prius with top-notch hybrid technology and luxury features.',
                available: true,
            },
            // Van category
            {
                name: 'Toyota KDH Van',
                category: 'Van',
                pricePerDay: 10000,
                features: ['AC', 'Rear AC', '15 Seats', 'Power Door', 'Luggage Space'],
                images: ['/vehicles/van-1.jpg'],
                seats: 15,
                transmission: 'Manual',
                fuelType: 'Diesel',
                year: 2019,
                plateNumber: 'NC-4567',
                description: 'Spacious Toyota KDH for large groups, pilgrimages, and tours from Pelmadulla.',
                available: true,
            },
            {
                name: 'Toyota HiAce GL',
                category: 'Van',
                pricePerDay: 12000,
                features: ['AC', 'Dual AC', '12 Seats', 'Automatic Door', 'TV Screen'],
                images: ['/vehicles/van-2.jpg'],
                seats: 12,
                transmission: 'Automatic',
                fuelType: 'Diesel',
                year: 2021,
                plateNumber: 'NC-5678',
                description: 'Premium HiAce GL with dual AC and entertainment system for comfort travel.',
                available: true,
            },
            // SUV category
            {
                name: 'Toyota Land Cruiser Prado',
                category: 'SUV',
                pricePerDay: 15000,
                features: ['4WD', 'AC', 'Leather Interior', 'Navigation', 'Sunroof', '7 Seats'],
                images: ['/vehicles/suv-1.jpg'],
                seats: 7,
                transmission: 'Automatic',
                fuelType: 'Diesel',
                year: 2020,
                plateNumber: 'SP-6789',
                description: 'Powerful Toyota Prado 4WD SUV for adventure trips and off-road journeys.',
                available: true,
            },
        ];

        await Vehicle.insertMany(vehicles);
        console.log(`✅ ${vehicles.length} vehicles created`);

        console.log('\n🎉 Seed completed successfully!');
        console.log('Admin login: admin@pelmadullatxi.com / admin123');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
