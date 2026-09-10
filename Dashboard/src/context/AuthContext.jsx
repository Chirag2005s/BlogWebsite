import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on mount
    try {
      const stored = localStorage.getItem('dashboardUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed._id && parsed.token) {
          setUser(parsed);
        }
      }
    } catch {
      localStorage.removeItem('dashboardUser');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success && data.data) {
      const userData = data.data;
      // Only allow ADMIN and AUTHOR roles to access dashboard
      if (userData.role !== 'ADMIN' && userData.role !== 'AUTHOR') {
        throw new Error('Access denied. Dashboard is available for Admin and Author roles only.');
      }
      localStorage.setItem('dashboardUser', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    throw new Error('Login failed');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout API errors
    }
    localStorage.removeItem('dashboardUser');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      if (data.success && data.data) {
        const updatedUser = {
          ...user,
          ...data.data,
          token: user?.token,
        };
        localStorage.setItem('dashboardUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch {
      // Ignore profile refresh errors
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
