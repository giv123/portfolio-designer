import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

import HomeLayout from "../components/HomeLayout";
import ProjectCard from "../components/ProjectCard";
import AnimatedBanner from "../components/AnimatedBanner";
import LoadingSpinner from "../components/LoadingSpinner";
import CategoryFilterBar from "../components/CategoryFilterBar";
import { CATEGORIES } from "../constants/Categories";
import "../styles/homeLayout.css";

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      setLoading(true);
      setError(null);

      try {
        const baseCollection = collection(db, "projects");
        const filters = [where("published", "==", true)];

        if (selectedCategory !== "") {
          filters.push(where("category", "==", selectedCategory));
        }

        const projectsQuery = query(baseCollection, ...filters);
        const querySnapshot = await getDocs(projectsQuery);

        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (isMounted) {
          setError("Failed to load projects.");
          setProjects([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <>
      <HomeLayout loading={loading}>
        <AnimatedBanner />

        <CategoryFilterBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="project-list">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="error-message">{error}</p>
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
    </>
  );
}

export default HomePage;