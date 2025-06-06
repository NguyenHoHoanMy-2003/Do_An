const db = require("../models");
const Contract = db.Contract;
const Room = db.Room;
const User = db.User;
const Property = db.Property;
const Floor = db.Floor;

const getContractsForRenter = async (req, res) => {
  try {
    const tenantId = req.params.tenantId;

    const contracts = await Contract.findAll({
      where: { tenant_id: tenantId },
      include: [
        {
          model: Room,
          as: 'room', // Adjust alias based on actual association in models
          attributes: ['id_room', 'name', 'description'],
          include: [
            {
              model: Property,
              as: 'property', // Adjust alias
              attributes: ['id_property', 'name_bd', 'street_address'],
              include: [
                {
                  model: User,
                  as: 'host', // Adjust alias (assuming association exists)
                  attributes: ['id_user', 'name', 'phone'],
                }
              ]
            },
            {
              model: Floor,
              as: 'floor', // Adjust alias
              attributes: ['id', 'name'],
            }
          ]
        },
        {
          model: User,
          as: 'tenant', // Adjust alias (assuming association exists)
          attributes: ['id_user', 'name', 'phone'],
        }
      ],
    });

    res.status(200).json(contracts);
  } catch (err) {
    console.error("Error fetching contracts for renter:", err);
    res.status(500).json({ message: "Failed to fetch contracts.", error: err.message });
  }
};

module.exports = { getContractsForRenter }; 