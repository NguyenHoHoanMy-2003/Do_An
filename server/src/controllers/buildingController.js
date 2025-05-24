// controllers/buildingController.js
const { Property, District, City, Floor, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

// Check if building exists
exports.checkBuilding = async (req, res) => {
    try {
        const { buildingName } = req.params;

        const building = await Property.findOne({
            where: { name_bd: buildingName },
            include: [
                {
                    model: District,
                    as: 'district',
                    include: [
                        { model: City, as: 'city' }
                    ]
                }
            ]
        });

        if (!building) {
            return res.status(404).json({
                exists: false,
                message: "Building not found"
            });
        }

        res.status(200).json({
            exists: true,
            building: {
                id: building.id_property,
                name: building.name_bd,
                street_address: building.street_address,
                district: building.district?.name || null,
                city: building.district?.city?.name || null,
                description: building.description
            }
        });
    } catch (error) {
        console.error("Check Building Error:", error);
        res.status(500).json({ message: "Server error when checking building" });
    }
};
// Giải thích:
// Hàm này dùng để kiểm tra xem tòa nhà có tồn tại không.
// Sử dụng Property.findOne() để tìm tòa nhà theo name_bd (tên tòa nhà).
// Trả về 404 nếu không tìm thấy, 200 nếu tìm thấy, kèm theo thông tin về quận và thành phố.


// Create a new building
exports.createBuilding = async (req, res) => {
    try {
        const { name, street_address, district, city, description } = req.body;
        // Lấy creatorId từ user đã được kiểm tra bởi middleware
        const creatorId = req.user.id_user;

        // Kiểm tra building đã tồn tại
        const existingBuilding = await Property.findOne({
            where: { name_bd: name }
        });

        if (existingBuilding) {
            return res.status(409).json({
                message: "A building with this name already exists.",
                exists: true,
                building: {
                    id: existingBuilding.id_property,
                    name: existingBuilding.name_bd
                }
            });
        }

        let districtId = null;
        let cityId = null;

        if (city) {
            const [cityRecord] = await City.findOrCreate({
                where: { name: city },
                defaults: {
                    id: uuidv4(),
                    name: city
                }
            });

            cityId = cityRecord.id;

            if (district) {
                const [districtRecord] = await District.findOrCreate({
                    where: {
                        name: district,
                        city_id: cityId
                    },
                    defaults: {
                        id: uuidv4(),
                        name: district,
                        city_id: cityId
                    }
                });

                districtId = districtRecord.id;
            }
        }

        const building = await Property.create({
            id_property: uuidv4(),
            name_bd: name,
            host_id: creatorId, // Sử dụng creatorId từ user đã được kiểm tra
            street_address: street_address,
            district_id: districtId,
            city_id: cityId,
            description: description || null
        });

        res.status(201).json({
            message: "Building created successfully",
            building: {
                id: building.id_property,
                name: building.name_bd,
                host_id: building.host_id
            }
        });
    } catch (error) {
        console.error("Create Building Error:", error);
        res.status(500).json({ 
            message: "Server error when creating building",
            error: error.message 
        });
    }
};
// Giải thích:
// Hàm này dùng để tạo tòa nhà mới.
// Kiểm tra trùng lặp theo name_bd trước khi tạo.
// Tạo thành phố và quận nếu chưa tồn tại (City.findOrCreate(), District.findOrCreate()).
// Tạo bản ghi tòa nhà trong Property với name_bd, street_address, description và host_id.
// Trả về 409 Conflict nếu tòa nhà đã tồn tại.

// Get all buildings
exports.getAllBuildings = async (req, res) => {
    try {
        const buildings = await Property.findAll({
            include: [
                {
                    model: District,
                    as: 'district',
                    include: [
                        { model: City, as: 'city' }
                    ]
                },
                {
                    model: Floor,
                    as: 'floors'
                }
            ]
        });

        const formattedBuildings = buildings.map(building => ({
            id: building.id_property,
            name: building.name_bd,
            street_address: building.street_address,
            district: building.district?.name || null,
            city: building.district?.city?.name || null,
            description: building.description,
            floors: building.floors?.map(floor => ({
                id: floor.id,
                name: floor.name
            })) || []
        }));

        res.status(200).json({
            message: "Fetched all buildings successfully",
            buildings: formattedBuildings
        });
    } catch (error) {
        console.error("Get All Buildings Error:", error);
        res.status(500).json({ message: "Server error when fetching buildings" });
    }
};
// Giải thích:
// Hàm này trả về danh sách tất cả các tòa nhà.
// Gồm cả thông tin về quận, thành phố và tầng của mỗi tòa nhà.
// Định dạng lại dữ liệu trước khi trả về cho frontend.


// Delete a building
exports.deleteBuilding = async (req, res) => {
    try {
        const { buildingId } = req.params;

        // Tìm tòa nhà theo ID
        const building = await Property.findByPk(buildingId);

        if (!building) {
            return res.status(404).json({ message: "Building not found" });
        }

        // Xóa tòa nhà (sẽ xóa tất cả tầng và phòng liên quan nhờ cơ chế cascading)
        await building.destroy();

        res.status(200).json({ message: "Building and all associated floors/rooms deleted successfully" });
    } catch (error) {
        console.error("Delete Building Error:", error);
        res.status(500).json({ message: "Server error when deleting building" });
    }
};
// Giải thích:
// Hàm này dùng để xóa tòa nhà.
// Sử dụng Property.findByPk() để tìm theo id_property.
// Xóa tất cả các tầng và phòng liên quan bằng cascading delete.
// Trả về 404 nếu không tìm thấy.

exports.getBuildingById = async (req, res) => {
    try {
        const { buildingId } = req.params;
        const building = await Property.findByPk(buildingId, {
            include: [
                {
                    model: District,
                    as: 'district',
                    include: [{ model: City, as: 'city' }]
                }
            ]
        });
        if (!building) {
            return res.status(404).json({ message: "Building not found" });
        }
        res.status(200).json({
            building: {
                id: building.id_property,
                name: building.name_bd,
                street_address: building.street_address,
                district: building.district?.name || "",
                city: building.district?.city?.name || ""
            }
        });
    } catch (error) {
        console.error("Get Building By ID Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};