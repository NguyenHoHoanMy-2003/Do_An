import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle as SuccessIcon } from '@mui/icons-material';
import '../../styles/common/SuccessMessage.scss';

const SuccessMessage = ({ 
  message, 
  onClose,
  showIcon = true,
  fullWidth = false,
  autoClose = false,
  duration = 3000
}) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className={`success-message ${fullWidth ? 'full-width' : ''}`}>
      {showIcon && <SuccessIcon className="success-icon" />}
      <span className="success-text">{message}</span>
      {onClose && (
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

SuccessMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  showIcon: PropTypes.bool,
  fullWidth: PropTypes.bool,
  autoClose: PropTypes.bool,
  duration: PropTypes.number
};

export default SuccessMessage; 