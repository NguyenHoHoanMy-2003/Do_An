import React from 'react';
import PropTypes from 'prop-types';

const RoomList = ({ 
  roomItems, 
  bookedRooms, 
  pendingRooms, 
  onRoomSelect 
}) => {
  const getRoomStatus = (item) => {
    if (bookedRooms.includes(item)) return 'Đã thuê';
    if (pendingRooms.includes(item)) return 'Đang chờ';
    return 'Chưa thuê';
  };

  return (
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
              onClick={() => onRoomSelect(item)}
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
};

RoomList.propTypes = {
  roomItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  bookedRooms: PropTypes.arrayOf(PropTypes.string).isRequired,
  pendingRooms: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRoomSelect: PropTypes.func.isRequired
};

export default RoomList; 