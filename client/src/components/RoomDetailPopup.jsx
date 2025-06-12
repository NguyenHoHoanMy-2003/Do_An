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
  // Redux state
  const user = useSelector((state) => state.user.user);
  const isHost = user?.role === "host";

  // Initialize useNavigate
  const navigate = useNavigate();

  // Component state
  const [selectedSubRoom, setSelectedSubRoom] = useState(null);
  const [formData, setFormData] = useState({
    hoTen: "",
    soDienThoai: "",
    cccdSo: "",
    cccdNgayCap: "",
    cccdNoiCap: "",
  });

  // Derived data
  const roomData = post?.room;
  const listingPhotoPaths = post?.room?.images?.map((img) => img.image_url) || [];

  // Temporary simulation state for room statuses
  const [simulatedRoomStatuses, setSimulatedRoomStatuses] = useState({});

  // Initialize simulated room statuses
  useEffect(() => {
    const initialStatuses = {};
    const roomItems = parseRoomName(roomData?.name);
    
    if (roomItems.length > 0) {
      initialStatuses[roomItems[0]] = "occupied";
      if (roomItems.length > 2) {
        initialStatuses[roomItems[2]] = "occupied";
      }
    }
    setSimulatedRoomStatuses(initialStatuses);
  }, [roomData?.name]);

  // Helper functions
  const parseRoomName = (name) => {
    if (!name) return [];
    name = name.trim();
    
    if (name.includes("-")) {
      const [start, end] = name.split("-").map(num => parseInt(num, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());
      }
    } else if (name.includes(",")) {
      return name.split(",").map(item => item.trim()).filter(Boolean);
    } else if (name !== "") {
      return [name];
    }
    return [];
  };

  const roomItems = parseRoomName(roomData?.name);

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted for room:", selectedSubRoom, formData);
  };

  const handleRoomItemClick = (roomNumber) => {
    if (simulatedRoomStatuses[roomNumber] === "available" || !simulatedRoomStatuses[roomNumber]) {
      setSelectedSubRoom(roomNumber);
      setFormData({
        hoTen: "",
        soDienThoai: "",
        cccdSo: "",
        cccdNgayCap: "",
        cccdNoiCap: "",
      });
    } else {
      setSelectedSubRoom(null);
    }
  };

  const handleOverlayClick = useCallback((e) => {
    if (e.target.className === "popup-overlay") {
      onClose();
    }
  }, [onClose]);

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
            src={photo.startsWith("http") ? photo : `http://localhost:5001${photo}`}
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
      <p><strong>Địa chỉ:</strong> {post?.address || "Không rõ"}</p>
      <p><strong>Dãy:</strong> {post?.Property?.name_bd || "Không rõ"}</p>
      <p><strong>Tầng:</strong> {post?.room?.floor?.name || "Không rõ"}</p>
      <p><strong>Phòng:</strong> {roomData?.name || "Không rõ"}</p>
      <p><strong>Loại:</strong> {post?.Category?.value || "Không rõ"}</p>
      <p><strong>Giá:</strong> {post?.Attribute?.price ? `${post.Attribute.price} VND` : "Không rõ"}</p>
    </div>
  );

  const renderHostActions = () => (
    isHost && (
      <div className="room-actions">
        <button className="btn edit-listing-btn" onClick={handleEditListing}>
          <Edit /> Sửa bài đăng
        </button>
        {selectedSubRoom && (
          <button className="btn delete-room-btn" onClick={() => onDeleteSubRoom(post.id_post, selectedSubRoom)}>
            <Delete /> Xóa phòng
          </button>
        )}
        <button className="btn delete-listing-btn" onClick={() => onDeleteListing(post.id_post)}>
          <Delete /> Xóa bài đăng
        </button>
      </div>
    )
  );

  const renderRoomList = () => (
    <div className="room-list">
      {roomItems.length > 0 ? (
        roomItems.map((item) => {
          const isRoomOccupied = simulatedRoomStatuses[item] === "occupied";
          const roomStatusText = isRoomOccupied ? "Đã thuê" : "Chưa thuê";
          const roomStatusClass = isRoomOccupied ? "occupied" : "available";

          return (
            <div
              key={item}
              className={`room-item ${roomStatusClass}`}
              onClick={() => handleRoomItemClick(item)}
            >
              Phòng {item} ({roomStatusText})
            </div>
          );
        })
      ) : (
        <p>Không có thông tin phòng cụ thể hoặc tất cả phòng đã bị xóa.</p>
      )}
    </div>
  );

  const renderRegistrationForm = () => (
    selectedSubRoom &&
    (simulatedRoomStatuses[selectedSubRoom] === "available" || !simulatedRoomStatuses[selectedSubRoom]) && (
      <div>
        <h3>Đăng ký thuê Phòng {selectedSubRoom}</h3>
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
    )
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
          {renderHostActions()}
          <h2>Các phòng</h2>
          {renderRoomList()}
          {renderRegistrationForm()}
          
          {roomItems.every((item) => simulatedRoomStatuses[item] === "occupied") && (
            <p style={{ color: "red" }}>Tất cả các phòng trong listing này đã được thuê.</p>
          )}
        </div>

        <button onClick={onClose} className="close-button">×</button>
      </div>
    </div>
  );
};

export default RoomDetailPopup;
