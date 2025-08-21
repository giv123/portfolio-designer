import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase'; // adjust path
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import CategoryFilterBar from "../components/CategoryFilterBar";
import { CATEGORIES } from "../constants/Categories";
import { deleteProjectWithAssets } from '../services/AdminProjectService';

function ProjectManage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      setLoading(true);
      setError(null);

      try {
        const baseCollection = collection(db, "projects");
        const projectsQuery = selectedCategory !== "" 
          ? query(baseCollection, where("category", "==", selectedCategory)) 
          : query(baseCollection);
        const querySnapshot = await getDocs(projectsQuery);
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) setProjects(projectsData);
      } catch (err) {
        console.error('Failed to fetch projects', err);
        if (isMounted) setError('Failed to load projects');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    try {
      const project = projects.find(p => p.id === id);
      if (!project) {
        setError('❌ Project not found');
        return;
      }

      await deleteProjectWithAssets(project);
      setProjects(prev => prev.filter(p => p.id !== id));

      alert('✅ Project deleted successfully.');
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('❌ Failed to delete project. Please try again.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <h1 className="admin-page-title">Manage Projects</h1>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <h1 className="admin-page-title">Manage Projects</h1>
        <CategoryFilterBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <p className="error">{error}</p>
      </AdminLayout>
    );
  }

  if (projects.length === 0) {
    return (
      <AdminLayout>
        <h1 className="admin-page-title">Manage Projects</h1>
        <CategoryFilterBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <p>No projects found.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Manage Projects</h1>
      <CategoryFilterBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
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

    </AdminLayout>
  );
}

export default ProjectManage;