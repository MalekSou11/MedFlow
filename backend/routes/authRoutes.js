const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashed, role });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });


    const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET
);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
