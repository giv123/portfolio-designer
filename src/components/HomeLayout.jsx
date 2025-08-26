import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import FooterLayout from "../components/FooterLayout";
import '../styles/homeLayout.css';

function HomeLayout({ children, loading }) {

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  const location = useLocation();
  useEffect(() => {
    if (!loading && location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        const isMobile = window.innerWidth <= 480;

        let yOffset;
        if (location.hash === "#contact") {
          yOffset = isMobile ? -198 : -100;
        } else {
          yOffset = isMobile ? -313 : -215;
        }

        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y });
      }
    }
  }, [loading, location.hash]);

  return (
    <div className="layout">
      <header className="sidebar" role="banner" aria-label="Main navigation">
        <Link to="/">
          <img
            src="/images/ndp-logo.png"
            alt="Nuria Design Portfolio"
            className="sidebar-logo"
            onClick={handleClick}
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