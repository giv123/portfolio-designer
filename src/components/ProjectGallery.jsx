import React from 'react';
import PropTypes from 'prop-types';
import '../styles/projectGalleryLayout.css';

function ProjectGallery({ images = [] }) {
  if (!Array.isArray(images) || images.length === 0) {
    return <p className="no-images-message">No images to display.</p>;
  }

  return (
    <div className="image-gallery">
      {images
        .filter(image => image.url)
        .map((image, index) => (
          <img
            key={image.name || index}
            src={image.url}
            alt={image.alt || `Project Image ${index + 1}`}
            className="gallery-image"
            loading="lazy"
          />
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