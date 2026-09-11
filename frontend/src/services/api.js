import axios from 'axios';

const RENDER_BACKEND_URL = 'https://blogwebsite-vb09.onrender.com';

// Dynamically determine the base API URL:
// 1. If VITE_API_URL is set in environment, use it.
// 2. Otherwise default directly to deployed Render backend: https://blogwebsite-vb09.onrender.com/api
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  return `${RENDER_BACKEND_URL}/api`;
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

export default api;
