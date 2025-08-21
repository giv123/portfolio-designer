import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import HomeLayout from "../components/HomeLayout";
import ProjectGallery from "../components/ProjectGallery";
import LoadingSpinner from "../components/LoadingSpinner";
import { getProjectBySlug } from "../services/ProjectService";
import "../styles/projectDetailLayout.css";

function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: !!slug,
    retry: false,
  });

  const handleBack = () => navigate(-1);

  return (
    <HomeLayout loading={isLoading}>
      <div className="project-detail-header">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
      </div>

      {isLoading && <LoadingSpinner />}

      {isError && (
        <p className="project-error-message">
          {error?.message || "Failed to load project."}
        </p>
      )}

      {!isLoading && !isError && project && (
        <>
          <h1 className="project-title">{project.title}</h1>
          <p className="project-description">{project.description}</p>
          <ProjectGallery
            images={Array.isArray(project.images) ? project.images : []}
          />
        </>
      )}

      {!isLoading && !isError && !project && (
        <p className="project-error-message">Project not found.</p>
      )}
    </HomeLayout>
  );
}

export default ProjectDetailPage;