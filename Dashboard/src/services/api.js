import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('dashboardUser');
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

// Auto-handle 401 responses (session expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('dashboardUser');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
