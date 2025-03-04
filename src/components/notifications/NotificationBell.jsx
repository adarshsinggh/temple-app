import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnreadNotificationCount, markNotificationAsRead } from '../../store/slices/notificationSlice';
import { FaBell } from 'react-icons/fa';
import Dropdown from '../ui/Dropdown';

const NotificationBell = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    unreadCount, 
    recentNotifications, 
    loading 
  } = useSelector(state => state.notifications);
  
  useEffect(() => {
    // Fetch unread count and recent notifications
    dispatch(fetchUnreadNotificationCount());
    
    // Set up polling to check for new notifications (every 30 seconds)
    const interval = setInterval(() => {
      dispatch(fetchUnreadNotificationCount());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };
  
  const handleViewAll = () => {
    navigate('/notifications');
  };
  
  const renderNotificationItems = () => {
    if (loading && !recentNotifications.length) {
      return [{ label: 'Loading notifications...', disabled: true }];
    }
    
    if (!recentNotifications.length) {
      return [{ label: 'No new notifications', disabled: true }];
    }
    
    const notificationItems = recentNotifications.map(notification => ({
      label: (
        <div className="notification-dropdown-item">
          <div className="notification-title">{notification.Title}</div>
          <div className="notification-message">
            {notification.Message.length > 50 
              ? `${notification.Message.substring(0, 50)}...` 
              : notification.Message}
          </div>
          <div className="notification-time">
            {new Date(notification.SentDateTime).toLocaleString()}
          </div>
        </div>
      ),
      onClick: () => {
        handleMarkAsRead(notification.RecCode);
        navigate(`/notifications/${notification.RecCode}`);
      },
      className: notification.ReadStatus ? 'notification-read' : 'notification-unread'
    }));
    
    notificationItems.push({ divider: true });
    notificationItems.push({
      label: 'View all notifications',
      onClick: handleViewAll,
      className: 'view-all-link'
    });
    
    return notificationItems;
  };
  
  return (
    <div className="notification-bell-container">
      <Dropdown
        trigger={
          <button className="notification-bell-button" aria-label="Notifications">
            <FaBell />
            {unreadCount > 0 && (
              <span className="notification-badge" aria-label={`${unreadCount} unread notifications`}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        }
        items={renderNotificationItems()}
        position="bottom-right"
        className="notification-dropdown"
        maxHeight="400px"
      />
    </div>
  );
};

export default NotificationBell;