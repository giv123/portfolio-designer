import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import HomeLayout from "../components/HomeLayout";
import ProjectGallery from "../components/ProjectGallery";
import LoadingSpinner from "../components/LoadingSpinner";
import { getProjectBySlug } from "../services/ProjectService";
import "../styles/projectDetailLayout.css";

function ProjectDetailPage() {
  const { slug } = useParams();

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

  return (
    <HomeLayout loading={isLoading}>
      {isLoading && <LoadingSpinner />}

      {isError && (
        <p className="project-error-message">
          {error?.message || "Failed to load project."}
        </p>
      )}

      {!isLoading && !isError && project && (
        <div className="project-container">
          <h1 className="project-title">{project.title}</h1>
            <div className="description-container">
              <div>
                <p className="project-subtitle">BRIEF</p>
                <p className="project-description">{project.briefDescription}</p>
              </div>
              <div>
                <p className="project-subtitle">WORK</p>
                <p className="project-description">{project.workDescription}</p>
              </div>
            </div>
            <ProjectGallery
              images={Array.isArray(project.images) ? project.images : []}
            />
        </div>
      )}

      {!isLoading && !isError && !project && (
        <p className="project-error-message">Project not found.</p>
      )}
    </HomeLayout>
  );
}

export default ProjectDetailPage;