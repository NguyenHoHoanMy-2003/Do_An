const { User } = require('../models');

exports.getUserById = async (req, res) => {
  try {
    const { id_user } = req.params;
    const user = await User.findOne({
      where: { id_user },
      attributes: [
        'id_user', 'name', 'phone', 'email', 'role',
        'date_of_birth', 'gender', 'date_of_issue', 'place_of_issue',
        'permanent_address', 'national_id', 'status', 'created_at'
      ]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
