import React from "react";
import PropTypes from "prop-types";
import "../styles/footerLayout.css";

const FooterLayout = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-top">
        <div className="footer-section about-me" id="about-me">
          <h4>About Me</h4>
          <p>
            From a very young age I’ve been passionate about crafts and have been very creative. I initiated my design career studying Product Design and Modelling at Escola Massana, Barcelona.
          </p>
          <p>
            Over the years I shifted my career towards Graphic Design and since I moved to Glasgow in 2016 that’s what I’ve been doing. 
            Working across start-ups, community groups, in-house design teams and as a freelance designer, I gained valuable experience in creative problem solving, project management, communication and team collaboration.
          </p>
          <p>
            My design style is usually described as neat and thoughtful, with well structured messaging and visually appealing compositions. 
          </p>
        </div>

        <div className="footer-section contact">
          <h4>Contact</h4>
          <p>
            If you’d like to get in touch, please feel free to email me at any time.
            I look forward to the opportunity to discuss how I can contribute to your project.
          </p>
          <p>
            <a href="mailto:nuriaperezviura@gmail.com" aria-label="Send email to Nuria Perez Viura">nuriaperezviura@gmail.com</a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} NPV Portfolio. All rights reserved.
          Designed by Nuria P.V. & Developed by partner of Nuria P.V.
        </p>
      </div>
    </footer>
  );
};

FooterLayout.propTypes = {
  // No props yet, but adding this for future extensibility
};

export default FooterLayout;