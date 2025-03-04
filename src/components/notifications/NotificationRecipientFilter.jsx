import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '../../store/slices/masterDataSlice';
import { fetchMembersByFilter } from '../../store/slices/memberSlice';

import Card from '../ui/Card';
import FormSelect from '../ui/FormSelect';
import FormInput from '../ui/FormInput';
import MultiSelect from '../ui/MultiSelect';
import Button from '../ui/Button';
import { FaSearch, FaUsers } from 'react-icons/fa';

const NotificationRecipientFilter = ({ filterCriteria, onChange, recipientCount, error }) => {
  const dispatch = useDispatch();
  const { 
    genders, 
    religiousStudies, 
    areas, 
    buildings 
  } = useSelector(state => state.masterData);
  
  const [localFilters, setLocalFilters] = useState({ ...filterCriteria });
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  useEffect(() => {
    dispatch(fetchMasterData([
      'genders', 
      'religiousStudies', 
      'areas', 
      'buildings'
    ]));
  }, [dispatch]);
  
  const handleChange = (field, value) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev };
      
      // Handle nested fields like ageRange.min
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newFilters[parent] = { ...newFilters[parent], [child]: value };
      } else {
        newFilters[field] = value;
      }
      
      return newFilters;
    });
  };
  
  const handleApply = () => {
    onChange(localFilters);
  };
  
  const handleMultiSelectChange = (field, selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    handleChange(field, values);
  };
  
  const handleSearchMembers = () => {
    // This would actually call an API to search members
    // For demo purposes, we'll just simulate it
    dispatch(fetchMembersByFilter({}))
      .unwrap()
      .then(members => {
        setSelectedMembers(members.map(member => ({
          value: member.RecCode,
          label: `${member.MemberName} (${member.MobileNumber || 'No Mobile'})`
        })));
      });
  };
  
  const handleAddSelectedMembers = (selected) => {
    handleChange('memberIds', [...localFilters.memberIds, ...selected.map(option => option.value)]);
  };
  
  return (
    <Card title="Recipient Filters">
      <div className="filter-section">
        <h4>Geographic Filters</h4>
        <div className="filter-grid">
          <MultiSelect
            id="areaIds"
            label="Areas"
            value={localFilters.areaIds}
            options={areas?.map(area => ({
              value: area.RecCode,
              label: area.AreaName
            })) || []}
            onChange={(selected) => handleMultiSelectChange('areaIds', selected)}
            placeholder="Select areas..."
          />
          
          <MultiSelect
            id="buildingIds"
            label="Buildings"
            value={localFilters.buildingIds}
            options={buildings?.map(building => ({
              value: building.RecCode,
              label: `${building.BuildingName}${building.area ? ` (${building.area.AreaName})` : ''}`
            })) || []}
            onChange={(selected) => handleMultiSelectChange('buildingIds', selected)}
            placeholder="Select buildings..."
          />
        </div>
      </div>
      
      <div className="filter-section">
        <h4>Demographic Filters</h4>
        <div className="filter-grid">
          <MultiSelect
            id="genderIds"
            label="Gender"
            value={localFilters.genderIds}
            options={genders?.map(gender => ({
              value: gender.RecCode,
              label: gender.GenderName
            })) || []}
            onChange={(selected) => handleMultiSelectChange('genderIds', selected)}
            placeholder="Select genders..."
          />
          
          <div className="age-range-filter">
            <label className="form-label">Age Range</label>
            <div className="age-inputs">
              <FormInput
                id="minAge"
                placeholder="Min"
                type="number"
                min="0"
                value={localFilters.ageRange?.min || ''}
                onChange={(e) => handleChange('ageRange.min', e.target.value)}
              />
              <span className="age-separator">to</span>
              <FormInput
                id="maxAge"
                placeholder="Max"
                type="number"
                min="0"
                value={localFilters.ageRange?.max || ''}
                onChange={(e) => handleChange('ageRange.max', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="filter-section">
        <h4>Religious Filters</h4>
        <div className="filter-grid">
          <MultiSelect
            id="religiousStudyIds"
            label="Religious Study Level"
            value={localFilters.religiousStudyIds}
            options={religiousStudies?.map(study => ({
              value: study.RecCode,
              label: `${study.StudyName} - ${study.StudyLevel}`
            })) || []}
            onChange={(selected) => handleMultiSelectChange('religiousStudyIds', selected)}
            placeholder="Select religious study levels..."
          />
        </div>
      </div>
      
      <div className="filter-section">
        <h4>Specific Members</h4>
        <div className="member-search">
          <div className="member-search-actions">
            <Button 
              variant="light" 
              icon={<FaSearch />} 
              onClick={handleSearchMembers}
            >
              Search Members
            </Button>
          </div>
          
          {selectedMembers.length > 0 && (
            <div className="member-selection">
              <MultiSelect
                id="selectedMembers"
                label="Select specific members to add"
                options={selectedMembers}
                onChange={handleAddSelectedMembers}
                placeholder="Select members..."
              />
            </div>
          )}
          
          {localFilters.memberIds?.length > 0 && (
            <div className="selected-members-list">
              <h5>Selected Members:</h5>
              <ul>
                {localFilters.memberIds.map(id => {
                  const member = selectedMembers.find(m => m.value === id);
                  return (
                    <li key={id}>
                      {member?.label || id}
                      <button 
                        className="remove-member" 
                        onClick={() => handleChange('memberIds', localFilters.memberIds.filter(m => m !== id))}
                      >
                        &times;
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="recipient-summary">
        <div className="recipient-count">
          <FaUsers />
          <span>Estimated recipients: {recipientCount}</span>
        </div>
        
        {error && (
          <div className="recipient-error">
            {error}
          </div>
        )}
        
        <Button 
          variant="primary" 
          onClick={handleApply}
        >
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};

export default NotificationRecipientFilter;