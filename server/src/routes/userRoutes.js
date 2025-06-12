const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// Route để lấy thông tin chi tiết người dùng
router.get("/:id", userController.getUserDetails);

// Route để lấy thông tin người dùng theo CCCD
// router.get("/cccd/:nationalId", userController.getUserByCCCD);

// Route để cập nhật thông tin người dùng
router.put("/:id", userController.updateUserDetails);

router.get("/:userId", verifyToken, userController.getUserById);

module.exports = router; 