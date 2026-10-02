import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { PenSquare, PlusCircle, FileText, LogOut, ArrowLeft, Compass, Megaphone, Settings, HelpCircle } from 'lucide-react';
import api from '../services/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error', err);
    }
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', label: 'Add Blog', icon: PenSquare, exact: true },
    { to: '/admin/add-article', label: 'Add Article', icon: PlusCircle },
    { to: '/admin/articles', label: 'Manage Content', icon: FileText },
    { to: '/admin/interviews', label: 'Interview Q&A', icon: HelpCircle },
    { to: '/admin/advertisement', label: 'Advertisement', icon: Megaphone },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-surface-900 text-text-primary">
      {/* ═══ Sidebar ═══ */}
      <aside className="w-64 bg-surface-800/50 border-r border-white/5 hidden md:flex flex-col backdrop-blur-sm">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs">
              TJ
            </div>
            <span className="text-lg font-bold text-white">
              Tech<span className="text-primary-400">Journey</span>
            </span>
          </Link>
          <p className="text-xs text-text-muted mt-1.5">Blog Manager</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/15'
                  : 'text-text-secondary hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 space-y-1 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm"
          >
            <ArrowLeft size={18} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-text-muted hover:bg-error/8 hover:text-red-400 rounded-xl transition-all text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ═══ Main Content ═══ */}
      <main className="flex-grow flex flex-col min-w-0">
        <header className="h-14 border-b border-white/5 bg-surface-800/30 backdrop-blur-sm flex items-center px-6 justify-between">
          <div className="md:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xs">
                TJ
              </div>
              <span className="font-bold text-white text-sm">
                Tech<span className="text-primary-400">Journey</span>
              </span>
            </Link>
          </div>
          {/* Mobile Nav */}
          <div className="flex md:hidden items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`p-2.5 rounded-lg transition-colors ${active ? 'text-primary-400 bg-primary-500/10' : 'text-text-muted hover:text-white'
                    }`}
                  title={item.label}
                >
                  <Icon size={18} />
                </Link>
              );
            })}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <span className="block text-xs font-semibold text-white">{userInfo?.name || 'User'}</span>
              <span className="block text-[10px] text-text-muted">{userInfo?.role ? `${userInfo.role} Author` : 'Member'}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
