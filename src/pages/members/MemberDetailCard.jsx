import React from 'react';
import Card from '../ui/Card';
import { FaUser, FaBirthdayCake, FaMapMarker } from 'react-icons/fa';

const MemberDetailCard = ({ member }) => {
  // Calculate age from birth year
  const calculateAge = (birthYear) => {
    if (!birthYear) return 'N/A';
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  return (
    <Card title="Personal Information">
      <div className="detail-grid">
        <div className="detail-item">
          <div className="detail-label">
            <FaUser />
            <span>Full Name</span>
          </div>
          <div className="detail-value">{member.MemberName}</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">
            <FaBirthdayCake />
            <span>Birth Year</span>
          </div>
          <div className="detail-value">
            {member.BirthYear || 'N/A'} 
            {member.BirthYear && <span className="detail-secondary">({calculateAge(member.BirthYear)} years old)</span>}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">
            <span>Gender</span>
          </div>
          <div className="detail-value">{member.gender?.GenderName || 'N/A'}</div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">
            <FaMapMarker />
            <span>Native Place</span>
          </div>
          <div className="detail-value">
            {member.nativePlace ? (
              <>
                {member.nativePlace.PlaceName}
                {member.nativePlace.state && (
                  <span className="detail-secondary">, {member.nativePlace.state.StateName}</span>
                )}
              </>
            ) : (
              'N/A'
            )}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">
            <span>Family Head</span>
          </div>
          <div className="detail-value">
            {member.IsHeadOfFamily ? 'Yes' : 'No'}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">
            <span>Authorized Representative</span>
          </div>
          <div className="detail-value">
            {member.IsAuthorizedRepresentative ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
      
      <h4 className="detail-section-title">Contact Information</h4>
      <div className="detail-grid">
        <div className="detail-item">
          <div className="detail-label">
            <span>Mobile Number</span>
          </div>
          <div className="detail-value">
            {member.MobileNumber ? (
              <a href={`tel:${member.MobileNumber}`}>{member.MobileNumber}</a>
            ) : (
              'N/A'
            )}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">
            <span>Email Address</span>
          </div>
          <div className="detail-value">
            {member.EmailID ? (
              <a href={`mailto:${member.EmailID}`}>{member.EmailID}</a>
            ) : (
              'N/A'
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MemberDetailCard;