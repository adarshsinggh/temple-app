// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Admin Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import MembersPage from './pages/members/MembersPage';
import MemberDetailPage from './pages/members/MemberDetailPage';
import AddMemberPage from './pages/members/AddMemberPage';
import EditMemberPage from './pages/members/EditMemberPage';
import FamiliesPage from './pages/families/FamiliesPage';
import FamilyDetailPage from './pages/families/FamilyDetailPage';
import AddFamilyPage from './pages/families/AddFamilyPage';
import EditFamilyPage from './pages/families/EditFamilyPage';
import BuildingsPage from './pages/buildings/BuildingsPage';
import BuildingDetailPage from './pages/buildings/BuildingDetailPage';
import AddBuildingPage from './pages/buildings/AddBuildingPage';
import EditBuildingPage from './pages/buildings/EditBuildingPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import NotificationDetailPage from './pages/notifications/NotificationDetailPage';
import ComposeNotificationPage from './pages/notifications/ComposeNotificationPage';
import MasterDataPage from './pages/masterdata/MasterDataPage';
import ProfilePage from './pages/profile/ProfilePage';

// Guards
import PrivateRoute from './components/auth/PrivateRoute';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                
                {/* Admin Routes */}
                <Route 
                  path="/" 
                  element={
                    <PrivateRoute>
                      <AdminLayout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  
                  {/* Member Routes */}
                  <Route path="members" element={<MembersPage />} />
                  <Route path="members/add" element={<AddMemberPage />} />
                  <Route path="members/:id" element={<MemberDetailPage />} />
                  <Route path="members/:id/edit" element={<EditMemberPage />} />
                  
                  {/* Family Routes */}
                  <Route path="families" element={<FamiliesPage />} />
                  <Route path="families/add" element={<AddFamilyPage />} />
                  <Route path="families/:id" element={<FamilyDetailPage />} />
                  <Route path="families/:id/edit" element={<EditFamilyPage />} />
                  
                  {/* Building Routes */}
                  <Route path="buildings" element={<BuildingsPage />} />
                  <Route path="buildings/add" element={<AddBuildingPage />} />
                  <Route path="buildings/:id" element={<BuildingDetailPage />} />
                  <Route path="buildings/:id/edit" element={<EditBuildingPage />} />
                  
                  {/* Notification Routes */}
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="notifications/compose" element={<ComposeNotificationPage />} />
                  <Route path="notifications/:id" element={<NotificationDetailPage />} />
                  
                  {/* Master Data Routes */}
                  <Route path="master-data" element={<MasterDataPage />} />
                  <Route path="master-data/:type" element={<MasterDataPage />} />
                  
                  {/* Profile Routes */}
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
                
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;