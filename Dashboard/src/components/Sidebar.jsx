import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlinePencilAlt,
  HiOutlineDocumentText,
  HiOutlineCollection,
  HiOutlineTag,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCode,
} from 'react-icons/hi';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  const mainLinks = [
    { to: '/', icon: HiOutlineViewGrid, label: 'Overview' },
    { to: '/add-blog', icon: HiOutlinePencilAlt, label: 'Add Blog' },
    { to: '/add-article', icon: HiOutlineDocumentText, label: 'Add Article' },
    { to: '/add-programming', icon: HiOutlineCode, label: 'Add Programming' },
    { to: '/content', icon: HiOutlineCollection, label: 'Manage Content' },
    { to: '/categories', icon: HiOutlineTag, label: 'Categories' },
  ];

  const adminLinks = [
    { to: '/users', icon: HiOutlineUsers, label: 'Users' },
  ];

  const accountLinks = [
    { to: '/profile', icon: HiOutlineUser, label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">TJ</div>
        <span className="sidebar-brand-text">TechJourney</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">Main</div>
          {mainLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`sidebar-link ${isActive(link.to) ? 'active' : ''}`}
                end={link.to === '/'}
              >
                <span className="sidebar-link-icon"><Icon /></span>
                <span className="sidebar-link-text">{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {user?.role === 'ADMIN' && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">Administration</div>
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`sidebar-link ${isActive(link.to) ? 'active' : ''}`}
                >
                  <span className="sidebar-link-icon"><Icon /></span>
                  <span className="sidebar-link-text">{link.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        <div className="sidebar-section">
          <div className="sidebar-section-title">Account</div>
          {accountLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`sidebar-link ${isActive(link.to) ? 'active' : ''}`}
              >
                <span className="sidebar-link-icon"><Icon /></span>
                <span className="sidebar-link-text">{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-toggle">
        <button className="sidebar-toggle-btn" onClick={onToggle}>
          {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
