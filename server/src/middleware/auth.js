const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const { loginUser } = require("../controllers/authController");

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