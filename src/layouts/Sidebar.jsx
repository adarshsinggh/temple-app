import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaHome, 
  FaBuilding, 
  FaBell, 
  FaDatabase,
  FaCog 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  
  const navItems = [
    {
      label: 'Dashboard',
      icon: <FaTachometerAlt />,
      path: '/dashboard'
    },
    {
      label: 'Members',
      icon: <FaUsers />,
      path: '/members'
    },
    {
      label: 'Families',
      icon: <FaHome />,
      path: '/families'
    },
    {
      label: 'Buildings',
      icon: <FaBuilding />,
      path: '/buildings'
    },
    {
      label: 'Notifications',
      icon: <FaBell />,
      path: '/notifications'
    },
    {
      label: 'Master Data',
      icon: <FaDatabase />,
      path: '/master-data'
    },
    {
      label: 'Settings',
      icon: <FaCog />,
      path: '/settings'
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {user?.name?.charAt(0) || 'U'}
        </div>
        {isOpen && (
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name || 'User'}</p>
            <p className="sidebar-user-role">{user?.role || 'Admin'}</p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {navItems.map((item) => (
            <li key={item.path} className="sidebar-nav-item">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `sidebar-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {isOpen && <span className="sidebar-nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;