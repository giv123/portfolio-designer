import React from 'react';
import PropTypes from 'prop-types';
import '../styles/projectGalleryLayout.css';

function ProjectGallery({ images = [] }) {
  if (!Array.isArray(images) || images.length === 0) {
    return <p className="no-images-gallery-message">No images to display.</p>;
  }

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div className="image-gallery-wrapper" key={index}>
          <img
            src={image.url}
            alt={image.alt || `Image ${index + 1}`}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

ProjectGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string,
      alt: PropTypes.string,
    })
  ),
};

export default ProjectGallery;