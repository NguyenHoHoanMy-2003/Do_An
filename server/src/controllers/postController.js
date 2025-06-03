// controllers/postController.js
const {
  Post, Attribute, Category, Label, Overview,
  District, User, Property, Room, Image, Floor, City
} = require("../models");
const { v4: uuidv4 } = require("uuid");

// ================================
// API: Tạo bài đăng mới
// ================================
exports.createPost = async (req, res) => {
  try {
    // Destructure req.body để lấy creatorId trước
    const { creatorId } = req.body;

    //  Kiểm tra quyền của người dùng (chỉ host mới được phép tạo bài đăng)
    const user = await User.findByPk(creatorId);
    if (!user || user.role !== 'host') {
      return res.status(403).json({
        message: 'Chỉ người dùng có vai trò host mới được phép tạo bài đăng.'
      });
    }

    // Destructure các field còn lại từ req.body
    const {
      type,
      buildingName, floorName,
      streetAddress, city, district,
      guestCount, bedroomCount, bedCount, bathroomCount,
      amenities,
      title, description, price, area,
      duration, target, label,
      name
    } = req.body;

    // B1: Tạo category nếu chưa có
    const category = await Category.findOrCreate({
      where: { value: type },
      defaults: {
        id: uuidv4(),
        code: type.slice(0, 3).toUpperCase(),
        value: type,
        header: `${type} - header`,
        subheader: `${type} - subheader`
      }
    });

    // B2: Tìm hoặc tạo city
    let cityRecord = null;
    if (city) {
      const [cityData] = await City.findOrCreate({
        where: { name: city },
        defaults: {
          id: uuidv4(),
          name: city
        }
      });
      cityRecord = cityData;
    }

    // B3: Tìm hoặc tạo district
    let districtRecord = null;
    if (district && cityRecord) {
      const [districtData] = await District.findOrCreate({
        where: {
          name: district,
          city_id: cityRecord.id
        },
        defaults: {
          id: uuidv4(),
          name: district,
          city_id: cityRecord.id
        }
      });
      districtRecord = districtData;
    }

    // B4: Tìm hoặc tạo building (property)
    let property = null;
    if (buildingName) {
      // Tìm building hiện có
      property = await Property.findOne({
        where: { name_bd: buildingName }
      });

      // Nếu chưa có, tạo mới
      if (!property) {
        // Kiểm tra các trường cần thiết cho building mới
        if (!streetAddress || !city || !district) {
             return res.status(400).json({ message: "Địa chỉ (Street Address, City, District) là bắt buộc khi thêm tòa nhà mới." });
        }
        // Kiểm tra lại creatorId có tồn tại không
        if (!creatorId) {
            return res.status(401).json({ message: "User ID không hợp lệ." });
        }

        property = await Property.create({
          id_property: uuidv4(),
          name_bd: buildingName, // Đã đảm bảo có giá trị ở đây
          host_id: creatorId,
          street_address: streetAddress,
          district_id: districtRecord?.id || null,
          city_id: cityRecord?.id || null,
          description: description, // Sử dụng description từ client
          category_id: category[0].id // Có thể cần xem lại logic category cho building
        });
      }
    } else {
      // Nếu không có buildingName, trả về lỗi vì name_bd là NOT NULL
      return res.status(400).json({ message: "Tên tòa nhà (buildingName) là bắt buộc." });
    }

    // B5: Tìm hoặc tạo floor
    let floor = null;
    if (floorName && property) {
      floor = await Floor.findOne({
        where: {
          name: floorName,
          property_id: property.id_property
        }
      });

      if (!floor) {
        floor = await Floor.create({
          id: uuidv4(),
          name: floorName,
          property_id: property.id_property
        });
      }
    }

    // B6: Tạo attributes
    const attributes = await Attribute.create({
      id: uuidv4(),
      price,
      acreage: area,
      hashtag: `#${Math.floor(Math.random() * 90000 + 10000)}`,
      published: new Date().toISOString()
    });

    // B7: Overview
    const overview = await Overview.create({
      id: uuidv4(),
      target: target || "Mọi đối tượng",
      created: new Date().toISOString(),
      expire: duration || "30 ngày",
      bonus: "Tin thường",
      user: creatorId,
      star: 5
    });

    // B8: Check if a similar room already exists to prevent duplicates
    const existingRoom = await Room.findOne({
      where: {
        property_id: property.id_property,
        floor_id: floor?.id || null,
        name: name || "Untitled Room"
      }
    });

    if (existingRoom) {
      return res.status(409).json({
        message: "The listing already exists.",
        exists: true
      });
    }

    // B9: Room
    const room = await Room.create({
      id_room: uuidv4(),
      property_id: property.id_property,
      floor_id: floor?.id || null,
      name: name || "Untitled Room",
      num_tenant: guestCount,
      bedroom_count: bedroomCount,
      bed_count: bedCount,
      bathroom_count: bathroomCount,
      amenities: JSON.stringify(amenities), //  lưu vào DB dạng chuỗi
      description,
      status: "available",
      category_id: category[0].id
    });

    // B10: Image
    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(file =>
          Image.create({
            id: uuidv4(),
            image_url: `/uploads/${file.filename}`,
            room_id: room.id_room
          })
        )
      );
    }

    // B11: Post
    const post = await Post.create({
      id_post: uuidv4(),
      title,
      description: typeof description === 'string' ? description : JSON.stringify(description),
      address: `${streetAddress}, ${district || ''}, ${city || ''}`,
      user_id: creatorId,
      category_id: category[0].id,
      district_id: districtRecord?.id || null,
      attributes_id: attributes.id,
      overview_id: overview.id,
      property_id: property.id_property,
      room_id: room.id_room,
      label_id: label || null,
      star: 5
    });

    // Lấy dữ liệu đầy đủ của bài đăng để trả về
    const postData = await Post.findByPk(post.id_post, {
      include: [
        { model: Attribute },
        { model: Category },
        { model: Overview },
        { model: District, as: 'district', include: [{ model: City, as: 'city' }] },
        { model: User, attributes: ['id_user', 'name'] },
        { model: Room, as: 'room', include: [{ model: Floor, as: 'floor' }, { model: Image, as: 'images' }] },
        { model: Property, as: 'Property', include: [{ model: District, as: 'district', include: [{ model: City, as: 'city' }] }] }
      ]
    });

    // Parse amenities và description
    if (postData.room && postData.room.amenities) {
      try {
        postData.room.amenities = JSON.parse(postData.room.amenities);
      } catch {
        postData.room.amenities = [];
      }
    }
    if (postData.description) {
      try {
        const descObj = JSON.parse(postData.description);
        if (typeof descObj === 'object') {
          postData.description = descObj;
        }
      } catch {
        // Giữ nguyên nếu không phải JSON
      }
    }

    res.status(201).json({
      message: "Post created successfully",
      post: postData  // Trả về postData thay vì post
    });

  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Server error when creating post", error: error.message });
  }
};

