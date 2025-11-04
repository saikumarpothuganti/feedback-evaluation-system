import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import logo from '../assets/images/logo.svg';

const Navbar = ({ title = "Student Feedback System", showAllLinks = false }) => {
  const { logout, userRole } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const handleSwitchRole = (e) => {
    e.preventDefault();
    // Logout current user and redirect to login page for role selection
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" style={{ height: '30px', marginRight: '10px' }} />
        {title}
      </div>
      <ul className="nav-links">
        <li><Link to="/dashboard">Home</Link></li>
        {showAllLinks && (
          <>
            <li><Link to="/dashboard" className={window.location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
            <li><Link to="/student">Student</Link></li>
            <li><Link to="/faculty">Faculty</Link></li>
            <li><Link to="/admin">Admin</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/help">Help</Link></li>
          </>
        )}
        <li>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </li>
        {!showAllLinks && (
          <li><a href="#" onClick={handleSwitchRole}>Switch Role</a></li>
        )}
        <li><a href="#" onClick={handleLogout}>Logout</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
