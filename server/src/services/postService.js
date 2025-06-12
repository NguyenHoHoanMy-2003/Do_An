'use strict';
const {
  Post, Attribute, Category, Label, Overview,
  District, User, Property, Room, Image, Floor, City, SubRoom
} = require("../models");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../models");

// Hàm tách tên phòng thành danh sách các phòng con
const parseRoomName = (name) => {
  if (!name) return [];
  name = name.trim();
  if (name.includes('-')) {
    const [start, end] = name.split('-').map(Number);
    if (!isNaN(start) && !isNaN(end) && start <= end) {
      return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());
    }
  } else if (name.includes(',')) {
    return name.split(',').map(item => item.trim()).filter(item => item);
  } else if (name !== '') {
    return [name];
  }
  return [];
};

class PostService {
  // Tạo bài đăng mới
  async createPost(data, files) {
    const {
      creatorId,
      type,
      buildingName,
      floorName,
      streetAddress,
      city,
      district,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      price,
      area,
      duration,
      target,
      label,
      name
    } = data;

    // Kiểm tra quyền của người dùng
    const user = await User.findByPk(creatorId);
    if (!user || user.role !== 'host') {
      throw new Error('Chỉ người dùng có vai trò host mới được phép tạo bài đăng.');
    }

    // Tạo category
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

    // Tìm hoặc tạo city
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

    // Tìm hoặc tạo district
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

    // Tìm hoặc tạo building (property)
    let property = null;
    if (buildingName) {
      property = await Property.findOne({
        where: { name_bd: buildingName }
      });

      if (!property) {
        property = await Property.create({
          id_property: uuidv4(),
          name_bd: buildingName,
          host_id: creatorId,
          street_address: streetAddress,
          district_id: districtRecord?.id || null,
          city_id: cityRecord?.id || null,
          description: description,
          category_id: category[0].id
        });
      }
    } else {
      property = await Property.create({
        id_property: uuidv4(),
        host_id: creatorId,
        street_address: streetAddress,
        district_id: districtRecord?.id || null,
        city_id: cityRecord?.id || null,
        description: title,
        category_id: category[0].id
      });
    }

    // Tìm hoặc tạo floor
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

    // Tạo attributes
    const attributes = await Attribute.create({
      id: uuidv4(),
      price,
      acreage: area,
      hashtag: `#${Math.floor(Math.random() * 90000 + 10000)}`,
      published: new Date().toISOString()
    });

    // Tạo overview
    const overview = await Overview.create({
      id: uuidv4(),
      target: target || "Mọi đối tượng",
      created: new Date().toISOString(),
      expire: duration || "30 ngày",
      bonus: "Tin thường",
      user: creatorId,
      star: 5
    });

    // Kiểm tra phòng đã tồn tại
    const existingRoom = await Room.findOne({
      where: {
        property_id: property.id_property,
        floor_id: floor?.id || null,
        name: name || "Untitled Room"
      }
    });

    if (existingRoom) {
      throw new Error("The listing already exists.");
    }

    // Tạo room
    const room = await Room.create({
      id_room: uuidv4(),
      property_id: property.id_property,
      floor_id: floor?.id || null,
      name: name || "Untitled Room",
      num_tenant: guestCount,
      bedroom_count: bedroomCount,
      bed_count: bedCount,
      bathroom_count: bathroomCount,
      amenities: JSON.stringify(amenities),
      description,
      category_id: category[0].id
    });

    // Tạo các phòng con
    const subRoomNames = parseRoomName(name);
    if (subRoomNames.length > 0) {
      await Promise.all(
        subRoomNames.map(subRoomName =>
          SubRoom.create({
            id: uuidv4(),
            room_id: room.id_room,
            name: subRoomName,
            status: 'available',
            created_at: new Date(),
            updated_at: new Date()
          })
        )
      );
    }

    // Tạo images
    if (files && files.length > 0) {
      await Promise.all(
        files.map(file =>
          Image.create({
            id: uuidv4(),
            image_url: `/uploads/${file.filename}`,
            room_id: room.id_room
          })
        )
      );
    }

    // Tạo post
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

    // Lấy dữ liệu đầy đủ của bài đăng
    const postData = await Post.findByPk(post.id_post, {
      include: [
        { model: Attribute },
        { model: Category },
        { model: Overview },
        { model: District, as: 'district', include: [{ model: City, as: 'city' }] },
        { model: User, attributes: ['id_user', 'name'] },
        { 
          model: Room, 
          as: 'room',
          include: [
            { model: Floor, as: 'floor' }, 
            { model: Image, as: 'images' },
            { model: SubRoom, as: 'subRooms' }
          ]
        },
        { 
          model: Property,
          as: 'property', 
          include: [{ model: District, as: 'district', include: [{ model: City, as: 'city' }] }]
        }
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

    return postData;
  }

  // Lấy danh sách bài đăng
  async getPosts() {
    const posts = await Post.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: Attribute },
        { model: Category },
        { model: Overview },
        { model: District, as: 'district', include: [{ model: City, as: 'city' }] },
        { model: User, attributes: ['id_user', 'name'] },
        { 
          model: Room, 
          as: 'room',
          include: [
            { model: Floor, as: 'floor' },
            { model: Image, as: 'images' },
            { 
              model: SubRoom, 
              as: 'subRooms',
              include: [
                { model: User, as: 'renter', attributes: ['id_user', 'name', 'phone', 'national_id', 'date_of_issue', 'place_of_issue'] }
              ]
            }
          ]
        },
        {
          model: Property,
          as: 'property', 
          include: [
            {
              model: District,
              as: 'district',
              include: [{ model: City, as: 'city' }]
            }
          ]
        },
      ]
    });

