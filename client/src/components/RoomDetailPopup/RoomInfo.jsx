import React from 'react';
import PropTypes from 'prop-types';

const RoomInfo = ({ post }) => {
  return (
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
        <strong>Phòng:</strong> {post?.room?.name || "Không rõ"}
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
};

RoomInfo.propTypes = {
  post: PropTypes.shape({
    address: PropTypes.string,
    property: PropTypes.shape({
      name_bd: PropTypes.string
    }),
    room: PropTypes.shape({
      floor: PropTypes.shape({
        name: PropTypes.string
      }),
      name: PropTypes.string
    }),
    Category: PropTypes.shape({
      value: PropTypes.string
    }),
    Attribute: PropTypes.shape({
      price: PropTypes.number
    })
  }).isRequired
};

export default RoomInfo; 