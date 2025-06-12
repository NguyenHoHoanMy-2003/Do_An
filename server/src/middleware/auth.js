const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const { loginUser } = require("../controllers/authController");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Redirect Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback
router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id_user: req.user.id, name: req.user.name, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

// Redirect Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// Facebook Callback
router.get("/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id_user: req.user.id, name: req.user.name, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { name, phone, password } = req.body;

    // Kiểm tra trùng số điện thoại
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(409).json({ message: "Số điện thoại đã tồn tại!" });
    }

    // Tạo user bằng Sequelize
    const newUser = await User.create({
      name,
      phone,
      password,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Đăng ký thất bại:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Đăng nhập
router.post("/login", loginUser);

module.exports = router;