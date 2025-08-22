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
            <li><a href="/" aria-current="page">projects</a></li>
            <li><a href="#about-me" aria-current="page">contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      {!loading  && <FooterLayout />}
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