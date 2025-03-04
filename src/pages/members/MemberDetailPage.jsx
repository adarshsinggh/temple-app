import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMemberById } from '../../store/slices/memberSlice';
import { FaEdit, FaArrowLeft, FaPhone, FaEnvelope, FaHome, FaUser, FaUsers, FaBookReader } from 'react-icons/fa';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MemberDetailCard from '../../components/members/MemberDetailCard';
import MemberFamilyCard from '../../components/members/MemberFamilyCard';
import MemberAddressCard from '../../components/members/MemberAddressCard';
import MemberReligiousInfoCard from '../../components/members/MemberReligiousInfoCard';
import MemberEducationCard from '../../components/members/MemberEducationCard';

const MemberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentMember, loading, error } = useSelector(state => state.members);

  useEffect(() => {
    if (id) {
      dispatch(fetchMemberById(id));
    }
  }, [dispatch, id]);

  if (loading && !currentMember) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading member details</h2>
        <p>{error}</p>
        <Button onClick={() => dispatch(fetchMemberById(id))}>Retry</Button>
        <Button variant="light" onClick={() => navigate('/members')}>
          Back to Members
        </Button>
      </div>
    );
  }

  if (!currentMember) {
    return (
      <div className="not-found-container">
        <h2>Member Not Found</h2>
        <p>The member you are looking for does not exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/members')}>
          Back to Members
        </Button>
      </div>
    );
  }

  return (
    <div className="member-detail-page">
      <div className="page-header">
        <div className="header-back">
          <Button 
            variant="light" 
            icon={<FaArrowLeft />} 
            onClick={() => navigate('/members')}
          >
            Back to Members
          </Button>
        </div>
        <div className="header-title">
          <h1>
            {currentMember.MemberName}
            {currentMember.IsHeadOfFamily && (
              <span className="badge badge-family-head">Family Head</span>
            )}
          </h1>
          <div className="member-quick-info">
            {currentMember.MobileNumber && (
              <div className="quick-info-item">
                <FaPhone />
                <span>{currentMember.MobileNumber}</span>
              </div>
            )}
            {currentMember.EmailID && (
              <div className="quick-info-item">
                <FaEnvelope />
                <span>{currentMember.EmailID}</span>
              </div>
            )}
            {currentMember.family?.FamilyCode && (
              <div className="quick-info-item">
                <FaUsers />
                <span>Family: {currentMember.family.FamilyCode}</span>
              </div>
            )}
          </div>
        </div>
        <div className="header-actions">
          <Button 
            variant="primary" 
            icon={<FaEdit />} 
            onClick={() => navigate(`/members/${id}/edit`)}
          >
            Edit Member
          </Button>
        </div>
      </div>

      <div className="member-detail-content">
        <div className="member-detail-main">
          <Tabs>
            <Tabs.Tab id="personal" label="Personal Info" icon={<FaUser />}>
              <MemberDetailCard member={currentMember} />
            </Tabs.Tab>
            <Tabs.Tab id="family" label="Family" icon={<FaUsers />}>
              <MemberFamilyCard member={currentMember} />
            </Tabs.Tab>
            <Tabs.Tab id="address" label="Address" icon={<FaHome />}>
              <MemberAddressCard member={currentMember} />
            </Tabs.Tab>
            <Tabs.Tab id="religious" label="Religious Info" icon={<FaBookReader />}>
              <MemberReligiousInfoCard member={currentMember} />
            </Tabs.Tab>
            <Tabs.Tab id="education" label="Education & Work">
              <MemberEducationCard member={currentMember} />
            </Tabs.Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage;