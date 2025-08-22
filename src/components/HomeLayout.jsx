import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import FooterLayout from "../components/FooterLayout";
import '../styles/homeLayout.css';

function HomeLayout({ children, loading }) {

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    }
  }, [location]);

  return (
    <div className="layout">
      <header className="sidebar" role="banner" aria-label="Main navigation">
        <Link to="/">
          <img
            src="/images/ndp-logo.png"
            alt="Nuria Design Portfolio"
            className="sidebar-logo"
          />
        </Link>
        <nav aria-label="Primary navigation">
          <ul>
            <li>
              <Link to="/#projects-list">projects</Link>
            </li>
            <li>
              <Link to="/#contact">contact</Link>
            </li>
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