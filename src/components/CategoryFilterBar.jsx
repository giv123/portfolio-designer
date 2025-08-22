import React from "react";
import PropTypes from "prop-types";
import "../styles/categoryFilterBarLayout.css";

function CategoryFilterBar({ categories, selectedCategory, onCategoryChange }) {
  return (
    <nav className="category-filter-bar" aria-label="Project categories" id="projects-list">
      <div role="group" aria-label="Category buttons">
        <button
          className={["category-button", selectedCategory === "" && "active"]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onCategoryChange("")}
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
            onClick={() => onCategoryChange(value)}
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