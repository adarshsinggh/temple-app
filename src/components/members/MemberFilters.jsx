import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '../../store/slices/masterDataSlice';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import Button from '../ui/Button';
import { FaTimes } from 'react-icons/fa';

const MemberFilters = ({ filters, onChange, onClose }) => {
  const dispatch = useDispatch();
  const { genders, religiousStudies, areas, buildings } = useSelector(state => state.masterData);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  useEffect(() => {
    dispatch(fetchMasterData(['genders', 'religiousStudies', 'areas', 'buildings']));
  }, [dispatch]);

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
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
        <h3>Filter Members</h3>
        <button className="filter-close" onClick={onClose} aria-label="Close filters">
          <FaTimes />
        </button>
      </div>
      
      <div className="filter-body">
        <div className="filter-grid">
          <FormSelect
            id="familyFilter"
            label="Has Family"
            value={localFilters.hasFamily || ''}
            onChange={(e) => handleChange('hasFamily', e.target.value)}
            options={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]}
          />
          
          <FormSelect
            id="genderFilter"
            label="Gender"
            value={localFilters.genderId || ''}
            onChange={(e) => handleChange('genderId', e.target.value)}
            options={genders?.map(gender => ({
              value: gender.RecCode,
              label: gender.GenderName
            })) || []}
          />
          
          <FormSelect
            id="familyHeadFilter"
            label="Family Head"
            value={localFilters.isHeadOfFamily || ''}
            onChange={(e) => handleChange('isHeadOfFamily', e.target.value)}
            options={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]}
          />
          
          <FormSelect
            id="religiousStudyFilter"
            label="Religious Study"
            value={localFilters.religiousStudyId || ''}
            onChange={(e) => handleChange('religiousStudyId', e.target.value)}
            options={religiousStudies?.map(study => ({
              value: study.RecCode,
              label: study.StudyName
            })) || []}
          />
          
          <FormSelect
            id="areaFilter"
            label="Area"
            value={localFilters.areaId || ''}
            onChange={(e) => handleChange('areaId', e.target.value)}
            options={areas?.map(area => ({
              value: area.RecCode,
              label: area.AreaName
            })) || []}
          />
          
          <FormSelect
            id="buildingFilter"
            label="Building"
            value={localFilters.buildingId || ''}
            onChange={(e) => handleChange('buildingId', e.target.value)}
            options={buildings?.map(building => ({
              value: building.RecCode,
              label: building.BuildingName
            })) || []}
          />
          
          <div className="age-range-filter">
            <label className="form-label">Age Range</label>
            <div className="age-inputs">
              <FormInput
                id="minAgeFilter"
                placeholder="Min"
                type="number"
                min="0"
                value={localFilters.minAge || ''}
                onChange={(e) => handleChange('minAge', e.target.value)}
              />
              <span className="age-separator">to</span>
              <FormInput
                id="maxAgeFilter"
                placeholder="Max"
                type="number"
                min="0"
                value={localFilters.maxAge || ''}
                onChange={(e) => handleChange('maxAge', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="filter-footer">
        <Button variant="light" onClick={handleReset}>Reset</Button>
        <Button variant="primary" onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default MemberFilters;