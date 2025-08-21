// src/pages/AdminLogoutPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/adminLogoutLayout.css';
import HomeLayout from '../components/HomeLayout';

function AdminLogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut(auth);
        navigate('/');
      } catch (error) {
        console.error('Error during logout:', error);
        alert('Logout failed. Please try again.');
      }
    };

    logout();
  }, [navigate]);

  return (
    <HomeLayout>
      <div className="admin-logout-container">
        <p>Logging out...</p>
      </div>
    </HomeLayout>
  );
}

export default AdminLogoutPage;