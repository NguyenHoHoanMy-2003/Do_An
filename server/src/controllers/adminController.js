const db = require('../models');
const { User, Property, Contract } = db;

// Lấy thống kê tổng quan
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalProperties = await Property.count();
        const totalContracts = await Contract.count();

        const userStats = await User.findAll({
            attributes: ['role', [db.sequelize.fn('COUNT', db.sequelize.col('id_user')), 'count']],
            group: ['role']
        });

        res.json({
            totalUsers,
            totalProperties,
            totalContracts,
            userStats
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Lỗi server khi lấy thống kê" });
    }
};

// Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng" });
    }
};

// Lấy thông tin người dùng theo ID
exports.getUserById = async (req, res) => {
    try {
        console.log("getUserById function hit!");
        const { userId } = req.params;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] } // Loại trừ mật khẩu
        });

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }

        res.json(user);
    } catch (error) {
        console.error("Get User by ID Error:", error);
        res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng." });
    }
};

// Cập nhật vai trò người dùng
exports.updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['admin', 'host', 'renter'].includes(role)) {
            return res.status(400).json({ message: "Vai trò không hợp lệ" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        await user.update({ role });
        res.json({ message: "Cập nhật vai trò thành công", user });
    } catch (error) {
        console.error("Update Role Error:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật vai trò" });
    }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        await user.destroy();
        res.json({ message: "Xóa người dùng thành công" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Lỗi server khi xóa người dùng" });
    }
};