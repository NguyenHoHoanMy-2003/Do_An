const { User } = require("../models");

const checkHost = async (req, res, next) => {
    try {
        const creatorId = req.body.creatorId || req.headers['x-user-id'];
        if (!creatorId) {
            return res.status(401).json({ message: "Yêu cầu cung cấp ID người dùng" });
        }

        const user = await User.findByPk(creatorId);
        if (!user || user.role !== 'host') {
            return res.status(403).json({
                message: "Chỉ người dùng có vai trò host mới được phép thực hiện hành động này."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Check Host Error:", error);
        res.status(500).json({ message: "Lỗi server khi kiểm tra vai trò host" });
    }
};

module.exports = checkHost;