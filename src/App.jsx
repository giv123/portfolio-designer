// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarouselStoragePage from './pages/CarouselStoragePage';
import ProjectCreatePage from './pages/ProjectCreatePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProjectEditPage from './pages/ProjectEditPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLogoutPage from './pages/AdminLogoutPage';

import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/carousel/update" element={<CarouselStoragePage />} />
          <Route path="/admin/projects/create" element={<ProjectCreatePage />} />
          <Route path="/admin/projects/edit/:id" element={<ProjectEditPage />} />
          <Route path="/admin/logout" element={<AdminLogoutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}