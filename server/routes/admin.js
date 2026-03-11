const express = require("express");
const multer = require("multer");
const path = require("path");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const User = require("../models/User");
const { auth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Multer config for vehicle image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files (JPEG, PNG, WebP) are allowed"));
  },
});

// All admin routes require auth + admin role
router.use(auth, requireAdmin);

// ==================== DASHBOARD STATS ====================

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get("/stats", async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const availableVehicles = await Vehicle.countDocuments({ available: true });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // Calculate total revenue from confirmed bookings
    const revenueResult = await Booking.aggregate([
      { $match: { status: { $in: ["confirmed", "completed"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalVehicles,
      availableVehicles,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalCustomers,
      totalRevenue,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== BOOKING MANAGEMENT ====================

// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Admin
router.get("/bookings", async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/bookings/:id
// @desc    Update booking status (approve/reject)
// @access  Admin
router.put("/bookings/:id", async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["confirmed", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const currentBooking = await Booking.findById(req.params.id);
    if (!currentBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check for overlaps when confirming
    if (status === "confirmed") {
      const vehicleId = currentBooking.vehicle._id || currentBooking.vehicle;
      console.log(`Checking overlaps for vehicle ${vehicleId} between ${currentBooking.startDate} and ${currentBooking.endDate}`);

      const overlapping = await Booking.findOne({
        vehicle: vehicleId,
        status: { $in: ["confirmed", "completed"] },
        _id: { $ne: req.params.id },
        $or: [
          {
            startDate: { $lte: currentBooking.endDate },
            endDate: { $gte: currentBooking.startDate },
          },
        ],
      });

      if (overlapping) {
        console.log(`Overlapping booking found: ${overlapping._id}`);
        return res.status(400).json({
          message: "Vehicle is already booked for these dates. Please reject or reschedule.",
        });
      }
    }

    const updateData = { status };
    if (status === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== VEHICLE MANAGEMENT ====================

// @route   POST /api/admin/vehicles
// @desc    Add a new vehicle
// @access  Admin
router.post("/vehicles", upload.array("images", 5), async (req, res) => {
  try {
    const {
      name,
      category,
      pricePerDay,
      features,
      seats,
      transmission,
      fuelType,
      year,
      plateNumber,
      description,
    } = req.body;

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const vehicle = new Vehicle({
      name,
      category,
      pricePerDay: Number(pricePerDay),
      features: features
        ? typeof features === "string"
          ? JSON.parse(features)
          : features
        : [],
      images,
      seats: Number(seats),
      transmission,
      fuelType,
      year: year ? Number(year) : undefined,
      plateNumber,
      description,
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Add vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/vehicles/:id
// @desc    Update a vehicle
// @access  Admin
router.put("/vehicles/:id", upload.array("images", 5), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const {
      name,
      category,
      pricePerDay,
      features,
      seats,
      transmission,
      fuelType,
      year,
      plateNumber,
      description,
      available,
    } = req.body;

    if (name) vehicle.name = name;
    if (category) vehicle.category = category;
    if (pricePerDay) vehicle.pricePerDay = Number(pricePerDay);
    if (features)
      vehicle.features =
        typeof features === "string" ? JSON.parse(features) : features;
    if (seats) vehicle.seats = Number(seats);
    if (transmission) vehicle.transmission = transmission;
    if (fuelType) vehicle.fuelType = fuelType;
    if (year) vehicle.year = Number(year);
    if (plateNumber) vehicle.plateNumber = plateNumber;
    if (description) vehicle.description = description;
    if (available !== undefined)
      vehicle.available = available === "true" || available === true;

    // Replace existing images if new ones are uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      vehicle.images = newImages;
    }

    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    console.error("Update vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/admin/vehicles/:id
// @desc    Delete a vehicle
// @access  Admin
router.delete("/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      vehicle: req.params.id,
      status: { $in: ["pending", "confirmed"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: "Cannot delete vehicle with active bookings",
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== CUSTOMER MANAGEMENT ====================

// @route   GET /api/admin/customers
// @desc    Get all customers
// @access  Admin
router.get("/customers", async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).sort({
      createdAt: -1,
    });
    res.json(customers);
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
