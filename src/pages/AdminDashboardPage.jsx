import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useProjects } from '../hooks/useProjects';
import { deleteProjectWithAssets } from '../services/AdminProjectService';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import CategoryFilterBar from "../components/CategoryFilterBar";
import { CATEGORIES } from "../constants/Categories";

function ProjectManage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useProjects(selectedCategory);

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    try {
      const project = projects.find(p => p.id === id);
      if (!project) {
        alert('❌ Project not found');
        return;
      }

      await deleteProjectWithAssets(project);
      await queryClient.invalidateQueries(['projects']);

      alert('✅ Project deleted successfully.');
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('❌ Failed to delete project. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Manage Projects</h1>
      <CategoryFilterBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {isLoading && <LoadingSpinner />}

      {isError && (
        <p className="error">
          Failed to load projects: {error.message || 'Unknown error'}
        </p>
      )}

      {!isLoading && projects?.length === 0 && (
        <p className="admin-error-text">No projects found.</p>
      )}

      {!isLoading && projects?.length > 0 && (
        <div className="admin-project-list">
          {projects.map(project => (
            <div key={project.id} className="admin-project-card">
              {project.imageUrl && (
                <img src={project.imageUrl} alt={project.title} />
              )}

              <h3 className="admin-project-title">{project.title}</h3>

              <span
                className={`admin-status-label ${
                  project.published ? 'published' : 'draft'
                }`}
              >
                {project.published ? 'Published' : 'Draft'}
              </span>

              <div className="admin-card-actions">
                <button
                  className="admin-edit-button"
                  onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                >
                  Edit
                </button>

                <button
                  className="admin-delete-button"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default ProjectManage;