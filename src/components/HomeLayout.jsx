import React from 'react';
import PropTypes from 'prop-types';
import FooterLayout from "../components/FooterLayout";
import '../styles/homeLayout.css';

function HomeLayout({ children, loading }) {
  return (
    <div className="layout">
      <header className="sidebar" role="banner" aria-label="Main navigation">
        <a href="/">
          <img
            src="/images/ndp-logo.png"
            alt="Nuria Design Portfolio"
            className="sidebar-logo"
          />
        </a>
        <nav aria-label="Primary navigation">
          <ul>
            <li><a href="#about-me" aria-current="page">More Info</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      {!loading  && <FooterLayout />}

      <footer className="sticky-footer" role="contentinfo" aria-live="polite">
        <p>&copy; {new Date().getFullYear()} NPV Portfolio. All rights reserved. Designed by Nuria P.V. & Developed by Nuria P.V's partner.</p>
      </footer>
    </div>
  );
}

HomeLayout.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
};

HomeLayout.defaultProps = {
  loading: false,
};

export default HomeLayout;