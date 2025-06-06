const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu không khớp." });
    }

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(409).json({ message: "Số điện thoại đã tồn tại!" });
    }

    const newUser = await User.create({
      name,
      phone,
      password, // Không mã hóa nữa
    });

    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    console.error("Đăng ký thất bại:", err);
    res.status(500).json({ message: "Đăng ký thất bại.", error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(400).json({ message: "Số điện thoại không tồn tại." });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Sai mật khẩu." });
    }

    const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id_user: user.id_user,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Đăng nhập thất bại:", err);
    res.status(500).json({ message: "Đăng nhập thất bại.", error: err.message });
  }
};

module.exports = { registerUser, loginUser };