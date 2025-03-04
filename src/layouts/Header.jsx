import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Dropdown from '../ui/Dropdown';
import NotificationBell from '../notifications/NotificationBell';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  const userMenuItems = [
    {
      label: 'Profile',
      icon: <FaUser />,
      href: '/profile'
    },
    {
      label: 'Logout',
      icon: <FaSignOutAlt />,
      onClick: logout
    }
  ];

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>
        <Link to="/dashboard" className="logo-container">
          <img src="/logo.png" alt="Temple Member Directory" className="logo" />
          <span className="logo-text">Temple Directory</span>
        </Link>
      </div>
      <div className="header-right">
        <NotificationBell />
        <Dropdown 
          trigger={
            <button className="user-menu-trigger">
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
            </button>
          }
          items={userMenuItems}
          position="bottom-right"
        />
      </div>
    </header>
  );
};

export default Header;