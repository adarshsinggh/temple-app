import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '../../store/slices/masterDataSlice';
import FormSelect from '../ui/FormSelect';
import DateRangePicker from '../ui/DateRangePicker';
import Button from '../ui/Button';
import { FaTimes } from 'react-icons/fa';

const NotificationFilters = ({ filters, onChange, onClose }) => {
  const dispatch = useDispatch();
  const { notificationTypes } = useSelector(state => state.masterData);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  useEffect(() => {
    dispatch(fetchMasterData(['notificationTypes']));
  }, [dispatch]);

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateRangeChange = (range) => {
    setLocalFilters(prev => ({
      ...prev,
      startDate: range.startDate,
      endDate: range.endDate
    }));
  };

  const handleApply = () => {
    onChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: filters.search, // Preserve search
      page: 1
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filter Notifications</h3>
        <button className="filter-close" onClick={onClose} aria-label="Close filters">
          <FaTimes />
        </button>
      </div>
      
      <div className="filter-body">
        <div className="filter-grid">
          <FormSelect
            id="typeFilter"
            label="Notification Type"
            value={localFilters.typeId || ''}
            onChange={(e) => handleChange('typeId', e.target.value)}
            options={notificationTypes?.map(type => ({
              value: type.RecCode,
              label: type.TypeName
            })) || []}
          />
          
          <FormSelect
            id="statusFilter"
            label="Status"
            value={localFilters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'sent', label: 'Sent' },
            ]}
          />
          
          <DateRangePicker
            label="Date Range"
            startDate={localFilters.startDate}
            endDate={localFilters.endDate}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>
      
      <div className="filter-footer">
        <Button variant="light" onClick={handleReset}>Reset</Button>
        <Button variant="primary" onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default NotificationFilters;