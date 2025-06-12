// client/src/components/RoomDetailPopup.jsx
import React, { useState, useEffect, useCallback } from "react";
import "../styles/RoomDetailPopup.scss";
import { useSelector } from "react-redux";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { LoadingSpinner, ErrorMessage, SuccessMessage, ConfirmationDialog } from "./common";
import { useRoomDetail } from "../hooks/useRoomDetail";

// Component con: ImageGallery
export const ImageGallery = ({ images }) => (
  <div className="image-gallery">
    {images.length > 0 ? (
      images.map((photo, index) => (
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

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired
};

// Component con: RoomInfo
export const RoomInfo = ({ post, roomData }) => (
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

RoomInfo.propTypes = {
  post: PropTypes.shape({
    address: PropTypes.string,
    property: PropTypes.shape({
      name_bd: PropTypes.string
    }),
    room: PropTypes.shape({
      floor: PropTypes.shape({
        name: PropTypes.string
      })
    }),
    Category: PropTypes.shape({
      value: PropTypes.string
    }),
    Attribute: PropTypes.shape({
      price: PropTypes.number
    })
  }).isRequired,
  roomData: PropTypes.shape({
    name: PropTypes.string
  })
};

// Component con: RoomList
export const RoomList = ({ roomItems, getRoomStatus, onRoomClick }) => (
  <div className="room-list">
    {roomItems.length > 0 ? (
      roomItems.map((item) => {
        const status = getRoomStatus(item);
        let statusClass = '';
        if (status === 'Chưa thuê') statusClass = 'available';
        else if (status === 'Đang chờ') statusClass = 'pending';
        else if (status === 'Đã thuê') statusClass = 'occupied';
        return (
          <div
            key={item}
            className={`room-item ${statusClass}`}
            onClick={() => onRoomClick(item)}
          >
            Phòng {item} ({status})
          </div>
        );
      })
    ) : (
      <p>Không có thông tin phòng cụ thể hoặc tất cả phòng đã bị xóa.</p>
    )}
  </div>
);

RoomList.propTypes = {
  roomItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  getRoomStatus: PropTypes.func.isRequired,
  onRoomClick: PropTypes.func.isRequired
};

// Component con: RegistrationForm
export const RegistrationForm = ({ 
  isHost, 
  selectedSubRoom, 
  getRoomStatus, 
  getRenterInfo, 
  formData, 
  onInputChange, 
  onSubmit 
}) => {
  if (isHost && selectedSubRoom) {
    const status = getRoomStatus(selectedSubRoom);
    if (status === 'Chưa thuê') {
      return <div style={{marginTop: 16, color: 'green'}}>Phòng này hiện chưa có người thuê.</div>;
    }
    const renter = getRenterInfo(selectedSubRoom, status);
    if (renter) {
      return (
        <div style={{marginTop: 16}}>
          <h3>Thông tin người thuê phòng {selectedSubRoom}:</h3>
          <div><b>Họ tên:</b> {renter.name}</div>
          <div><b>Số điện thoại:</b> {renter.phone}</div>
        </div>
      );
    }
    return <div style={{marginTop: 16, color: 'gray'}}>Không tìm thấy thông tin người thuê.</div>;
  }

  const status = selectedSubRoom ? getRoomStatus(selectedSubRoom) : null;
  if (!selectedSubRoom || status !== 'Chưa thuê') return null;

  return (
    <div>
      <h3>Đăng ký thuê Phòng {selectedSubRoom}</h3>
      <div className="room-detail-popup">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="hoTen">Họ và tên:</label>
            <input
              type="text"
              id="hoTen"
              name="hoTen"
              value={formData.hoTen}
              onChange={onInputChange}
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="soDienThoai">Số điện thoại:</label>
            <input
              type="text"
              id="soDienThoai"
              name="soDienThoai"
              value={formData.soDienThoai}
              onChange={onInputChange}
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="cccdSo">CCCD:</label>
            <input
              type="text"
              id="cccdSo"
              name="cccdSo"
              value={formData.cccdSo}
              onChange={onInputChange}
              placeholder="Số CCCD"
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="cccdNgayCap">Ngày cấp:</label>
            <input
              type="text"
              id="cccdNgayCap"
              name="cccdNgayCap"
              value={formData.cccdNgayCap}
              onChange={onInputChange}
              placeholder="dd/mm/yyyy"
              required
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="cccdNoiCap">Nơi cấp:</label>
            <input
              type="text"
              id="cccdNoiCap"
              name="cccdNoiCap"
              value={formData.cccdNoiCap}
              onChange={onInputChange}
              placeholder="Nơi cấp"
              required
              readOnly
            />
          </div>
          <button type="submit">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

RegistrationForm.propTypes = {
  isHost: PropTypes.bool.isRequired,
  selectedSubRoom: PropTypes.string,
  getRoomStatus: PropTypes.func.isRequired,
  getRenterInfo: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    hoTen: PropTypes.string.isRequired,
    soDienThoai: PropTypes.string.isRequired,
    cccdSo: PropTypes.string.isRequired,
    cccdNgayCap: PropTypes.string.isRequired,
    cccdNoiCap: PropTypes.string.isRequired
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

// Component con: HostActions
export const HostActions = ({ 
  onEditListing, 
  selectedSubRoom, 
  onDeleteRoomClick, 
  onDeleteListingClick 
}) => (
  <div className="room-actions">
    <button className="btn edit-listing-btn" onClick={onEditListing}>
      <Edit /> Sửa bài đăng
    </button>
    {selectedSubRoom && (
      <button
        className="btn delete-room-btn"
        onClick={onDeleteRoomClick}
      >
        <Delete /> Xóa phòng
      </button>
    )}
    <button
      className="btn delete-listing-btn"
      onClick={onDeleteListingClick}
    >
      <Delete /> Xóa bài đăng
    </button>
  </div>
);

HostActions.propTypes = {
  onEditListing: PropTypes.func.isRequired,
  selectedSubRoom: PropTypes.string,
  onDeleteRoomClick: PropTypes.func.isRequired,
  onDeleteListingClick: PropTypes.func.isRequired
};

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

  // Custom hook
  const {
    selectedSubRoom,
    formData,
    loading,
    error,
    success,
    showDeleteRoomDialog,
    showDeleteListingDialog,
    roomData,
    listingPhotoPaths,
    parseRoomName,
    getRoomStatus,
    getRenterInfo,
    handleInputChange,
    handleSubmit,
    handleRoomItemClick,
    handleDeleteRoom,
    handleDeleteListing,
    setError,
    setSuccess,
    setShowDeleteRoomDialog,
    setShowDeleteListingDialog,
  } = useRoomDetail(post, onClose, onDeleteSubRoom, onDeleteListing);

  // Event handlers
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target.className === "popup-overlay") {
        onClose();
      }
    },
    [onClose]
  );

  const handleEditListing = useCallback(() => {
    onClose();
    navigate(`/edit-listing/${post.id_post}`);
  }, [post.id_post, onClose, navigate]);

  const roomItems = parseRoomName(roomData?.name);

  return (
    <div className="popup-overlay" onClick={handleOverlayClick} data-testid="popup-overlay">
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}

        <div className="left-panel">
          <h2>{post?.title || "Chi tiết Phòng"}</h2>
          <ImageGallery images={listingPhotoPaths} />
          <RoomInfo post={post} roomData={roomData} />
        </div>

        <div className="right-panel">
          <h2>Các phòng</h2>
          {isHost && (
            <HostActions
              onEditListing={handleEditListing}
              selectedSubRoom={selectedSubRoom}
              onDeleteRoomClick={() => {
                console.log("Attempting to show delete room dialog for room:", selectedSubRoom);
                setShowDeleteRoomDialog(true);
              }}
              onDeleteListingClick={() => setShowDeleteListingDialog(true)}
            />
          )}
          <RoomList
            roomItems={roomItems}
            getRoomStatus={getRoomStatus}
            onRoomClick={handleRoomItemClick}
          />
          <RegistrationForm
            isHost={isHost}
            selectedSubRoom={selectedSubRoom}
            getRoomStatus={getRoomStatus}
            getRenterInfo={getRenterInfo}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>

        <button onClick={onClose} className="close-button">
          ×
        </button>

        <ConfirmationDialog
          isOpen={showDeleteRoomDialog}
          title="Xác nhận xóa phòng"
          message={`Bạn có chắc chắn muốn xóa phòng ${selectedSubRoom?.name}?`}
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={handleDeleteRoom}
          onCancel={() => setShowDeleteRoomDialog(false)}
          type="danger"
        />

        <ConfirmationDialog
          isOpen={showDeleteListingDialog}
          title="Xác nhận xóa bài đăng"
          message="Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={handleDeleteListing}
          onCancel={() => setShowDeleteListingDialog(false)}
          type="danger"
        />
      </div>
    </div>
  );
};

RoomDetailPopup.propTypes = {
  post: PropTypes.shape({
    id_post: PropTypes.string.isRequired,
    title: PropTypes.string,
    address: PropTypes.string,
    property: PropTypes.shape({
      name_bd: PropTypes.string
    }),
    room: PropTypes.shape({
      name: PropTypes.string,
      floor: PropTypes.shape({
        name: PropTypes.string
      }),
      images: PropTypes.arrayOf(PropTypes.shape({
        image_url: PropTypes.string
      })),
      subRooms: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        status: PropTypes.string,
      })),
    }),
    Category: PropTypes.shape({
      value: PropTypes.string
    }),
    Attribute: PropTypes.shape({
      price: PropTypes.number
    }),
    bookedRooms: PropTypes.arrayOf(PropTypes.string),
    pendingRooms: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDeleteSubRoom: PropTypes.func.isRequired,
  onDeleteListing: PropTypes.func.isRequired,
};

export default RoomDetailPopup;