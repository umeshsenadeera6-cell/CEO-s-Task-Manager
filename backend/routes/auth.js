// Authentication API Endpoints
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "diwya_spices_secret_jwt_key_2026";

// Dummy database query matching to simulate production database models
const MOCK_DB_USERS = [
  {
    username: "ceo",
    email: "ceo@diwyaspices.com",
    passwordHash: "$2a$10$XyZe3a9G/L8Zz1sPj/vXQOtNqK3sJkX2z1aPj/vXQOtNqK3sJkX2z", // bcript hash for "password123"
    name: "Sarah Alwis",
    role: "CEO",
    position: "Chief Executive Officer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    location: "Head Office",
    department: "Executive"
  }
];

/**
 * @route   POST /api/auth/login
 * @desc    Validate credentials and return JWT token
 */
router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: "Please provide both username/email and password parameters." });
  }

  try {
    // In production, execute a database query:
    // const user = await User.findOne({ $or: [{ email }, { username }] });
    const user = MOCK_DB_USERS.find(
      (u) =>
        u.username === usernameOrEmail.toLowerCase() ||
        u.email === usernameOrEmail.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ error: "Authentication failed: Invalid credentials." });
    }

    // In production, compare with bcrypt hashes:
    // const isMatch = await bcrypt.compare(password, user.passwordHash);
    const isMatch = password === "password123"; // Fallback demo matching

    if (!isMatch) {
      return res.status(401).json({ error: "Authentication failed: Invalid credentials." });
    }

    // Generate JWT token containing key user profile elements
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        role: user.role,
        location: user.location,
        department: user.department,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      success: true,
      message: "Digital login successful.",
      token: `Bearer ${token}`,
      user: {
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        position: user.position,
        avatar: user.avatar,
        location: user.location,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server exception handling authentication request." });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Validate session token and return context profile
 */
router.get("/me", verifyToken, (req, res) => {
  // In production, fetch fresh user data from database
  res.status(200).json({ user: req.user });
});

module.exports = router;
