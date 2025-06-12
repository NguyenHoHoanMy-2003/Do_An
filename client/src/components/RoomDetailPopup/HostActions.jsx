import React from 'react';
import PropTypes from 'prop-types';
import { Edit, Delete } from '@mui/icons-material';

const HostActions = ({
  isHost,
  selectedRoom,
  postId,
  onEditListing,
  onDeleteRoom,
  onDeleteListing
}) => {
  if (!isHost) return null;

  return (
    <div className="room-actions">
      <button className="btn edit-listing-btn" onClick={onEditListing}>
        <Edit /> Sửa bài đăng
      </button>
      {selectedRoom && (
        <button
          className="btn delete-room-btn"
          onClick={() => onDeleteRoom(postId, selectedRoom)}
        >
          <Delete /> Xóa phòng
        </button>
      )}
      <button
        className="btn delete-listing-btn"
        onClick={() => onDeleteListing(postId)}
      >
        <Delete /> Xóa bài đăng
      </button>
    </div>
  );
};

HostActions.propTypes = {
  isHost: PropTypes.bool.isRequired,
  selectedRoom: PropTypes.string,
  postId: PropTypes.string.isRequired,
  onEditListing: PropTypes.func.isRequired,
  onDeleteRoom: PropTypes.func.isRequired,
  onDeleteListing: PropTypes.func.isRequired
};

export default HostActions; 