import axios from 'axios';

// Use environment variable if provided, fallback to relative path (handled by Nginx in production or Vite in dev)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Intercept requests to automatically add Authorization header
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Intercept responses to handle 401 Unauthorized globally
axiosClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // If the API returns a 401 Unauthorized, we clear the token and force a reload/redirect
    // Only do this if we are not already on the login/register pages
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default axiosClient;
