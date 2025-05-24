// controllers/floorController.js
const { Floor, Property } = require("../models");
const { v4: uuidv4 } = require("uuid");

// Get floors for a building
exports.getFloorsByBuilding = async (req, res) => {
    try {
        const { buildingId } = req.params;
        const building = await Property.findByPk(buildingId);
        if (!building) {
            return res.status(404).json({ message: "Building not found" });
        }
        const floors = await Floor.findAll({
            where: { property_id: buildingId }
        });
        const formattedFloors = floors.map(floor => ({
            id: floor.id,
            name: floor.name,
            property_id: floor.property_id
        }));
        res.status(200).json({
            message: "Fetched floors successfully",
            floors: formattedFloors
        });
    } catch (error) {
        console.error("Get Floors Error:", error);
        res.status(500).json({ message: "Server error when fetching floors" });
    }
};
// Giải thích:
// Mục đích: Trả về danh sách các tầng thuộc một tòa nhà cụ thể.
// Các bước:
// Kiểm tra sự tồn tại của tòa nhà: Tìm theo buildingId.
// Lấy tất cả các tầng thuộc tòa nhà đó từ bảng Floor.
// Trả về danh sách tầng đã được định dạng (chỉ trả về id, name, property_id).
// Sắp xếp các tầng theo thứ tự bảng chữ cái.


// Add a floor to a building
exports.addFloor = async (req, res) => {
    try {
        const { buildingId } = req.params;
        const { name } = req.body;
        const creatorId = req.user.id_user; // Lấy creatorId từ middleware checkHost

        // Kiểm tra building có tồn tại và thuộc về host này không
        const building = await Property.findOne({
            where: { 
                id_property: buildingId,
                host_id: creatorId // Kiểm tra building thuộc về host này
            }
        });

        if (!building) {
            return res.status(404).json({ 
                message: "Building not found or you don't have permission to add floors to this building" 
            });
        }

        // Kiểm tra tên tầng đã tồn tại chưa
        const existingFloor = await Floor.findOne({
            where: { 
                name, 
                property_id: buildingId 
            }
        });

        if (existingFloor) {
            return res.status(409).json({
                message: "A floor with this name already exists in the building",
                exists: true,
                floor: {
                    id: existingFloor.id,
                    name: existingFloor.name
                }
            });
        }

        // Tạo tầng mới
        const floor = await Floor.create({
            id: uuidv4(),
            name,
            property_id: buildingId
        });

        res.status(201).json({
            message: "Floor created successfully",
            floor: {
                id: floor.id,
                name: floor.name,
                property_id: floor.property_id
            }
        });
    } catch (error) {
        console.error("Add Floor Error:", error);
        res.status(500).json({ 
            message: "Server error when creating floor",
            error: error.message 
        });
    }
};
// Giải thích:
// Mục đích: Thêm một tầng mới vào tòa nhà.
// Các bước:
// Kiểm tra sự tồn tại của tòa nhà trước khi thêm tầng.
// Kiểm tra trùng lặp tầng: Nếu tầng đã tồn tại, trả về 409 Conflict.
// Tạo tầng mới nếu không trùng lặp.
// Trả về thông tin tầng mới tạo.


// Delete a floor
exports.deleteFloor = async (req, res) => {
    try {
        const { floorId } = req.params;

        const floor = await Floor.findByPk(floorId);
        if (!floor) {
            return res.status(404).json({ message: "Floor not found" });
        }

        await floor.destroy();

        res.status(200).json({ message: "Floor deleted successfully" });
    } catch (error) {
        console.error("Delete Floor Error:", error);
        res.status(500).json({ message: "Server error when deleting floor" });
    }
};
//Mục đích: Xóa một tầng cụ thể.
// Các bước:
// Tìm tầng theo floorId.
// Kiểm tra tồn tại: Nếu không tìm thấy tầng, trả về 404 Not Found.
// Xóa tầng: Sử dụng .destroy(), sẽ tự động xóa tất cả các phòng liên quan (cascading delete).
// Trả về thông báo thành công.