// ================================
// API: Lấy danh sách bài đăng
// ================================
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: Attribute },
        { model: Category },
        { model: Overview },
        { model: District, as: 'district', include: [{ model: City, as: 'city' }] },
        { model: User, attributes: ['id_user', 'name'] },
        { model: Room, as: 'room', include: [{ model: Floor, as: 'floor' }, { model: Image, as: 'images' }] },
        { model: Property, as: 'Property', include: [
            { model: District, as: 'district', include: [{ model: City, as: 'city' }] }
          ]
        }
      ]
    });

    // ✅ Parse amenities from JSON string to array
    const parsedPosts = posts.map(post => {
      if (post.room && post.room.amenities) {
        try {
          post.room.amenities = JSON.parse(post.room.amenities);
        } catch {
          post.room.amenities = [];
        }
      }

      // Parse description if it's stored as JSON string
      if (post.description) {
        try {
          const descObj = JSON.parse(post.description);
          if (typeof descObj === 'object') {
            post.description = descObj;
          }
        } catch {
          // If not a valid JSON, keep as is
        }
      }

      return post;
    });

    res.status(200).json({
      message: "Fetched posts successfully",
      posts: parsedPosts
    });

  } catch (error) {
    console.error("Get Posts Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// API: Check if listing exists
// ================================
exports.checkListingExists = async (req, res) => {
  try {
    const { buildingName, floorName, roomName } = req.body;

    // Find building
    const building = await Property.findOne({
      where: { name_bd: buildingName }
    });

    if (!building) {
      return res.status(200).json({ exists: false });
    }

    // Find floor if provided
    let floor = null;
    if (floorName) {
      floor = await Floor.findOne({
        where: {
          name: floorName,
          property_id: building.id_property
        }
      });

      if (!floor) {
        return res.status(200).json({ exists: false });
      }
    }

    // Check if room exists
    const roomExists = await Room.findOne({
      where: {
        property_id: building.id_property,
        floor_id: floor?.id || null,
        name: roomName || "Untitled Room"
      }
    });

    res.status(200).json({
      exists: !!roomExists,
      room: roomExists ? {
        id: roomExists.id_room,
        name: roomExists.name
      } : null
    });

  } catch (error) {
    console.error("Check Listing Error:", error);
    res.status(500).json({ message: "Server error when checking listing" });
  }
};