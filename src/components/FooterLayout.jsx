import React from "react";
import PropTypes from "prop-types";
import "../styles/footerLayout.css";

const FooterLayout = () => {
  return (
    <>
      <footer className="footer" role="contentinfo">
        <div className="footer-top">
          <div className="footer-section">
            <h1>About Me</h1>
            <p>
              I am a Graphic Designer with over 8 years of experience creating impactful digital and print visuals.
            </p>
            <p>
              My purpose is to create design solutions that help clients connect better with their audience and achieve their goals.
            </p>
            <p>
              Having worked in a variety of industries - from startups to e-commerce, and with a passion for sustainability, I bring a unique perspective to each project - grounded in excellence, clarity, and clean, structured design that communicates with simplicity and intention.
            </p>
            <p>
              I thrive collaborating with others and meeting deadlines, adapting my approach to capture my clients needs ensuring a strategic information hierarchy and high-converting call to actions.
            </p>
          </div>

          <div className="footer-section" id="contact"> 
            <h1>Contact</h1>
            <p>
              I look forward to the opportunity to discuss how I can contribute to your project. Drop me an email at <a href="mailto:nuriaperezviura@gmail.com" aria-label="Send email to Nuria Perez Viura">nuriaperezviura@gmail.com</a>.
            </p>
          </div>
        </div>
      </footer>
      <footer className="footer-second" role="contentinfo">
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} NPV portfolio. All rights reserved. Designed by Nuria PV and developed by GMG.
          </p>
        </div>
      </footer>
    </>
  );
};

FooterLayout.propTypes = {
  // No props yet, but adding this for future extensibility
};

export default FooterLayout;