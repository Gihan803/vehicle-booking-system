const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new customer
// @access  Public
router.post(
    "/register",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Please enter a valid email"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        body("phone").notEmpty().withMessage("Phone number is required"),
        body("nic").notEmpty().withMessage("NIC/ID number is required"),
        body("drivingLicense")
            .notEmpty()
            .withMessage("Driving license is required"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, email, password, phone, nic, drivingLicense } = req.body;

            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .json({ message: "User already exists with this email" });
            }

            user = new User({
                name,
                email,
                password,
                phone,
                nic,
                drivingLicense,
                role: "customer",
            });

            await user.save();

            // Generate JWT
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            res.status(201).json({
                token,
                user: user.toJSON(),
            });
        } catch (error) {
            console.error("Register error:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Please enter a valid email"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // Generate JWT
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            res.json({
                token,
                user: user.toJSON(),
            });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
);

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get("/me", auth, async (req, res) => {
    try {
        res.json(req.user.toJSON());
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
    try {
        const { name, phone, nic, drivingLicense } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (nic) updates.nic = nic;
        if (drivingLicense) updates.drivingLicense = drivingLicense;

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
        });
        res.json(user.toJSON());
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
