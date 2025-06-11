// routes/auth.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, verifyOtp, resendOtp } = require("../controllers/authController");

// Đăng ký
router.post("/register", registerUser);

// Đăng nhập
router.post("/login", loginUser);

// OTP
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);  

module.exports = router;