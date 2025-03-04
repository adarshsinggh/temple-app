import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import reducers
// Note: These are placeholder reducers until you create the actual slice files
const authReducer = (state = { user: null, isAuthenticated: false, loading: false }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const membersReducer = (state = { members: [], currentMember: null, loading: false }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const notificationsReducer = (state = { notifications: [], unreadCount: 0, loading: false }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const masterDataReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const dashboardReducer = (state = { stats: null, loading: false }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  members: membersReducer,
  notifications: notificationsReducer,
  masterData: masterDataReducer,
  dashboard: dashboardReducer,
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;