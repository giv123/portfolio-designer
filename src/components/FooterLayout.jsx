import React from "react";
import PropTypes from "prop-types";
import "../styles/footerLayout.css";

const FooterLayout = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-section about-me" id="about-me">
        <h4>About Me</h4>
        <p>
          Hello! I'm Nuria, a creative designer focused on user-centered experiences.
          I blend visual aesthetics with purpose to craft digital products that feel thoughtful and intuitive.
        </p>
        <p>
          My background includes UI/UX design, branding, and front-end collaboration.
          I enjoy working on projects that solve real problems and bring delight to users.
        </p>
      </div>

      <div className="footer-section contact">
        <h4>Contact</h4>
        <p>
          Email:{" "}
          <a href="mailto:nuriaperezviura@hotmail.com" aria-label="Send email to Nuria Perez Viura">
            nuriaperezviura@hotmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

FooterLayout.propTypes = {
  // No props yet, but adding this for future extensibility
};

export default FooterLayout;