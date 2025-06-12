// routes/auth.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, verifyOtp, resendOtp } = require("../controllers/authController");
const passport = require("passport");


// Đăng ký
router.post("/register", registerUser);

// Đăng nhập
router.post("/login", loginUser);

// OTP
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);  

// Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL); // Sau khi đăng nhập thành công
  }
);

// Facebook login
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

// Trả thông tin người dùng sau khi đăng nhập xã hội
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id_user: req.user?.id_user,
        name: req.user?.name,
        role: req.user?.role,
      },
      token: req.user?.token || "", // tuỳ bạn có muốn thêm không
    });
  } else {
    res.status(401).json({ message: "Người dùng chưa đăng nhập." });
  }
});

module.exports = router;