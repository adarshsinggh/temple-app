import React from 'react';
import Card from '../ui/Card';
import { FaCalendarAlt, FaUsers, FaBell } from 'react-icons/fa';

const NotificationPreview = ({ title, message, type, scheduledDateTime, recipientCount }) => {
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'Immediately';
    
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };
  
  return (
    <Card title="Notification Preview">
      <div className="notification-preview">
        <div className="notification-preview-header">
          <div className="notification-type">
            <FaBell />
            <span>{type || 'Notification'}</span>
          </div>
        </div>
        
        <div className="notification-preview-body">
          <h3 className="notification-preview-title">{title || 'Notification Title'}</h3>
          <div className="notification-preview-message">
            {message || 'Notification message will appear here...'}
          </div>
        </div>
        
        <div className="notification-preview-footer">
          <div className="notification-preview-schedule">
            <FaCalendarAlt />
            <span>Scheduled: {formatDateTime(scheduledDateTime)}</span>
          </div>
          
          <div className="notification-preview-recipients">
            <FaUsers />
            <span>Recipients: {recipientCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationPreview;