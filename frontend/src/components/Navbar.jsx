import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Clock, LayoutDashboard, PlusCircle, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <Clock size={20} strokeWidth={2.5} />
          </div>
          <span>TimeCheck</span>
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/form"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <PlusCircle size={16} /> New Request
                </span>
              </NavLink>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LayoutDashboard size={16} /> Dashboard
                </span>
              </NavLink>

              <div className="user-badge">
                <div className="user-badge-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user?.name || 'User'}</span>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <LogIn size={16} /> Login
                </span>
              </NavLink>

              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
