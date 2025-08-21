import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getPublishedProjects } from "../services/ProjectService";
import HomeLayout from "../components/HomeLayout";
import ProjectCard from "../components/ProjectCard";
import BannerLayout from "../components/BannerLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import CategoryFilterBar from "../components/CategoryFilterBar";
import { CATEGORIES } from "../constants/Categories";
import "../styles/homeLayout.css";

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["published-projects", selectedCategory],
    queryFn: () => getPublishedProjects(selectedCategory),
    keepPreviousData: true,
  });

  return (
    <HomeLayout loading={isLoading}>
      <BannerLayout />

      <CategoryFilterBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="project-list">
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <p className="error-message">{error?.message || "Failed to load projects."}</p>
        ) : projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="project-card-wrapper">
              <ProjectCard project={project} />
            </div>
          ))
        ) : (
          <p className="no-projects-message">No projects found.</p>
        )}
      </div>
    </HomeLayout>
  );
}

export default HomePage;