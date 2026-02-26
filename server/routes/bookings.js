const express = require("express");
const { body, validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking request
// @access  Private (Customer)
router.post(
  "/",
  auth,
  [
    body("vehicleId").notEmpty().withMessage("Vehicle ID is required"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { vehicleId, startDate, endDate, notes } = req.body;

      // Get the vehicle
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      // Parse dates
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Validate dates
      if (start >= end) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }

      if (start < new Date()) {
        return res
          .status(400)
          .json({ message: "Start date cannot be in the past" });
      }

      // Check for overlapping confirmed bookings
      const overlapping = await Booking.findOne({
        vehicle: vehicleId,
        status: { $in: ["pending", "confirmed"] },
        $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
      });

      if (overlapping) {
        return res.status(400).json({
          message: "Vehicle is already booked for the selected dates",
        });
      }

      // Calculate total price
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const totalPrice = days * vehicle.pricePerDay;

      const booking = new Booking({
        customer: req.user._id,
        vehicle: vehicleId,
        startDate: start,
        endDate: end,
        totalPrice,
        notes,
        status: "pending",
      });

      await booking.save();

      // Populate for response
      await booking.populate("customer", "name email phone");
      await booking.populate("vehicle", "name category pricePerDay images");

      res.status(201).json(booking);
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

// @route   GET /api/bookings/my
// @desc    Get current user's bookings
// @access  Private
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking (customer can cancel pending bookings)
// @access  Private
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending bookings can be cancelled" });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.id, customer: req.user._id },
      { status: "cancelled" },
      { new: true },
    );

    res.json(updatedBooking);
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