    // Parse amenities và description, thêm thông tin trạng thái phòng và người thuê
    return posts.map(post => {
      if (post.room && post.room.amenities) {
        try {
          post.room.amenities = JSON.parse(post.room.amenities);
        } catch {
          post.room.amenities = [];
        }
      }

      if (post.description) {
        try {
          const descObj = JSON.parse(post.description);
          if (typeof descObj === 'object') {
            post.description = descObj;
          }
        } catch {
          // Giữ nguyên nếu không phải JSON
        }
      }

      // Thêm thông tin trạng thái phòng và người thuê
      if (post.room && post.room.subRooms) {
        const bookedRooms = [];
        const pendingRooms = [];
        const rentersInfo = []; // To store full renter info for sub-rooms
        const pendingRentersInfo = []; // To store full pending renter info for sub-rooms
        
        post.room.subRooms.forEach(subRoom => {
          if (subRoom.status === 'booked') {
            bookedRooms.push(subRoom.name);
            if (subRoom.renter) {
              rentersInfo.push({ room: subRoom.name, ...subRoom.renter.toJSON() });
            }
          } else if (subRoom.status === 'pending') {
            pendingRooms.push(subRoom.name);
            if (subRoom.renter) {
              pendingRentersInfo.push({ room: subRoom.name, ...subRoom.renter.toJSON() });
            }
          }
        });

        post.bookedRooms = bookedRooms;
        post.pendingRooms = pendingRooms;
        post.rentersInfo = rentersInfo; // Attach to post object
        post.pendingRentersInfo = pendingRentersInfo; // Attach to post object
      }

      return post;
    });
  }

  // Kiểm tra bài đăng đã tồn tại
  async checkListingExists(buildingName, floorName, roomName) {
    // Tìm building
    const building = await Property.findOne({
      where: { name_bd: buildingName }
    });

    if (!building) {
      return { exists: false };
    }

    // Tìm floor nếu có
    let floor = null;
    if (floorName) {
      floor = await Floor.findOne({
        where: {
          name: floorName,
          property_id: building.id_property
        }
      });

      if (!floor) {
        return { exists: false };
      }
    }

    // Kiểm tra room
    const room = await Room.findOne({
      where: {
        property_id: building.id_property,
        floor_id: floor?.id || null,
        name: roomName || "Untitled Room"
      },
      include: [{ model: SubRoom, as: 'subRooms' }]
    });

    return {
      exists: !!room,
      room: room ? {
        id: room.id_room,
        name: room.name,
        subRooms: room.subRooms
      } : null
    };
  }

  // Cập nhật bài đăng
  async updatePost(postId, data, files) {
    const {
      creatorId,
      type,
      buildingName,
      floorName,
      streetAddress,
      city,
      district,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      price,
      area,
      duration,
      target,
      label,
      name
    } = data;

    // Tìm bài đăng cần cập nhật
    const post = await Post.findByPk(postId, {
      include: [
        { model: Attribute },
        { model: Category },
        { model: Overview },
        { model: District, as: 'district' },
        { 
          model: Room, 
          as: 'room',
          include: [
            { model: Floor, as: 'floor' },
            { model: Image, as: 'images' },
            { model: SubRoom, as: 'subRooms' }
          ]
        },
        { 
          model: Property,
          as: 'property'
        }
      ]
    });

    if (!post) {
      throw new Error('Bài đăng không tồn tại.');
    }

    // Kiểm tra quyền sở hữu bài đăng
    if (post.user_id !== creatorId) {
      throw new Error('Bạn không có quyền cập nhật bài đăng này.');
    }

    // Cập nhật category nếu có thay đổi
    if (type && type !== post.category.value) {
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
      post.category_id = category[0].id;
    }

    // Cập nhật city và district nếu có thay đổi
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

    // Cập nhật property
    if (buildingName || streetAddress || city || district) {
      const property = await Property.findByPk(post.property_id);
      if (property) {
        await property.update({
          name_bd: buildingName || property.name_bd,
          street_address: streetAddress || property.street_address,
          district_id: districtRecord?.id || property.district_id,
          city_id: cityRecord?.id || property.city_id,
          description: description || property.description,
          category_id: post.category_id
        });
      }
    }

    // Cập nhật floor
    if (floorName) {
      const floor = await Floor.findOne({
        where: {
          name: floorName,
          property_id: post.property_id
        }
      });

      if (!floor) {
        const newFloor = await Floor.create({
          id: uuidv4(),
          name: floorName,
          property_id: post.property_id
        });
        post.room.floor_id = newFloor.id;
      } else {
        post.room.floor_id = floor.id;
      }
    }

    // Cập nhật attributes
    if (price || area) {
      await post.attribute.update({
        price: price || post.attribute.price,
        acreage: area || post.attribute.acreage
      });
    }

    // Cập nhật overview
    if (target || duration) {
      await post.overview.update({
        target: target || post.overview.target,
        expire: duration || post.overview.expire
      });
    }

    // Cập nhật room
    if (guestCount || bedroomCount || bedCount || bathroomCount || amenities || name) {
      await post.room.update({
        name: name || post.room.name,
        num_tenant: guestCount || post.room.num_tenant,
        bedroom_count: bedroomCount || post.room.bedroom_count,
        bed_count: bedCount || post.room.bed_count,
        bathroom_count: bathroomCount || post.room.bathroom_count,
        amenities: amenities ? JSON.stringify(amenities) : post.room.amenities,
        description: description || post.room.description
      });

      // Cập nhật subRooms nếu tên phòng thay đổi
      if (name && name !== post.room.name) {
        // Xóa các subRooms cũ
        await SubRoom.destroy({
          where: { room_id: post.room.id_room }
        });

        // Tạo các subRooms mới
        const subRoomNames = parseRoomName(name);
        if (subRoomNames.length > 0) {
          await Promise.all(
            subRoomNames.map(subRoomName =>
              SubRoom.create({
                id: uuidv4(),
                room_id: post.room.id_room,
                name: subRoomName,
                status: 'available',
                created_at: new Date(),
                updated_at: new Date()
              })
            )
          );
        }
      }
    }

    // Thêm ảnh mới nếu có
    if (files && files.length > 0) {
      await Promise.all(
        files.map(file =>
          Image.create({
            id: uuidv4(),
            image_url: `/uploads/${file.filename}`,
            room_id: post.room.id_room
          })
        )
      );
    }

    // Cập nhật post
    await post.update({
      title: title || post.title,
      description: description ? (typeof description === 'string' ? description : JSON.stringify(description)) : post.description,
      address: `${streetAddress || post.property.street_address}, ${district || ''}, ${city || ''}`,
      category_id: post.category_id,
      district_id: districtRecord?.id || post.district_id,
      label_id: label || post.label_id
    });

    // Lấy dữ liệu đầy đủ của bài đăng sau khi cập nhật
    const updatedPost = await Post.findByPk(postId, {
      include: [
        { model: Attribute },
        { model: Category },
        { model: Overview },
        { model: District, as: 'district', include: [{ model: City, as: 'city' }] },
        { model: User, attributes: ['id_user', 'name'] },
        { 
          model: Room, 
          as: 'room',
          include: [
            { model: Floor, as: 'floor' }, 
            { model: Image, as: 'images' },
            { model: SubRoom, as: 'subRooms' }
          ]
        },
        { 
          model: Property,
          as: 'property', 
          include: [{ model: District, as: 'district', include: [{ model: City, as: 'city' }] }]
        }
      ]
    });

    // Parse amenities và description
    if (updatedPost.room && updatedPost.room.amenities) {
      try {
        updatedPost.room.amenities = JSON.parse(updatedPost.room.amenities);
      } catch {
        updatedPost.room.amenities = [];
      }
    }
    if (updatedPost.description) {
      try {
        const descObj = JSON.parse(updatedPost.description);
        if (typeof descObj === 'object') {
          updatedPost.description = descObj;
        }
      } catch {
        // Giữ nguyên nếu không phải JSON
      }
    }

    return updatedPost;
  }

  // Xóa bài đăng
  async deletePost(postId, userId) {
    console.log("postService.deletePost called - postId:", postId, "userId:", userId);
    const transaction = await sequelize.transaction();
    try {
      const post = await Post.findByPk(postId, {
        include: [{
          model: Room,
          as: 'room',
          include: [
            {
              model: SubRoom,
              as: 'subRooms'
            },
            {
              model: Image,
              as: 'images'
            }
          ]
        }, {
          model: Property,
          as: 'property',
          attributes: ['host_id']
        }],
        transaction
      });

      console.log("Found post:", post ? "Yes" : "No");
      if (!post) {
        throw new Error('Bài đăng không tồn tại.');
      }

      console.log("Checking permissions - post.property.host_id:", post.property.host_id, "userId:", userId);
      // Kiểm tra quyền sở hữu bài đăng
      if (post.property.host_id !== userId) {
        throw new Error('Bạn không có quyền xóa bài đăng này.');
      }

      // Xóa các phòng con
      if (post.room && post.room.subRooms) {
        console.log("Deleting subRooms...");
        await SubRoom.destroy({
          where: { room_id: post.room.id_room },
          transaction
        });
        console.log("SubRooms deleted successfully");
      }

      // Xóa các hình ảnh
      if (post.room && post.room.images) {
        console.log("Deleting images...");
        await Image.destroy({
          where: { room_id: post.room.id_room },
          transaction
        });
        console.log("Images deleted successfully");
      }

      // Xóa phòng chính
      if (post.room) {
        console.log("Deleting main room...");
        await post.room.destroy({ transaction });
        console.log("Main room deleted successfully");
      }

      // Xóa bài đăng
      console.log("Deleting post...");
      await post.destroy({ transaction });
      console.log("Post deleted successfully");

      await transaction.commit();
      console.log("Transaction committed successfully");
      return { message: 'Bài đăng đã được xóa thành công.' };
    } catch (error) {
      console.error("Error in deletePost:", error);
      await transaction.rollback();
      throw error;
    }
  }

  // Xóa một phòng con trong bài đăng
  async deleteSubRoom(postId, roomNumber, userId) {
    const transaction = await sequelize.transaction();
    try {
      const post = await Post.findByPk(postId, {
        include: [{
          model: Room,
          as: 'room',
          include: [{
            model: SubRoom,
            as: 'subRooms'
          }]
        }, {
          model: Property,
          as: 'property',
          attributes: ['host_id']
        }]
      });

      if (!post) {
        throw new Error("Bài đăng không tồn tại.");
      }

      // Check if user is the host of the property
      if (post.property.host_id !== userId) {
        throw new Error("Bạn không có quyền xóa phòng này.");
      }

      const room = post.room;
      if (!room) {
        throw new Error("Phòng chính không tồn tại trong bài đăng.");
      }

      const subRoomToDelete = room.subRooms.find(sub => sub.name === roomNumber);

      if (!subRoomToDelete) {
        console.log(`SubRoom to delete with name ${roomNumber} not found for Room ID ${room.id_room}`);
        throw new Error("Phòng con không tồn tại.");
      }

      console.log(`Attempting to delete SubRoom: ${subRoomToDelete.id} (name: ${subRoomToDelete.name})`);
      // Delete the sub-room
      await subRoomToDelete.destroy({ transaction });
      console.log(`SubRoom ${subRoomToDelete.id} deleted successfully.`);

      // Update room.name by removing the deleted roomNumber
      let roomNames = parseRoomName(room.name);
      roomNames = roomNames.filter(name => name !== roomNumber);
      room.name = roomNames.join(',');
      await room.save({ transaction });

      // Update bookedRooms and pendingRooms in the Post
      let bookedRooms = post.bookedRooms ? JSON.parse(post.bookedRooms) : [];
      bookedRooms = bookedRooms.filter(name => name !== roomNumber);
      post.bookedRooms = JSON.stringify(bookedRooms);

      let pendingRooms = post.pendingRooms ? JSON.parse(post.pendingRooms) : [];
      pendingRooms = pendingRooms.filter(name => name !== roomNumber);
      post.pendingRooms = JSON.stringify(pendingRooms);
      
      await post.save({ transaction });

      // If no sub-rooms left, delete the main room and potentially the post
      const remainingSubRooms = await SubRoom.count({
        where: { room_id: room.id_room },
        transaction
      });

      if (remainingSubRooms === 0) {
        await room.destroy({ transaction });
        await post.destroy({ transaction }); // Delete the post if no sub-rooms remain
      }

      await transaction.commit();
      return { message: "Phòng con đã được xóa thành công." };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new PostService(); 