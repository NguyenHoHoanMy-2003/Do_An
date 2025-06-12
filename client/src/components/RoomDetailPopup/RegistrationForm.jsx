import React from 'react';
import PropTypes from 'prop-types';

const RegistrationForm = ({ 
  selectedRoom, 
  formData, 
  onInputChange, 
  onSubmit 
}) => {
  console.log('formData in RegistrationForm:', formData);
  if (!selectedRoom) return null;

  // Ensure all form fields have default values
  const safeFormData = {
    hoTen: formData?.hoTen ?? "",
    soDienThoai: formData?.soDienThoai ?? "",
    cccdSo: formData?.cccdSo ?? "",
    cccdNgayCap: formData?.cccdNgayCap ?? "",
    cccdNoiCap: formData?.cccdNoiCap ?? ""
  };

  return (
    <div>
      <h3>Đăng ký thuê Phòng {selectedRoom}</h3>
      <div className="room-detail-popup">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="hoTen">Họ và tên:</label>
            <input
              type="text"
              id="hoTen"
              name="hoTen"
              value={safeFormData.hoTen}
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
              value={safeFormData.soDienThoai}
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
              value={safeFormData.cccdSo}
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
              value={safeFormData.cccdNgayCap}
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
              value={safeFormData.cccdNoiCap}
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
  selectedRoom: PropTypes.string,
  formData: PropTypes.shape({
    hoTen: PropTypes.string.isRequired,
    soDienThoai: PropTypes.string.isRequired,
    cccdSo: PropTypes.string.isRequired,
    cccdNgayCap: PropTypes.string.isRequired,
    cccdNoiCap: PropTypes.string.isRequired,
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

RegistrationForm.defaultProps = {
  selectedRoom: null,
  formData: {
    hoTen: "",
    soDienThoai: "",
    cccdSo: "",
    cccdNgayCap: "",
    cccdNoiCap: ""
  }
};

export default RegistrationForm; 