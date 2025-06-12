import React from 'react';
import PropTypes from 'prop-types';
import { Warning as WarningIcon } from '@mui/icons-material';
import '../../styles/common/ConfirmationDialog.scss';

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const typeClass = {
    warning: 'confirmation-dialog-warning',
    danger: 'confirmation-dialog-danger',
    info: 'confirmation-dialog-info'
  }[type];

  return (
    <div className="confirmation-dialog-overlay">
      <div className={`confirmation-dialog ${typeClass}`}>
        <div className="dialog-header">
          <WarningIcon className="dialog-icon" />
          <h3 className="dialog-title">{title}</h3>
        </div>
        <div className="dialog-content">
          <p className="dialog-message">{message}</p>
        </div>
        <div className="dialog-actions">
          <button 
            className="cancel-button" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="confirm-button" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['warning', 'danger', 'info'])
};

export default ConfirmationDialog; 