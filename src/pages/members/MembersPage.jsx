import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers, setMemberFilters } from '../../store/slices/memberSlice';
import { FaPlus, FaSearch, FaFilter, FaFilePdf, FaFileExcel } from 'react-icons/fa';

import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import SearchInput from '../../components/ui/SearchInput';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MemberFilters from '../../components/members/MemberFilters';

const MembersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { members, totalMembers, loading, error, filters, page, limit } = useSelector(state => state.members);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchMembers({ page, limit, ...filters }));
  }, [dispatch, page, limit, filters]);

  const handleSearch = (searchText) => {
    dispatch(setMemberFilters({ ...filters, search: searchText, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setMemberFilters({ ...filters, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setMemberFilters({ ...filters, page: newPage }));
  };

  const handleRowClick = (member) => {
    navigate(`/members/${member.RecCode}`);
  };

  const handleExport = (format) => {
    // Implement export functionality
    console.log(`Exporting in ${format} format`);
  };

  const columns = [
    {
      header: 'Name',
      field: 'MemberName',
      render: (row) => (
        <div className="member-name-cell">
          <span className="member-name">{row.MemberName}</span>
          {row.IsHeadOfFamily && (
            <span className="badge badge-family-head" title="Family Head">FH</span>
          )}
        </div>
      )
    },
    {
      header: 'Family Code',
      field: 'FamilyCode',
      render: (row) => row.family?.FamilyCode || '-'
    },
    {
      header: 'Mobile',
      field: 'MobileNumber',
    },
    {
      header: 'Area',
      render: (row) => {
        if (row.addresses && row.addresses.length > 0) {
          const currentAddress = row.addresses.find(addr => addr.IsCurrentAddress);
          if (currentAddress && currentAddress.building) {
            return currentAddress.building.area.AreaName;
          }
        }
        return '-';
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="table-actions">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/members/${row.RecCode}/edit`);
            }}
          >
            Edit
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="members-page">
      <div className="page-header">
        <h1>Members</h1>
        <div className="page-actions">
          <Button 
            variant="primary" 
            icon={<FaPlus />} 
            onClick={() => navigate('/members/add')}
          >
            Add Member
          </Button>
        </div>
      </div>

      <Card>
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <SearchInput 
              placeholder="Search members..."
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
          <div className="table-toolbar-right">
            <Button 
              variant="outline" 
              icon={<FaFilePdf />} 
              onClick={() => handleExport('pdf')}
            >
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              icon={<FaFileExcel />} 
              onClick={() => handleExport('excel')}
            >
              Export Excel
            </Button>
          </div>
        </div>

        {showFilters && (
          <MemberFilters 
            filters={filters} 
            onChange={handleFilterChange} 
            onClose={() => setShowFilters(false)}
          />
        )}

        {loading && !members.length ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <Button onClick={() => dispatch(fetchMembers({ page, limit, ...filters }))}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <Table 
              columns={columns} 
              data={members} 
              keyField="RecCode"
              onRowClick={handleRowClick}
              loading={loading}
              emptyMessage="No members found. Try adjusting your filters or add a new member."
            />
            
            <Pagination 
              currentPage={page} 
              totalPages={Math.ceil(totalMembers / limit)}
              totalItems={totalMembers}
              pageSize={limit}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default MembersPage;