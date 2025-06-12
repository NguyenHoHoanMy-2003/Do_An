import React from 'react';
import PropTypes from 'prop-types';

const RoomImageGallery = ({ images }) => {
  return (
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
};

RoomImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default RoomImageGallery; 