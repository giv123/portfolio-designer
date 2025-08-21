import React from "react";
import PropTypes from "prop-types";
import "../styles/LoadingSpinnerLayout.css";

const LoadingSpinner = ({ size = 48, ariaLabel = "Loading content" }) => (
  <div className="spinner-container" role="status" aria-live="polite" aria-label={ariaLabel}>
    <div
      className="spinner"
      style={{ width: size, height: size, borderWidth: size * 0.06 }}
    ></div>
  </div>
);

LoadingSpinner.propTypes = {
  size: PropTypes.number,
  ariaLabel: PropTypes.string,
};

export default LoadingSpinner;