import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, BookOpen, Newspaper, PenTool, LogOut, User, ChevronRight } from 'lucide-react';
import api from '../services/api';

const MainLayout = () => {
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error', err);
    }
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'Blog' },
    { to: '/articles', label: 'Articles' },
    { to: '/programming', label: 'Programming' },
    { to: '/news', label: 'Tech News' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-900 text-text-primary">
      {/* ═══ NAVBAR ═══ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong py-3 shadow-lg shadow-black/20'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
              TJ
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Tech<span className="text-primary-400">Journey</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {userInfo ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 transition-all"
                >
                  <PenTool size={14} />
                  Write
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white">
                    {userInfo.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-text-secondary hidden lg:inline">{userInfo.name}</span>
                  <button
                    onClick={handleLogout}
                    className="ml-1 p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30"
              >
                <User size={14} />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ═══ MOBILE MENU ═══ */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong mt-2 mx-4 rounded-xl overflow-hidden animate-slide-down">
            <nav className="p-3 space-y-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span>{link.label}</span>
                  <ChevronRight size={14} className="opacity-40" />
                </Link>
              ))}
            </nav>
            <div className="p-3 pt-0 border-t border-white/5 mt-1">
              {userInfo ? (
                <div className="space-y-2">
                  <Link
                    to="/admin"
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <PenTool size={14} />
                      Write Blog/Article
                    </span>
                    <ChevronRight size={14} className="opacity-40" />
                  </Link>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white">
                        {userInfo.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-text-secondary">{userInfo.name}</span>
                    </div>
                    <button onClick={handleLogout} className="text-sm text-error hover:text-red-400">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block text-center px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors mt-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Outlet />
        </div>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 bg-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                  TJ
                </div>
                <span className="text-lg font-bold text-white">
                  Tech<span className="text-primary-400">Journey</span>
                </span>
              </Link>
              <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
                A personal developer blog and technology hub. Development knowledge, real project experiences, debugging solutions, and the latest technology discoveries.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Navigation</h4>
              <ul className="space-y-2.5">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Blog', path: '/blog' },
                  { name: 'Articles', path: '/articles' },
                  { name: 'Programming', path: '/programming' },
                  { name: 'Tech News', path: '/news' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-sm text-text-secondary hover:text-primary-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'Python'].map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} TechJourney. Crafted with passion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
