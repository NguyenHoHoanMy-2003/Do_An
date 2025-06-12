const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware xác thực JWT
const verifyToken = async (req, res, next) => {
    try {   
        console.log("Received Authorization header:", req.headers.authorization);
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy token xác thực" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Token không hợp lệ" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

// Middleware kiểm tra quyền admin
const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                message: "Bạn không có quyền truy cập vào tài nguyên này" 
            });
        }
        next();
    } catch (error) {
        console.error("Admin Check Error:", error);
        res.status(500).json({ message: "Lỗi server khi kiểm tra quyền admin" });
    }
};

// Middleware kiểm tra quyền host
const isHost = async (req, res, next) => {
    try {
        if (req.user.role !== 'host') {
            return res.status(403).json({ 
                message: "Bạn không có quyền truy cập vào tài nguyên này" 
            });
        }
        next();
    } catch (error) {
        console.error("Host Check Error:", error);
        res.status(500).json({ message: "Lỗi server khi kiểm tra quyền host" });
    }
};

// Middleware kiểm tra quyền renter
const isRenter = async (req, res, next) => {
    try {
        if (req.user.role !== 'renter') {
            return res.status(403).json({ 
                message: "Bạn không có quyền truy cập vào tài nguyên này" 
            });
        }
        next();
    } catch (error) {
        console.error("Renter Check Error:", error);
        res.status(500).json({ message: "Lỗi server khi kiểm tra quyền renter" });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isHost,
    isRenter
};