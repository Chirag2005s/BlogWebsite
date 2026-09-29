import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return userInfo ? children : null;
};

export default ProtectedRoute;
