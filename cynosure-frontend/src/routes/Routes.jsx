import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/useStore.js';

// Page Imports
import Home from '../pages/Home.jsx';
import Quiz from '../pages/Quiz.jsx';
import Upload from '../pages/Upload.jsx';
import Results from '../pages/Results.jsx';
import DashboardAdmin from '../pages/DashboardAdmin.jsx';
import Chatbot from '../pages/Chatbot.jsx';

// A wrapper for routes that require authentication.
const ProtectedRoute = () => {
  const { isAuthenticated } = useStore();
  // In a real app, you'd also validate the token on the server
  return isAuthenticated? <Outlet /> : <Navigate to="/" replace />;
};

// A wrapper for routes that require admin privileges.
const AdminRoute = () => {
  const { user, isAuthenticated } = useStore();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  return isAdmin? <Outlet /> : <Navigate to="/" replace />;
};

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      {/* Fallback for login/register, handled in Home page */}
      <Route path="/login" element={<Home />} />
      <Route path="/register" element={<Home />} />

      {/* Protected Routes for Authenticated Users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/results" element={<Results />} />
        <Route path="/chat" element={<Chatbot />} />
      </Route>

      {/* Protected Routes for Admin Users */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      </Route>

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AllRoutes;
