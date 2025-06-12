import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RoomImageGallery from './RoomImageGallery';
import RoomInfo from './RoomInfo';
import RoomList from './RoomList';
import RegistrationForm from './RegistrationForm';
import HostActions from './HostActions';
import '../styles/RoomDetailPopup.scss';
import { useRoomDetail } from '../../hooks/useRoomDetail';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import SuccessMessage from '../SuccessMessage';
import ConfirmationDialog from '../ConfirmationDialog';

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
          <RoomImageGallery images={listingPhotoPaths} />
          <RoomInfo post={post} roomData={roomData} />
        </div>

        <div className="right-panel">
          <h2>Các phòng</h2>
          {isHost && (
            <HostActions
              onEditListing={handleEditListing}
              selectedSubRoom={selectedSubRoom}
              onDeleteRoomClick={() => setShowDeleteRoomDialog(true)}
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
          message={`Bạn có chắc chắn muốn xóa phòng ${selectedSubRoom}?`}
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
    id_post: PropTypes.number.isRequired,
    title: PropTypes.string,
    address: PropTypes.string,
    property: PropTypes.shape({
      name_bd: PropTypes.string
    }),
    room: PropTypes.shape({
      name: PropTypes.string,
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
  onClose: PropTypes.func.isRequired,
  onDeleteSubRoom: PropTypes.func,
  onDeleteListing: PropTypes.func,
};

export default RoomDetailPopup; 