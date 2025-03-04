// src/services/authService.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (unauthorized) and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        });
        
        const { token } = response.data.data;
        localStorage.setItem('token', token);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Redirect to login page if in browser context
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Login with username and password
   * @param {string} username - Admin username
   * @param {string} password - Admin password
   * @returns {Promise<Object>} User data and tokens
   */
  async login(username, password) {
    const response = await api.post('/auth/admin/login', {
      username,
      password,
    });
    
    const { accessToken, refreshToken, user } = response.data.data;
    
    // Store tokens
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return { user, token: accessToken };
  },
  
  /**
   * Login for mobile users using OTP
   * @param {string} mobileNumber - User's mobile number
   * @param {string} otp - One-time password
   * @param {Object} deviceInfo - Information about user's device
   * @returns {Promise<Object>} User data and tokens
   */
  async loginWithOtp(mobileNumber, otp, deviceInfo) {
    const response = await api.post('/auth/member/verify-otp', {
      mobileNumber,
      otp,
      deviceInfo,
    });
    
    const { accessToken, refreshToken, member } = response.data.data;
    
    // Store tokens
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return { user: member, token: accessToken };
  },
  
  /**
   * Request OTP for mobile login
   * @param {string} mobileNumber - User's mobile number
   * @returns {Promise<Object>} OTP request result
   */
  async requestOtp(mobileNumber) {
    const response = await api.post('/auth/member/request-otp', {
      mobileNumber,
    });
    
    return response.data.data;
  },
  
  /**
   * Logout the current user
   * @returns {Promise<void>}
   */
  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      // Call logout API if refresh token exists
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored tokens regardless of API success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },
  
  /**
   * Get the current user's information
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
  
  /**
   * Request password reset for admin user
   * @param {string} email - Admin user's email
   * @returns {Promise<Object>} Reset request result
   */
  async resetPassword(email) {
    const response = await api.post('/auth/admin/reset-password', { email });
    return response.data.data;
  },
  
  /**
   * Confirm password reset with token and new password
   * @param {string} token - Reset token from email
   * @param {string} password - New password
   * @returns {Promise<Object>} Reset confirmation result
   */
  async confirmPasswordReset(token, password) {
    const response = await api.post(`/auth/admin/reset-password/${token}`, {
      password,
    });
    return response.data.data;
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  
  /**
   * Get the stored auth token
   * @returns {string|null} Authentication token
   */
  getToken() {
    return localStorage.getItem('token');
  },
  
  /**
   * Update the user's FCM token for push notifications
   * @param {string} fcmToken - Firebase Cloud Messaging token
   * @returns {Promise<Object>} Update result
   */
  async updateFcmToken(fcmToken) {
    const response = await api.post('/auth/update-fcm-token', { fcmToken });
    return response.data.data;
  },
};

export default authService;