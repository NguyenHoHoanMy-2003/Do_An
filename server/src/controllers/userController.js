const { User } = require("../models");

// Lấy thông tin chi tiết người dùng
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
    });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng.", error: error.message });
  }
};

// Lấy thông tin người dùng theo CCCD
exports.getUserByCCCD = async (req, res) => {
  try {
    const { nationalId } = req.params;
    const user = await User.findOne({
      where: { national_id: nationalId },
      attributes: ['id_user', 'name', 'phone', 'national_id', 'date_of_issue', 'place_of_issue']
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng với CCCD này." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng theo CCCD:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng.", error: error.message });
  }
};

// Cập nhật thông tin người dùng
exports.updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let { phone, password, name, email, dob, gender, issueDate, placeOfIssue, address, cccd } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Cập nhật các trường
    user.phone = phone || user.phone;
    user.name = name || user.name;
    user.email = email || user.email;
    user.date_of_birth = dob || user.date_of_birth;
    user.gender = gender || user.gender;
    user.date_of_issue = issueDate || user.date_of_issue;
    user.place_of_issue = placeOfIssue || user.place_of_issue;
    user.permanent_address = address || user.permanent_address;
    user.national_id = cccd || user.national_id;

    // Cập nhật mật khẩu trực tiếp nếu được cung cấp
    if (password) {
      user.password = password;
    }

    await user.save();

    res.status(200).json({ message: "Cập nhật thông tin thành công!" });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin người dùng.", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
    try {
        console.log("getUserById (userController) function hit!");
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