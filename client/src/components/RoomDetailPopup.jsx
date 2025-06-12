// client/src/components/RoomDetailPopup.jsx
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../styles/RoomDetailPopup.scss";

const RoomDetailPopup = ({
  post,
  onClose,
  onDeleteSubRoom,
  onDeleteListing,
}) => {
  console.log("Post prop in RoomDetailPopup:", post); // NEW: Log entire post prop
  // Redux state
  const user = useSelector((state) => state.user.user);
  console.log("User from Redux in RoomDetailPopup:", user); // Log user object
  const isHost = user?.role === "host";

  // Initialize useNavigate
  const navigate = useNavigate();

  // Component state
  const [selectedSubRoom, setSelectedSubRoom] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [formData, setFormData] = useState({});

  // Derived data
  const roomData = post?.room;
  const listingPhotoPaths =
    post?.room?.images?.map((img) => img.image_url) || [];
  const bookedRooms = post.bookedRooms || [];
  const pendingRooms = post.pendingRooms || [];
  const renters = post.renters || [];
  const pendingRenters = post.pendingRenters || [];

  // Khi chọn phòng, lấy thông tin user chi tiết
  useEffect(() => {
    console.log(
      "useEffect for userDetail triggered. User ID:",
      user?.id_user,
      "Selected SubRoom:",
      selectedSubRoom
    ); // Log trigger
    const fetchUserDetail = async () => {
      if (user?.id_user && user?.role === "renter" && selectedSubRoom) {
        try {
          const res = await fetch(
            `http://localhost:5001/users/public/${user.id_user}`
          );
          if (res.ok) {
            const data = await res.json();
            console.log("Fetched user data:", data); // Log fetched data
            setUserDetail(data);
            setFormData({
              hoTen: data.name || "",
              soDienThoai: data.phone || "",
              cccdSo: data.national_id || "",
              cccdNgayCap: data.date_of_issue
                ? new Date(data.date_of_issue).toLocaleDateString("vi-VN")
                : "",
              cccdNoiCap: data.place_of_issue || "",
            });
            console.log("formData after setting:", formData); // Log formData after setting
          } else {
            console.error("Failed to fetch user detail. Status:", res.status);
          }
        } catch (error) {
          console.error("Error during user detail fetch:", error);
        }
      }
    };
    fetchUserDetail();
  }, [user, selectedSubRoom]);

  // Helper functions
  const parseRoomName = (name) => {
    if (!name) return [];
    name = name.trim();

    if (name.includes("-")) {
      const [start, end] = name.split("-").map((num) => parseInt(num, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        return Array.from({ length: end - start + 1 }, (_, i) =>
          (start + i).toString()
        );
      }
    } else if (name.includes(",")) {
      return name
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (name !== "") {
      return [name];
    }
    return [];
  };

  // roomItems không còn được sử dụng trực tiếp để render RoomList,
  // nhưng vẫn giữ nếu có các chỗ khác sử dụng logic parseRoomName
  const roomItems = parseRoomName(roomData?.name);

  const getRoomStatus = (item) => {
    if (bookedRooms.includes(item)) return "Đã thuê";
    if (pendingRooms.includes(item)) return "Đang chờ";
    return "Chưa thuê";
  };

  const getRenterInfo = (room, status) => {
    if (status === "Đã thuê") {
      return renters.find((r) => r.room === room);
    }
    if (status === "Đang chờ") {
      return pendingRenters.find((r) => r.room === room);
    }
    return null;
  };

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("selectedSubRoom at handleSubmit:", selectedSubRoom); // NEW: Log selectedSubRoom right before validation
    // Kiểm tra các giá trị bắt buộc
    if (!selectedSubRoom?.id) {
      alert("Vui lòng chọn phòng để đăng ký!");
      return;
    }

    if (!user?.id_user) {
      alert("Vui lòng đăng nhập để đăng ký thuê phòng!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        return;
      }

      const contractData = {
        subroom_id: selectedSubRoom.id, // Sử dụng selectedSubRoom.id
        tenant_id: user.id_user,
        start_date: new Date().toISOString(),
        status: "pending",
        gia_thue: post?.Attribute?.price || 0,
      };

      console.log("Dữ liệu gửi đi:", contractData); // Để debug

      const response = await fetch("http://localhost:5001/contracts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contractData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đăng ký thuê phòng thất bại.");
      }

      const result = await response.json();
      alert("Đăng ký thuê phòng thành công! Vui lòng chờ xác nhận từ chủ nhà.");
      onClose();
    } catch (error) {
      console.error("Lỗi đăng ký thuê phòng:", error.message);
      alert(error.message);
    }
  };

  const handleRoomItemClick = (subRoomObject) => {
    setSelectedSubRoom(subRoomObject); // Lưu toàn bộ đối tượng subRoom
  };

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target.className === "popup-overlay") {
        onClose();
      }
    },
    [onClose]
  );

  const handleEditListing = () => {
    onClose();
    navigate(`/edit-listing/${post.id_post}`);
  };

  // Render functions
  const renderImageGallery = () => (
    <div className="image-gallery">
      {listingPhotoPaths.length > 0 ? (
        listingPhotoPaths.map((photo, index) => (
          <img
            key={index}
            src={
              photo.startsWith("http") ? photo : `http://localhost:5001${photo}`
            }
            alt={`photo ${index + 1}`}
          />
        ))
      ) : (
        <img src="/assets/no-image.png" alt="no img" />
      )}
    </div>
  );

  const renderRoomInfo = () => (
    <div className="info-list">
      <p>
        <strong>Địa chỉ:</strong> {post?.address || "Không rõ"}
      </p>
      <p>
        <strong>Dãy:</strong> {post?.property?.name_bd || "Không rõ"}
      </p>
      <p>
        <strong>Tầng:</strong> {post?.room?.floor?.name || "Không rõ"}
      </p>
      <p>
        <strong>Phòng:</strong> {roomData?.name || "Không rõ"}
      </p>
      <p>
        <strong>Loại:</strong> {post?.Category?.value || "Không rõ"}
      </p>
      <p>
        <strong>Giá:</strong>{" "}
        {post?.Attribute?.price ? `${post.Attribute.price} VND` : "Không rõ"}
      </p>
    </div>
  );

  const renderRoomList = () => (
    <div className="room-list">
      {post?.room?.subRooms?.length > 0 ? ( // Lặp qua subRooms trực tiếp
        post.room.subRooms.map((subRoom) => {
          const status = getRoomStatus(subRoom.name); // Sử dụng subRoom.name để lấy trạng thái
          let statusClass = "";
          if (status === "Chưa thuê") statusClass = "available";
          else if (status === "Đang chờ") statusClass = "pending";
          else if (status === "Đã thuê") statusClass = "occupied";
          return (
            <div
              key={subRoom.id} // Sử dụng id làm key
              className={`room-item ${statusClass} ${
                selectedSubRoom?.id === subRoom.id ? "selected" : ""
              }`}
              onClick={() => handleRoomItemClick(subRoom)} // Truyền toàn bộ đối tượng subRoom
            >
              Phòng {subRoom.name} ({status})
            </div>
          );
        })
      ) : (
        <p>Không có thông tin phòng cụ thể hoặc tất cả phòng đã bị xóa.</p>
      )}
    </div>
  );

  const renderRegistrationForm = () => {
    if (isHost) {
      const status = selectedSubRoom
        ? getRoomStatus(selectedSubRoom.name)
        : null; // Lấy trạng thái của selectedSubRoom
      if (!selectedSubRoom || status === "Chưa thuê") {
        return (
          <div style={{ marginTop: 16, color: "green" }}>
            {selectedSubRoom
              ? "Phòng này hiện chưa có người thuê."
              : "Vui lòng chọn phòng để xem thông tin."}
          </div>
        );
      }
      // Đã thuê hoặc Đang chờ: hiện thông tin người thuê
      const renter = getRenterInfo(selectedSubRoom.name, status);
      if (renter) {
        return (
          <div style={{ marginTop: 16 }}>
            <h3>Thông tin người thuê phòng {selectedSubRoom.name}:</h3>
            <div>
              <b>Họ tên:</b> {renter.name}
            </div>
            <div>
              <b>Số điện thoại:</b> {renter.phone}
            </div>
          </div>
        );
      }
      return (
        <div style={{ marginTop: 16, color: "gray" }}>
          Không tìm thấy thông tin người thuê.
        </div>
      );
    }
    // Nếu không phải host (là renter), giữ logic cũ (chỉ cho đăng ký nếu phòng chưa thuê và đã chọn phòng)
    const status = selectedSubRoom ? getRoomStatus(selectedSubRoom.name) : null;
    if (!selectedSubRoom || status !== "Chưa thuê")
      return (
        <div style={{ marginTop: 16, color: "red" }}>
          {selectedSubRoom
            ? `Phòng ${selectedSubRoom.name} đã được ${status.toLowerCase()}.`
            : "Vui lòng chọn phòng để đăng ký!"}
        </div>
      );
    return (
      <div>
        <h3>Đăng ký thuê Phòng {selectedSubRoom.name}</h3>
        <div className="room-detail-popup">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="hoTen">Họ và tên:</label>
              <input
                type="text"
                id="hoTen"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="soDienThoai">Số điện thoại:</label>
              <input
                type="text"
                id="soDienThoai"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cccdSo">CCCD:</label>
              <input
                type="text"
                id="cccdSo"
                name="cccdSo"
                value={formData.cccdSo}
                onChange={handleInputChange}
                placeholder="Số CCCD"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cccdNgayCap">Ngày cấp:</label>
              <input
                type="text"
                id="cccdNgayCap"
                name="cccdNgayCap"
                value={formData.cccdNgayCap}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cccdNoiCap">Nơi cấp:</label>
              <input
                type="text"
                id="cccdNoiCap"
                name="cccdNoiCap"
                value={formData.cccdNoiCap}
                onChange={handleInputChange}
                placeholder="Nơi cấp"
                required
              />
            </div>
            <button type="submit">Đăng ký</button>
          </form>
        </div>
      </div>
    );
  };

  const renderHostActions = () =>
    isHost && (
      <div className="room-actions">
        <button className="btn edit-listing-btn" onClick={handleEditListing}>
          <Edit /> Sửa bài đăng
        </button>
        {selectedSubRoom && (
          <button
            className="btn delete-room-btn"
            onClick={() => onDeleteSubRoom(post.id_post, selectedSubRoom.name)} // Dùng selectedSubRoom.name
          >
            <Delete /> Xóa phòng
          </button>
        )}
        <button
          className="btn delete-listing-btn"
          onClick={() => onDeleteListing(post.id_post)}
        >
          <Delete /> Xóa bài đăng
        </button>
      </div>
    );

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="left-panel">
          <h2>{post?.title || "Chi tiết Phòng"}</h2>
          {renderImageGallery()}
          {renderRoomInfo()}
        </div>

        <div className="right-panel">
          <h2>Các phòng</h2>
          {renderHostActions()}
          {renderRoomList()}
          {renderRegistrationForm()}
        </div>

        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>
    </div>
  );
};

export default RoomDetailPopup;
