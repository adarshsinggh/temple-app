import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '../../store/slices/masterDataSlice';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { FaSave, FaTimes } from 'react-icons/fa';

const MemberForm = ({ member, onSubmit, onCancel, isSubmitting = false }) => {
  const dispatch = useDispatch();
  const { 
    genders, 
    nativePlaces, 
    educations, 
    occupations, 
    religiousStudies, 
    dikshas,
    families,
    buildings,
    loading: masterDataLoading
  } = useSelector(state => state.masterData);

  const [formData, setFormData] = useState({
    MemberName: '',
    FamilyID: '',
    IsHeadOfFamily: false,
    IsAuthorizedRepresentative: false,
    GenderID: '',
    BirthYear: '',
    MobileNumber: '',
    EmailID: '',
    NativePlaceID: '',
    EducationID: '',
    InstitutionName: '',
    CompletionYear: '',
    OccupationID: '',
    Organization: '',
    Designation: '',
    ReligiousStudyID: '',
    DikshaID: '',
    DikshaDate: '',
    DikshaGuru: '',
    DikshaName: '',
    // Address fields
    BuildingID: '',
    FlatNumber: '',
    Floor: '',
    Wing: '',
    // New family fields if needed
    newFamily: false,
    FamilyCode: '',
    ResidenceLandline: '',
    ...member // Merge with provided member data
  });

  const [errors, setErrors] = useState({});
  const [showNewFamilyForm, setShowNewFamilyForm] = useState(false);

  useEffect(() => {
    dispatch(fetchMasterData([
      'genders', 
      'nativePlaces', 
      'educations', 
      'occupations', 
      'religiousStudies', 
      'dikshas',
      'families',
      'buildings'
    ]));
  }, [dispatch]);

  useEffect(() => {
    if (member) {
      setFormData({
        ...formData,
        ...member,
        // Handle address fields
        BuildingID: member.addresses?.[0]?.BuildingID || '',
        FlatNumber: member.addresses?.[0]?.FlatNumber || '',
        Floor: member.addresses?.[0]?.Floor || '',
        Wing: member.addresses?.[0]?.Wing || '',
      });
    }
  }, [member]);

  useEffect(() => {
    // If no FamilyID is selected, show new family form
    setShowNewFamilyForm(!formData.FamilyID);
  }, [formData.FamilyID]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.MemberName) newErrors.MemberName = 'Name is required';
    if (!formData.GenderID) newErrors.GenderID = 'Gender is required';
    if (!formData.MobileNumber) newErrors.MobileNumber = 'Mobile number is required';
    
    // Mobile validation
    if (formData.MobileNumber && !/^\d{10}$/.test(formData.MobileNumber)) {
      newErrors.MobileNumber = 'Mobile number must be 10 digits';
    }
    
    // Email validation
    if (formData.EmailID && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.EmailID)) {
      newErrors.EmailID = 'Email address is invalid';
    }
    
    // Year validation
    const currentYear = new Date().getFullYear();
    if (formData.BirthYear && (isNaN(formData.BirthYear) || formData.BirthYear < 1900 || formData.BirthYear > currentYear)) {
      newErrors.BirthYear = `Birth year must be between 1900 and ${currentYear}`;
    }
    
    if (formData.CompletionYear && (isNaN(formData.CompletionYear) || formData.CompletionYear < 1950 || formData.CompletionYear > currentYear)) {
      newErrors.CompletionYear = `Completion year must be between 1950 and ${currentYear}`;
    }
    
    // Family validation
    if (!formData.FamilyID && !showNewFamilyForm) {
      newErrors.FamilyID = 'Family is required';
    }
    
    if (showNewFamilyForm) {
      if (!formData.BuildingID) newErrors.BuildingID = 'Building is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.form-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (masterDataLoading && !member) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="member-form">
      <Card title="Personal Information">
        <div className="form-grid">
          <FormInput
            id="memberName"
            name="MemberName"
            label="Full Name"
            value={formData.MemberName || ''}
            onChange={handleChange}
            error={errors.MemberName}
            required
          />
          
          <FormSelect
            id="gender"
            name="GenderID"
            label="Gender"
            value={formData.GenderID || ''}
            onChange={handleChange}
            options={genders?.map(gender => ({
              value: gender.RecCode,
              label: gender.GenderName
            })) || []}
            error={errors.GenderID}
            required
          />
          
          <FormInput
            id="birthYear"
            name="BirthYear"
            label="Birth Year"
            type="number"
            value={formData.BirthYear || ''}
            onChange={handleChange}
            error={errors.BirthYear}
          />
          
          <FormSelect
            id="nativePlace"
            name="NativePlaceID"
            label="Native Place"
            value={formData.NativePlaceID || ''}
            onChange={handleChange}
            options={nativePlaces?.map(place => ({
              value: place.RecCode,
              label: `${place.PlaceName}${place.state ? `, ${place.state.StateName}` : ''}`
            })) || []}
            error={errors.NativePlaceID}
          />
        </div>
        
        <div className="form-row">
          <div className="form-check">
            <input
              id="isHeadOfFamily"
              name="IsHeadOfFamily"
              type="checkbox"
              checked={formData.IsHeadOfFamily || false}
              onChange={handleChange}
              className="form-check-input"
            />
            <label htmlFor="isHeadOfFamily" className="form-check-label">
              Head of Family
            </label>
          </div>
          
          <div className="form-check">
            <input
              id="isAuthorizedRepresentative"
              name="IsAuthorizedRepresentative"
              type="checkbox"
              checked={formData.IsAuthorizedRepresentative || false}
              onChange={handleChange}
              className="form-check-input"
            />
            <label htmlFor="isAuthorizedRepresentative" className="form-check-label">
              Authorized Representative
            </label>
          </div>
        </div>
      </Card>
      
      <Card title="Contact Information">
        <div className="form-grid">
          <FormInput
            id="mobileNumber"
            name="MobileNumber"
            label="Mobile Number"
            type="tel"
            value={formData.MobileNumber || ''}
            onChange={handleChange}
            error={errors.MobileNumber}
            required
            hint="10-digit mobile number"
          />
          
          <FormInput
            id="emailId"
            name="EmailID"
            label="Email Address"
            type="email"
            value={formData.EmailID || ''}
            onChange={handleChange}
            error={errors.EmailID}
          />
        </div>
      </Card>
      
      <Card title="Family Information">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Family</label>
            <div className="form-radio-group">
              <div className="form-radio">
                <input
                  id="existingFamilyRadio"
                  type="radio"
                  name="newFamily"
                  checked={!formData.newFamily}
                  onChange={() => setFormData({...formData, newFamily: false})}
                />
                <label htmlFor="existingFamilyRadio">Existing Family</label>
              </div>
              <div className="form-radio">
                <input
                  id="newFamilyRadio"
                  type="radio"
                  name="newFamily"
                  checked={formData.newFamily}
                  onChange={() => setFormData({...formData, newFamily: true, FamilyID: ''})}
                />
                <label htmlFor="newFamilyRadio">Create New Family</label>
              </div>
            </div>
          </div>
          
          {!formData.newFamily ? (
            <FormSelect
              id="familyId"
              name="FamilyID"
              label="Select Family"
              value={formData.FamilyID || ''}
              onChange={handleChange}
              options={families?.map(family => {
                const headName = family.headOfFamily?.MemberName || 'No head';
                return {
                  value: family.RecCode,
                  label: `${family.FamilyCode} - ${headName}`
                };
              }) || []}
              error={errors.FamilyID}
              required={!formData.newFamily}
            />
          ) : (
            <>
              <FormInput
                id="familyCode"
                name="FamilyCode"
                label="Family Code"
                value={formData.FamilyCode || ''}
                onChange={handleChange}
                error={errors.FamilyCode}
                hint="Leave blank for auto-generation"
              />
              
              <FormInput
                id="residenceLandline"
                name="ResidenceLandline"
                label="Residence Landline"
                value={formData.ResidenceLandline || ''}
                onChange={handleChange}
                error={errors.ResidenceLandline}
              />
              
              <FormSelect
                id="buildingId"
                name="BuildingID"
                label="Building"
                value={formData.BuildingID || ''}
                onChange={handleChange}
                options={buildings?.map(building => ({
                  value: building.RecCode,
                  label: `${building.BuildingName}${building.area ? ` (${building.area.AreaName})` : ''}`
                })) || []}
                error={errors.BuildingID}
                required={formData.newFamily}
              />
              
              <FormInput
                id="flatNumber"
                name="FlatNumber"
                label="Flat Number"
                value={formData.FlatNumber || ''}
                onChange={handleChange}
                error={errors.FlatNumber}
              />
              
              <FormInput
                id="floor"
                name="Floor"
                label="Floor"
                value={formData.Floor || ''}
                onChange={handleChange}
                error={errors.Floor}
              />
              
              <FormInput
                id="wing"
                name="Wing"
                label="Wing"
                value={formData.Wing || ''}
                onChange={handleChange}
                error={errors.Wing}
              />
            </>
          )}
        </div>
      </Card>
      
      <Card title="Religious Information">
        <div className="form-grid">
          <FormSelect
            id="religiousStudy"
            name="ReligiousStudyID"
            label="Religious Study"
            value={formData.ReligiousStudyID || ''}
            onChange={handleChange}
            options={religiousStudies?.map(study => ({
              value: study.RecCode,
              label: `${study.StudyName} - ${study.StudyLevel}`
            })) || []}
            error={errors.ReligiousStudyID}
          />
          
          <FormSelect
            id="diksha"
            name="DikshaID"
            label="Diksha"
            value={formData.DikshaID || ''}
            onChange={handleChange}
            options={dikshas?.map(diksha => ({
              value: diksha.RecCode,
              label: `${diksha.DikshaName} - ${diksha.DikshaType}`
            })) || []}
            error={errors.DikshaID}
          />
          
          <FormInput
            id="dikshaDate"
            name="DikshaDate"
            label="Diksha Date"
            type="date"
            value={formData.DikshaDate ? new Date(formData.DikshaDate).toISOString().substr(0, 10) : ''}
            onChange={handleChange}
            error={errors.DikshaDate}
          />
          
          <FormInput
            id="dikshaGuru"
            name="DikshaGuru"
            label="Diksha Guru"
            value={formData.DikshaGuru || ''}
            onChange={handleChange}
            error={errors.DikshaGuru}
          />
          
          <FormInput
            id="dikshaName"
            name="DikshaName"
            label="Diksha Given Name"
            value={formData.DikshaName || ''}
            onChange={handleChange}
            error={errors.DikshaName}
          />
        </div>
      </Card>
      
      <Card title="Education & Occupation">
        <div className="form-grid">
          <FormSelect
            id="education"
            name="EducationID"
            label="Education Level"
            value={formData.EducationID || ''}
            onChange={handleChange}
            options={educations?.map(education => ({
              value: education.RecCode,
              label: `${education.EducationLevel} - ${education.EducationType}`
            })) || []}
            error={errors.EducationID}
          />
          
          <FormInput
            id="institutionName"
            name="InstitutionName"
            label="Institution Name"
            value={formData.InstitutionName || ''}
            onChange={handleChange}
            error={errors.InstitutionName}
          />
          
          <FormInput
            id="completionYear"
            name="CompletionYear"
            label="Completion Year"
            type="number"
            value={formData.CompletionYear || ''}
            onChange={handleChange}
            error={errors.CompletionYear}
          />
          
          <FormSelect
            id="occupation"
            name="OccupationID"
            label="Occupation"
            value={formData.OccupationID || ''}
            onChange={handleChange}
            options={occupations?.map(occupation => ({
              value: occupation.RecCode,
              label: `${occupation.OccupationName}${occupation.category ? ` (${occupation.category.CategoryName})` : ''}`
            })) || []}
            error={errors.OccupationID}
          />
          
          <FormInput
            id="organization"
            name="Organization"
            label="Organization"
            value={formData.Organization || ''}
            onChange={handleChange}
            error={errors.Organization}
          />
          
          <FormInput
            id="designation"
            name="Designation"
            label="Designation"
            value={formData.Designation || ''}
            onChange={handleChange}
            error={errors.Designation}
          />
        </div>
      </Card>
      
      <div className="form-actions">
        <Button 
          variant="light" 
          icon={<FaTimes />} 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          icon={<FaSave />}
          loading={isSubmitting}
        >
          {member ? 'Update Member' : 'Save Member'}
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;