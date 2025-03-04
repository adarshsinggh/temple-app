import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '../../store/slices/masterDataSlice';
import { createNotification } from '../../store/slices/notificationSlice';
import { FaArrowLeft, FaPaperPlane, FaClock, FaUsers } from 'react-icons/fa';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import FormTextarea from '../../components/ui/FormTextarea';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import NotificationRecipientFilter from '../../components/notifications/NotificationRecipientFilter';
import NotificationPreview from '../../components/notifications/NotificationPreview';

const ComposeNotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notificationTypes } = useSelector(state => state.masterData);
  const { creating, error } = useSelector(state => state.notifications);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notificationTypeId: '',
    filterCriteria: {
      areaIds: [],
      buildingIds: [],
      genderIds: [],
      religiousStudyIds: [],
      ageRange: { min: '', max: '' },
      memberIds: []
    },
    scheduledDateTime: '',
    scheduleNotification: false
  });
  
  const [errors, setErrors] = useState({});
  const [recipientCount, setRecipientCount] = useState(0);
  const [activeTab, setActiveTab] = useState('compose');
  
  useEffect(() => {
    dispatch(fetchMasterData(['notificationTypes']));
  }, [dispatch]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects like filterCriteria.ageRange.min
      const [parent, child, subChild] = name.split('.');
      
      if (subChild) {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: {
              ...formData[parent][child],
              [subChild]: type === 'checkbox' ? checked : value
            }
          }
        });
      } else {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleFilterChange = (filterData) => {
    setFormData({
      ...formData,
      filterCriteria: {
        ...formData.filterCriteria,
        ...filterData
      }
    });
    
    // Update recipient count - this would be an API call in a real implementation
    // For demo, we're just setting a random number
    setRecipientCount(Math.floor(Math.random() * 500) + 50);
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (!formData.notificationTypeId) newErrors.notificationTypeId = 'Notification type is required';
    
    if (formData.scheduleNotification && !formData.scheduledDateTime) {
      newErrors.scheduledDateTime = 'Scheduled date is required';
    }
    
    // Check if any filters are set
    const hasFilters = Object.values(formData.filterCriteria).some(value => {
      if (Array.isArray(value) && value.length > 0) return true;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== '' && v !== null && v !== undefined);
      }
      return value !== '' && value !== null && value !== undefined;
    });
    
    if (!hasFilters) {
      newErrors.filterCriteria = 'At least one filter must be set to target recipients';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      const payload = {
        Title: formData.title,
        Message: formData.message,
        NotificationTypeID: formData.notificationTypeId,
        FilterCriteria: formData.filterCriteria,
        ScheduledDateTime: formData.scheduleNotification ? formData.scheduledDateTime : null
      };
      
      dispatch(createNotification(payload))
        .unwrap()
        .then(() => {
          navigate('/notifications');
        })
        .catch(error => {
          // Error is handled by the redux slice
          console.error('Failed to create notification', error);
        });
    }
  };
  
  return (
    <div className="compose-notification-page">
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
          <h1>Compose Notification</h1>
        </div>
      </div>
      
      <div className="compose-notification-tabs">
        <button 
          className={`tab-button ${activeTab === 'compose' ? 'active' : ''}`}
          onClick={() => setActiveTab('compose')}
        >
          <FaPaperPlane /> Compose
        </button>
        <button 
          className={`tab-button ${activeTab === 'recipients' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipients')}
        >
          <FaUsers /> Recipients
        </button>
        <button 
          className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <FaClock /> Schedule
        </button>
        <button 
          className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="compose-notification-form">
        {activeTab === 'compose' && (
          <Card title="Compose Message">
            <FormSelect
              id="notificationType"
              name="notificationTypeId"
              label="Notification Type"
              value={formData.notificationTypeId}
              onChange={handleChange}
              options={notificationTypes?.map(type => ({
                value: type.RecCode,
                label: type.TypeName
              })) || []}
              error={errors.notificationTypeId}
              required
            />
            
            <FormInput
              id="notificationTitle"
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              maxLength={200}
            />
            
            <FormTextarea
              id="notificationMessage"
              name="message"
              label="Message"
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              required
              rows={8}
              maxLength={1000}
              hint="Maximum 1000 characters"
            />
          </Card>
        )}
        
        {activeTab === 'recipients' && (
          <NotificationRecipientFilter
            filterCriteria={formData.filterCriteria}
            onChange={handleFilterChange}
            recipientCount={recipientCount}
            error={errors.filterCriteria}
          />
        )}
        
        {activeTab === 'schedule' && (
          <Card title="Schedule Notification">
            <div className="form-check schedule-toggle">
              <input
                id="scheduleNotification"
                name="scheduleNotification"
                type="checkbox"
                checked={formData.scheduleNotification}
                onChange={handleChange}
                className="form-check-input"
              />
              <label htmlFor="scheduleNotification" className="form-check-label">
                Schedule for later delivery
              </label>
            </div>
            
            {formData.scheduleNotification && (
              <FormInput
                id="scheduledDateTime"
                name="scheduledDateTime"
                label="Scheduled Date & Time"
                type="datetime-local"
                value={formData.scheduledDateTime}
                onChange={handleChange}
                error={errors.scheduledDateTime}
                required={formData.scheduleNotification}
                min={new Date().toISOString().slice(0, 16)} // Current date-time in the format required
              />
            )}
            
            <div className="schedule-note">
              <p>
                {formData.scheduleNotification
                  ? "Your notification will be sent at the scheduled time."
                  : "Your notification will be sent immediately after submission."}
              </p>
            </div>
          </Card>
        )}
        
        {activeTab === 'preview' && (
          <NotificationPreview
            title={formData.title}
            message={formData.message}
            type={notificationTypes?.find(type => type.RecCode === formData.notificationTypeId)?.TypeName || 'Notification'}
            scheduledDateTime={formData.scheduleNotification ? formData.scheduledDateTime : null}
            recipientCount={recipientCount}
          />
        )}
        
        <div className="notification-form-actions">
          {activeTab !== 'compose' && (
            <Button 
              type="button" 
              variant="light" 
              onClick={() => {
                const tabs = ['compose', 'recipients', 'schedule', 'preview'];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                }
              }}
            >
              Previous
            </Button>
          )}
          
          {activeTab !== 'preview' ? (
            <Button 
              type="button" 
              variant="primary" 
              onClick={() => {
                const tabs = ['compose', 'recipients', 'schedule', 'preview'];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1]);
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              variant="primary" 
              icon={<FaPaperPlane />}
              loading={creating}
            >
              {formData.scheduleNotification ? 'Schedule Notification' : 'Send Notification'}
            </Button>
          )}
        </div>
      </form>
      
      {error && (
        <div className="notification-error">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default ComposeNotificationPage;