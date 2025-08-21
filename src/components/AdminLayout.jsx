import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/adminLayout.css';

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
        <nav>
          <ul>
            <li><Link to="/">Projects Home</Link></li>
            <li><Link to="/admin/dashboard">Manage Projects</Link></li>
            <li><Link to="/projects/create">Create New Project</Link></li>
            <li><Link to="/admin/logout">Admin Logout</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main-content">
        <div className="admin-container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;