import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import Card from '../../components/ui/Card';
import MembersByCategoryChart from '../../components/dashboard/MembersByCategoryChart';
import MembersByAgeGroupChart from '../../components/dashboard/MembersByAgeGroupChart';
import MembersByAreaChart from '../../components/dashboard/MembersByAreaChart';
import StatCard from '../../components/dashboard/StatCard';
import RecentNotifications from '../../components/dashboard/RecentNotifications';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading && !stats) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading dashboard data</h2>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchDashboardStats())}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      
      <div className="stat-cards-grid">
        <StatCard 
          title="Total Members" 
          value={stats?.memberStats?.totalMembers || 0} 
          icon="users"
          trend={5}
          trendLabel="from last month"
        />
        <StatCard 
          title="Total Families" 
          value={stats?.memberStats?.totalFamilies || 0} 
          icon="home"
          trend={2}
          trendLabel="from last month"
        />
        <StatCard 
          title="Total Buildings" 
          value={stats?.locationStats?.totalBuildings || 0} 
          icon="building"
          trend={0}
          trendLabel="unchanged"
        />
        <StatCard 
          title="Notifications Sent" 
          value={stats?.notificationStats?.totalSent || 0} 
          icon="bell"
          trend={10}
          trendLabel="from last month"
        />
      </div>
      
      <div className="dashboard-charts-grid">
        <Card title="Members by Area" className="chart-card">
          <MembersByAreaChart data={stats?.locationStats?.membersByArea || []} />
        </Card>
        <Card title="Members by Age Group" className="chart-card">
          <MembersByAgeGroupChart data={stats?.memberStats?.membersByAgeGroup || []} />
        </Card>
        <Card title="Members by Religious Study Level" className="chart-card">
          <MembersByCategoryChart 
            data={stats?.religiousStats?.membersByReligiousStudy || []}
            dataKey="study"
            valueKey="count"
          />
        </Card>
      </div>
      
      <div className="dashboard-bottom-section">
        <Card title="Recent Notifications" className="recent-notifications-card">
          <RecentNotifications />
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;