import React from 'react';

const LocationSection = ({ formData, handleLocationChange, errors, isViewMode }) => {
  return (
    <>
      <div className="full">
        <div className="location">
          <p>Street Address</p>
          <input
            type="text"
            placeholder="Street Address"
            name="streetAddress"
            value={formData.location.streetAddress}
            onChange={handleLocationChange}
            required
            disabled={isViewMode}
          />
          {errors.streetAddress && <div className="error-message">{errors.streetAddress}</div>}
        </div>
      </div>
      
      <div className="full">
        <div className="location">
          <p>City</p>
          <input
            type="text"
            placeholder="City"
            name="city"
            value={formData.location.city}
            onChange={handleLocationChange}
            required
            disabled={isViewMode}
          />
          {errors.city && <div className="error-message">{errors.city}</div>}
        </div>
      </div>
      
      <div className="full">
        <div className="location">
          <p>District</p>
          <input
            type="text"
            placeholder="District"
            name="district"
            value={formData.location.district}
            onChange={handleLocationChange}
            required
            disabled={isViewMode}
          />
          {errors.district && <div className="error-message">{errors.district}</div>}
        </div>
      </div>
    </>
  );
};

export default LocationSection; 