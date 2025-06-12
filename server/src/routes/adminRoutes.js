const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Áp dụng middleware xác thực và kiểm tra quyền admin cho tất cả các routes
router.use(verifyToken);
router.use(isAdmin);

// Lấy thống kê tổng quan
router.get('/dashboard', adminController.getDashboardStats);

// Quản lý người dùng
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router; 