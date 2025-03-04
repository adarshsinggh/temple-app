import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, setNotificationFilters } from '../../store/slices/notificationSlice';
import { FaPlus, FaBell, FaEye, FaCalendarAlt, FaFilter } from 'react-icons/fa';

import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import SearchInput from '../../components/ui/SearchInput';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import NotificationFilters from '../../components/notifications/NotificationFilters';
import Badge from '../../components/ui/Badge';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    notifications, 
    totalNotifications, 
    loading, 
    error, 
    filters, 
    page, 
    limit 
  } = useSelector(state => state.notifications);
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications({ page, limit, ...filters }));
  }, [dispatch, page, limit, filters]);

  const handleSearch = (searchText) => {
    dispatch(setNotificationFilters({ ...filters, search: searchText, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setNotificationFilters({ ...filters, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setNotificationFilters({ ...filters, page: newPage }));
  };

  const handleRowClick = (notification) => {
    navigate(`/notifications/${notification.RecCode}`);
  };

  const getStatusLabel = (notification) => {
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

  const getReadPercentage = (notification) => {
    if (!notification.recipientCount || notification.recipientCount === 0) {
      return '0%';
    }
    
    const percentage = Math.round((notification.readCount / notification.recipientCount) * 100);
    return `${percentage}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const columns = [
    {
      header: 'Title',
      field: 'Title',
      render: (row) => (
        <div className="notification-title-cell">
          <span className="notification-title">{row.Title}</span>
          <span className="notification-type">{row.type?.TypeName || 'Notification'}</span>
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => getStatusLabel(row)
    },
    {
      header: 'Scheduled',
      render: (row) => formatDate(row.ScheduledDateTime)
    },
    {
      header: 'Recipients',
      render: (row) => row.recipientCount || 0
    },
    {
      header: 'Read Rate',
      render: (row) => (
        <div className="read-rate-cell">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: getReadPercentage(row) }}
            ></div>
          </div>
          <span className="read-rate-text">
            {row.readCount || 0} / {row.recipientCount || 0} ({getReadPercentage(row)})
          </span>
        </div>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="table-actions">
          <Button 
            variant="icon" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/notifications/${row.RecCode}`);
            }}
            aria-label="View notification details"
          >
            <FaEye />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Notifications</h1>
        <div className="page-actions">
          <Button 
            variant="primary" 
            icon={<FaPlus />} 
            onClick={() => navigate('/notifications/compose')}
          >
            Compose Notification
          </Button>
        </div>
      </div>

      <Card>
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <SearchInput 
              placeholder="Search notifications..."
              value={filters.search || ''}
              onSearch={handleSearch}
            />
            <Button 
              variant="outline" 
              icon={<FaFilter />} 
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'active' : ''}
            >
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <NotificationFilters 
            filters={filters} 
            onChange={handleFilterChange} 
            onClose={() => setShowFilters(false)}
          />
        )}

        {loading && !notifications.length ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <Button onClick={() => dispatch(fetchNotifications({ page, limit, ...filters }))}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <Table 
              columns={columns} 
              data={notifications} 
              keyField="RecCode"
              onRowClick={handleRowClick}
              loading={loading}
              emptyMessage="No notifications found. Try adjusting your filters or compose a new notification."
            />
            
            <Pagination 
              currentPage={page} 
              totalPages={Math.ceil(totalNotifications / limit)}
              totalItems={totalNotifications}
              pageSize={limit}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default NotificationsPage;