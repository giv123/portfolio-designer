import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../styles/categoryFilterBarLayout.css";

function CategoryFilterBar({ categories, selectedCategory, onCategoryChange }) {
  const navigate = useNavigate();

  const handleCategoryClick = (value) => {
    onCategoryChange(value);
    navigate("#projects-list");
  };

  return (
    <nav className="category-filter-bar" aria-label="Project categories">
      <div className="category-button-group" role="group" aria-label="Category buttons">
        <button
          className={["category-button", selectedCategory === "" && "active"]
            .filter(Boolean)
            .join(" ")}
          onClick={() => handleCategoryClick("")}
          aria-pressed={selectedCategory === ""}
        >
          All
        </button>

        {categories.map(({ label, value }) => (
          <button
            key={value}
            className={["category-button", selectedCategory === value && "active"]
              .filter(Boolean)
              .join(" ")}
            onClick={() => handleCategoryClick(value)}
            aria-pressed={selectedCategory === value}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

CategoryFilterBar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};

export default CategoryFilterBar;