const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Định dạng token không hợp lệ' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Lấy thêm thông tin user từ database
    const user = await User.findByPk(decoded.id_user);
    if (!user) {
      return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' });
    }

    // Gán thông tin user đầy đủ vào req.user
    req.user = {
      id_user: user.id_user,
      role: user.role,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn' });
    } else {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }
  }
};

module.exports = { verifyToken }; 