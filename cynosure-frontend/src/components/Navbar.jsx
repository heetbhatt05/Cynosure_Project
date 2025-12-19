import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore.js';

// Simple SVG Icon for Logout
const LogoutIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const Navbar = () => {
  const { isAuthenticated, user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-nav">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          <span className="logo-text">Cynosure</span>
          <span className="logo-dot">.</span>
        </NavLink>

        {isAuthenticated && (
          <div className="nav-right">
            <ul className="nav-links">
              <li><NavLink to="/quiz">Quiz</NavLink></li>
              <li><NavLink to="/upload">Upload</NavLink></li>
              <li><NavLink to="/results">Results</NavLink></li>
              <li><NavLink to="/chat">Chatbot</NavLink></li>
              {user?.role === 'admin' && (
                <li><NavLink to="/admin/dashboard">Admin</NavLink></li>
              )}
            </ul>
            
            <div className="nav-separator"></div>

            <button onClick={handleLogout} className="logout-button" aria-label="Logout">
              <span>Logout</span>
              <LogoutIcon />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;