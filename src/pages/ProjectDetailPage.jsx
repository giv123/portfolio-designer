import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import HomeLayout from "../components/HomeLayout";
import ProjectGallery from "../components/ProjectGallery";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/projectDetailLayout.css";

function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setError("No project slug specified.");
      setLoading(false);
      return;
    }

    const fetchProjectBySlug = async () => {
      setLoading(true);
      setError(null);

      try {
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, where("slug", "==", slug));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setProject({ id: doc.id, ...doc.data() });
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectBySlug();
  }, [slug]);

  const handleBack = () => {
    navigate(-1); // goes to the previous page
  };

  return (
    <HomeLayout loading={loading}>
      <div className="project-detail-header">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && error && (
        <p className="project-error-message">{error}</p>
      )}

      {!loading && !error && project && (
        <>
          <h1 className="project-title">{project.title}</h1>
          <p className="project-description">{project.description}</p>
          <ProjectGallery
            images={Array.isArray(project.images) ? project.images : []}
          />
        </>
      )}

      {!loading && !error && !project && (
        <p className="project-error-message">Project not found.</p>
      )}
    </HomeLayout>
  );
}

export default ProjectDetailPage;