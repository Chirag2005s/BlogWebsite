import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineExternalLink } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Header = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className={`dashboard-header ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <div>
          <div className="header-title">Dashboard</div>
          <div className="header-subtitle">TechJourney CMS</div>
        </div>
      </div>

      <div className="header-right">
        <a
          href="https://blog-website-eight-drab.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="header-btn"
          title="Visit Website"
        >
          <HiOutlineExternalLink />
        </a>

        <button className="header-btn" onClick={handleLogout} title="Logout">
          <HiOutlineLogout />
        </button>

        <div className="header-user" onClick={() => navigate('/profile')}>
          <div className="header-avatar">
            {getInitials(user?.name)}
          </div>
          <div className="header-user-info">
            <div className="header-user-name">{user?.name || 'User'}</div>
            <div className="header-user-role">{user?.role || 'AUTHOR'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
