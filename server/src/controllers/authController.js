const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');

const otpStore = new Map();

// Helper functions
const generateOTP = () => otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false
});

const normalizePhone = (phone) => phone.replace(/\D/g, '');

// Đăng ký
const registerUser = async (req, res) => {
  try {
    const { name, phone, password, confirmPassword } = req.body;
    const cleanedPhone = normalizePhone(phone);

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu không khớp." });
    }

    const existingUser = await User.findOne({ where: { phone: cleanedPhone } });
    if (existingUser) {
      return res.status(409).json({ message: "Số điện thoại đã tồn tại!" });
    }

    const otp = generateOTP();
    const expirationTime = Date.now() + 60000;

    otpStore.set(cleanedPhone, {
      otp,
      expirationTime,
      userData: { name, phone: cleanedPhone, password }
    });

    console.log(`[OTP DEBUG] ${cleanedPhone}: ${otp}`);
    res.json({ success: true, message: "Đã gửi OTP", phone: cleanedPhone });
    
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Gửi lại OTP
const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const cleanedPhone = normalizePhone(phone);
    
    console.log('Kiểm tra OTP Store:', otpStore);
    const record = otpStore.get(cleanedPhone);

    if (!record) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng thực hiện lại thao tác đăng ký" 
      });
    }

    // Tạo OTP mới
    const newOtp = generateOTP();
    const newExpiration = Date.now() + 60000;

    otpStore.set(cleanedPhone, {
      ...record,
      otp: newOtp,
      expirationTime: newExpiration
    });

    console.log(`[OTP DEBUG] Gửi lại OTP cho ${cleanedPhone}: ${newOtp}`);
    res.json({ success: true, message: "Đã gửi lại OTP" });

  } catch (error) {
    console.error("Lỗi gửi lại OTP:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Xác thực OTP
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const cleanedPhone = normalizePhone(phone);
    const record = otpStore.get(cleanedPhone);

    if (!record) {
      return res.status(400).json({ message: "Không tìm thấy yêu cầu OTP" });
    }

    if (Date.now() > record.expirationTime) {
      otpStore.delete(cleanedPhone);
      return res.status(410).json({ message: "OTP đã hết hạn" });
    }

    if (otp !== record.otp) {
      return res.status(401).json({ message: "Mã OTP không đúng" });
    }

    const newUser = await User.create(record.userData);
    otpStore.delete(cleanedPhone);

    const token = jwt.sign(
      { userId: newUser.id_user },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: "Đăng ký thành công",
      token,
      user: {
        id: newUser.id_user,
        name: newUser.name,
        phone: newUser.phone
        
      }
    });

  } catch (error) {
    console.error("Lỗi xác thực:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
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

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp
};