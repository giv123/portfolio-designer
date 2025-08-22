import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../styles/projectCardLayout.css';

function ProjectCard({ project }) {
  return (
    <div className="project-card" id="projects">
      {project.imageUrl ? (
        <div className="image-wrapper">
          <img
            src={project.imageUrl}
            alt={project.title || 'Project image'}
            loading="lazy"
          />
          <div className="overlay">
            <h3>{project.title}</h3>
            <Link to={`/projects/${project.slug}`} className="button">
              View Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="no-image-overlay">
          <h3>{project.title}</h3>
          <Link to={`/projects/${project.slug}`} className="button">
            View Project
          </Link>
        </div>
      )}
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
};

export default ProjectCard;