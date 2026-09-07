import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-card">
      <div className="nav-brand">
        <Link to="/dashboard">🔧 CAD Platform</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span style={{ opacity: 0.7, marginLeft: '1rem' }}>
              Welcome, {user.username}
            </span>
            <button 
              onClick={handleLogout} 
              className="btn-secondary"
              style={{ marginLeft: '1rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;