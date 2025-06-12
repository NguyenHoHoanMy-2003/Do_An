import React from 'react';
import PropTypes from 'prop-types';
import { Error as ErrorIcon } from '@mui/icons-material';
import '../../styles/common/ErrorMessage.scss';

const ErrorMessage = ({ 
  message, 
  type = 'error',
  onClose,
  showIcon = true,
  fullWidth = false
}) => {
  const typeClass = {
    error: 'error-message-error',
    warning: 'error-message-warning',
    info: 'error-message-info'
  }[type];

  return (
    <div className={`error-message ${typeClass} ${fullWidth ? 'full-width' : ''}`}>
      {showIcon && <ErrorIcon className="error-icon" />}
      <span className="error-text">{message}</span>
      {onClose && (
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'warning', 'info']),
  onClose: PropTypes.func,
  showIcon: PropTypes.bool,
  fullWidth: PropTypes.bool
};

export default ErrorMessage; 