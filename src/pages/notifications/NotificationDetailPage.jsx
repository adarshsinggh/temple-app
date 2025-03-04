import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotificationById, markNotificationAsRead } from '../../store/slices/notificationSlice';
import { FaArrowLeft, FaClock, FaUsers, FaUserCheck, FaUserTimes, FaSearch } from 'react-icons/fa';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SearchInput from '../../components/ui/SearchInput';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

const NotificationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentNotification, loading, error } = useSelector(state => state.notifications);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchNotificationById(id));
    }
  }, [dispatch, id]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getStatusLabel = (notification) => {
    if (!notification) return <Badge variant="secondary">Unknown</Badge>;
    
    const now = new Date();
    const scheduledDate = notification.ScheduledDateTime ? new Date(notification.ScheduledDateTime) : null;
    
    if (!scheduledDate) {
      return <Badge variant="success">Sent</Badge>;
    }
    
    if (scheduledDate > now) {
      return <Badge variant="warning">Scheduled</Badge>;
    }
    
    return <Badge variant="success">Sent</Badge>;
  };
  
  const getDeliveryStats = (notification) => {
    if (!notification) return { sent: 0, delivered: 0, read: 0, failed: 0, total: 0 };
    
    const total = notification.recipientCount || 0;
    const sent = notification.sentCount || 0;
    const delivered = notification.deliveredCount || sent; // Assume delivered if sent, unless specified
    const read = notification.readCount || 0;
    const failed = notification.failedCount || 0;
    
    return { sent, delivered, read, failed, total };
  };
  
  const renderRecipientColumns = () => [
    {
      header: 'Name',
      field: 'memberName',
      render: (row) => row.member?.MemberName || 'Unknown'
    },
    {
      header: 'Mobile',
      field: 'mobile',
      render: (row) => row.member?.MobileNumber || 'N/A'
    },
    {
      header: 'Sent At',
      field: 'SentDateTime',
      render: (row) => formatDate(row.SentDateTime)
    },
    {
      header: 'Read At',
      field: 'ReadDateTime',
      render: (row) => row.ReadDateTime ? formatDate(row.ReadDateTime) : 'Not read'
    },
    {
      header: 'Status',
      field: 'ReadStatus',
      render: (row) => row.ReadStatus 
        ? <Badge variant="success">Read</Badge>
        : <Badge variant="warning">Delivered</Badge>
    }
  ];
  
  if (loading && !currentNotification) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading notification details</h2>
        <p>{error}</p>
        <Button onClick={() => dispatch(fetchNotificationById(id))}>Retry</Button>
        <Button variant="light" onClick={() => navigate('/notifications')}>
          Back to Notifications
        </Button>
      </div>
    );
  }
  
  if (!currentNotification) {
    return (
      <div className="not-found-container">
        <h2>Notification Not Found</h2>
        <p>The notification you are looking for does not exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/notifications')}>
          Back to Notifications
        </Button>
      </div>
    );
  }
  
  const stats = getDeliveryStats(currentNotification);
  
  return (
    <div className="notification-detail-page">
      <div className="page-header">
        <div className="header-back">
          <Button 
            variant="light" 
            icon={<FaArrowLeft />} 
            onClick={() => navigate('/notifications')}
          >
            Back to Notifications
          </Button>
        </div>
        <div className="header-title">
          <h1>{currentNotification.Title}</h1>
          <div className="notification-meta">
            <div className="notification-type">
              {currentNotification.type?.TypeName || 'Notification'}
            </div>
            <div className="notification-status">
              {getStatusLabel(currentNotification)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="notification-detail-content">
        <div className="notification-detail-grid">
          <Card title="Notification Details">
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Created By</div>
                <div className="detail-value">
                  {currentNotification.creator?.MemberName || 'Admin'}
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Created At</div>
                <div className="detail-value">
                  {formatDate(currentNotification.CreationDateTime)}
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Scheduled For</div>
                <div className="detail-value">
                  {currentNotification.ScheduledDateTime 
                    ? formatDate(currentNotification.ScheduledDateTime)
                    : 'Immediate delivery'}
                </div>
              </div>
              
              <div className="detail-item full-width">
                <div className="detail-label">Message</div>
                <div className="detail-value message-content">
                  {currentNotification.Message}
                </div>
              </div>
            </div>
          </Card>
          
          <Card title="Delivery Statistics">
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Recipients</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{stats.sent}</div>
                <div className="stat-label">Sent</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{stats.delivered}</div>
                <div className="stat-label">Delivered</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{stats.read}</div>
                <div className="stat-label">Read</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">
                  {stats.total > 0 ? Math.round((stats.read / stats.total) * 100) : 0}%
                </div>
                <div className="stat-label">Read Rate</div>
              </div>
            </div>
            
            <div className="delivery-progress">
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill sent" 
                  style={{ width: `${stats.total > 0 ? (stats.sent / stats.total) * 100 : 0}%` }}
                  title={`${stats.sent} sent out of ${stats.total}`}
                ></div>
                <div 
                  className="progress-bar-fill read" 
                  style={{ width: `${stats.total > 0 ? (stats.read / stats.total) * 100 : 0}%` }}
                  title={`${stats.read} read out of ${stats.total}`}
                ></div>
              </div>
              <div className="progress-label">
                <span>{stats.read} read</span>
                <span>out of</span>
                <span>{stats.total} recipients</span>
              </div>
            </div>
          </Card>
        </div>
        
        <Card title="Recipients">
          <div className="table-toolbar">
            <div className="table-toolbar-left">
              <SearchInput 
                placeholder="Search recipients..."
                onSearch={(value) => console.log('Search recipients:', value)}
              />
            </div>
            <div className="table-toolbar-right">
              <Button 
                variant="outline" 
                icon={<FaUserCheck />}
                onClick={() => console.log('Filter: Read')}
              >
                Read
              </Button>
              <Button 
                variant="outline" 
                icon={<FaUserTimes />}
                onClick={() => console.log('Filter: Unread')}
              >
                Unread
              </Button>
            </div>
          </div>
          
          <Table 
            columns={renderRecipientColumns()} 
            data={currentNotification.recipients || []} 
            keyField="RecCode"
            emptyMessage="No recipients found."
          />
        </Card>
      </div>
    </div>
  );
};

export default NotificationDetailPage;