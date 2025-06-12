import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/common/LoadingSpinner.scss';

const LoadingSpinner = ({ size = 'medium', color = 'primary', fullScreen = false }) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  const colorClass = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  }[color];

  const spinner = (
    <div className={`loading-spinner ${sizeClass} ${colorClass}`}>
      <div className="spinner"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-spinner-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white']),
  fullScreen: PropTypes.bool
};

export default LoadingSpinner; 