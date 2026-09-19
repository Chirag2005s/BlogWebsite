import axios from 'axios';

const DEPLOYED_BACKEND_URL = 'https://blogwebsite-y8o6.onrender.com';


// Dynamically determine the base API URL:
// 1. If VITE_API_URL is set in environment, use it.
// 2. In production, default to the deployed Render backend URL.
// 3. In local development without VITE_API_URL, default to '/api' (proxied by Vite).
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  if (import.meta.env.PROD) {
    return `${DEPLOYED_BACKEND_URL}/api`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('userInfo');
    if (raw) {
      const userInfo = JSON.parse(raw);
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    }
  } catch (err) {
    // Ignore JSON parse error
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.warn('⚠️ Network Error: Unable to connect to backend server. Please verify backend deployment and CORS settings.');
    } else if (error.response && error.response.status === 503) {
      console.warn('⚠️ Service Unavailable (503): Database connection is not ready on backend. Please set MONGO_URI in Render Environment Variables.');
    }
    return Promise.reject(error);
  }
);

export default api;



