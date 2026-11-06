import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation, useOutlet } from 'react-router-dom';
import {
  Menu, X, Search, ChevronRight,
  PenTool, LogOut, ChevronDown, FileText, PlusCircle,
  User, Code2, Sparkles, Shield, FolderGit2, ArrowUp
} from 'lucide-react';

const GithubIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);
import TechJourneyLogo from '../components/TechJourneyLogo';
import SearchModal from '../components/SearchModal';
import LoginModal from '../components/LoginModal';
import api from '../services/api';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentOutlet = useOutlet();
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [userInfo, setUserInfo] = useState(() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Keep userInfo synchronized across tab and profile updates
  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const raw = localStorage.getItem('userInfo');
        setUserInfo(raw ? JSON.parse(raw) : null);
      } catch {
        setUserInfo(null);
      }
    };
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // High-performance rAF-throttled scroll handler (only re-renders on threshold crossings)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled((prev) => {
            const next = y > 20;
            return prev === next ? prev : next;
          });
          setShowScrollTop((prev) => {
            const next = y > 350;
            return prev === next ? prev : next;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu, dropdowns and sync auth state on route change
  useEffect(() => {
    try {
      const raw = localStorage.getItem('userInfo');
      setUserInfo(raw ? JSON.parse(raw) : null);
    } catch {
      setUserInfo(null);
    }
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error', err);
    }
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setUserMenuOpen(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'Blog' },
    { to: '/articles', label: 'Articles' },
    // { to: '/programming', label: 'Programming' },
    { to: '/problemhub', label: 'Problem', requiresLogin: true },
    { to: '/projecthub', label: 'Project Hub', requiresLogin: true },
    // { to: '/roadmaps', label: 'Roadmaps', requiresLogin: true },
    { to: '/interview-questions', label: 'Interview', requiresLogin: true },
    { to: '/news', label: 'Tech News' },
  ];

  const handleNavClick = (e, link) => {
    if (link.requiresLogin && !userInfo) {
      e.preventDefault();
      setLoginModalOpen(true);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/blog') {
      return location.pathname === '/blog' || location.pathname.startsWith('/blog/');
    }
    if (path === '/articles') {
      return (
        location.pathname === '/articles' ||
        location.pathname.startsWith('/articles/') ||
        location.pathname.startsWith('/article/')
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-page text-heading selection:bg-[#0F6B4F] selection:text-white">
      {/* ═══ STICKY RESPONSIVE NAVBAR ═══ */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
          ? 'bg-nav backdrop-blur-xl border-b border-line py-3 shadow-lg shadow-black/10'
          : 'bg-transparent py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          {/* TechJourney Logo */}
          <Link to="/" className="group focus:outline-none">
            <TechJourneyLogo size={36} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-card/80 px-1.5 py-1.5 rounded-2xl border border-line backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${active
                    ? 'text-white bg-gradient-to-r from-[#0F6B4F] to-[#16805E] shadow-sm font-semibold'
                    : 'text-muted hover:text-heading hover:bg-soft'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Trigger Button (Ctrl + K) */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-card hover:bg-soft border border-line text-xs text-muted hover:text-heading transition-all shadow-sm group"
              title="Search TechJourney (Ctrl + K)"
            >
              <Search size={14} className="text-[#0F6B4F] group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline">Search...</span>
              <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-muted bg-page border border-line rounded">
                Ctrl K
              </kbd>
            </button>

            {/* Session / Sign In */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-line">
              {userInfo ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-2xl border transition-all shadow-sm group ${userMenuOpen
                      ? 'bg-soft border-[#0F6B4F] ring-2 ring-[#0F6B4F]/20'
                      : 'bg-card/90 hover:bg-soft border-line hover:border-[#0F6B4F]/50'
                      }`}
                    aria-expanded={userMenuOpen}
                    title="User Profile & Settings"
                  >
                    {/* Avatar with active online indicator */}
                    <div className="relative flex-shrink-0">
                      {userInfo.profileImage ? (
                        <img
                          src={userInfo.profileImage}
                          alt={userInfo.name}
                          className="w-7 h-7 rounded-xl object-cover border border-line"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#0F6B4F] via-[#16805E] to-[#2BAF85] flex items-center justify-center text-xs font-black text-white shadow-sm group-hover:scale-105 transition-transform">
                          {userInfo.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-card ring-1 ring-emerald-400/40" />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-heading group-hover:text-[#4FD1A5] max-w-[110px] truncate leading-tight transition-colors">
                        {userInfo.name}
                      </span>
                      <span className="text-[9px] font-mono text-muted uppercase tracking-wider leading-none mt-0.5">
                        {userInfo.role || 'USER'}
                      </span>
                    </div>

                    <ChevronDown
                      size={12}
                      className={`text-muted group-hover:text-heading transition-transform duration-200 ml-0.5 ${userMenuOpen ? 'rotate-180 text-[#4FD1A5]' : ''
                        }`}
                    />
                  </button>

                  {/* Upgraded Floating Profile Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-card border border-line shadow-2xl shadow-black/40 py-2.5 z-50 backdrop-blur-2xl animate-fade-in divide-y divide-line/60">
                      {/* User Header Card */}
                      <div className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F6B4F] to-[#2BAF85] flex items-center justify-center text-sm font-extrabold text-white shadow-md overflow-hidden shrink-0">
                            {userInfo.profileImage ? (
                              <img src={userInfo.profileImage} alt={userInfo.name} className="w-full h-full object-cover" />
                            ) : (
                              userInfo.name?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-heading truncate">{userInfo.name}</p>
                            <p className="text-[11px] text-muted truncate">{userInfo.email || `@${userInfo.username || 'user'}`}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-[#0F6B4F]/15 text-[#4FD1A5] border border-[#0F6B4F]/30">
                                {userInfo.role || 'MEMBER'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="py-1.5 space-y-0.5 px-1.5">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-heading hover:bg-soft hover:text-[#4FD1A5] transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#0F6B4F]/10 border border-[#0F6B4F]/20 flex items-center justify-center text-[#4FD1A5] group-hover:scale-105 transition-transform">
                            <User size={14} />
                          </div>
                          <div>
                            <div className="font-semibold text-heading group-hover:text-[#4FD1A5]">My Profile</div>
                            <div className="text-[10px] text-muted">View and edit your profile</div>
                          </div>
                        </Link>

                        <Link
                          to="/problemhub/my-problems"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-heading hover:bg-soft hover:text-blue-400 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                            <Code2 size={14} />
                          </div>
                          <div>
                            <div className="font-semibold text-heading group-hover:text-blue-400">My ProblemHub</div>
                            <div className="text-[10px] text-muted">View posted problems & stats</div>
                          </div>
                        </Link>

                        <Link
                          to="/projecthub/my-projects"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-heading hover:bg-soft hover:text-emerald-400 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                            <FolderGit2 size={14} />
                          </div>
                          <div>
                            <div className="font-semibold text-heading group-hover:text-emerald-400">My ProjectHub</div>
                            <div className="text-[10px] text-muted">Manage projects & bookmarks</div>
                          </div>
                        </Link>

                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-heading hover:bg-soft hover:text-[#F4A62A] transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#F4A62A]/10 border border-[#F4A62A]/20 flex items-center justify-center text-[#F4A62A] group-hover:scale-105 transition-transform">
                            <PenTool size={14} />
                          </div>
                          <div>
                            <div className="font-semibold text-heading group-hover:text-[#F4A62A]">Content Studio</div>
                            <div className="text-[10px] text-muted">Manage blogs & publications</div>
                          </div>
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="pt-1.5 px-1.5">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                            <LogOut size={14} />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl bg-[#0F6B4F] hover:bg-[#0C5A42] text-white text-xs font-semibold border border-[#0F6B4F] transition-all shadow-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex md:hidden items-center gap-2.5">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 rounded-xl bg-card border border-line text-muted hover:text-heading"
              aria-label="Open search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-card border border-line text-muted hover:text-heading"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ═══ MOBILE MENU DRAWER ═══ */}
        {mobileMenuOpen && (
          <div className="lg:hidden mx-4 mt-3 p-4 rounded-2xl bg-card border border-line shadow-2xl shadow-black/20 animate-slide-down">
            <nav className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(link.to)
                    ? 'text-white bg-gradient-to-r from-[#0F6B4F] to-[#16805E] font-semibold'
                    : 'text-muted hover:text-heading hover:bg-soft'
                    }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight size={14} className="opacity-40" />
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-line flex items-center justify-between gap-3">
              <a
                href="https://github.com/Chirag2005s/BlogWebsite"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted hover:text-heading"
              >
                <GithubIcon size={16} />
                <span>GitHub</span>
              </a>

              {userInfo ? (
                <div className="flex flex-col gap-2.5 w-full pt-2">
                  <div className="p-3 rounded-2xl bg-soft border border-line flex items-center justify-between gap-3">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 min-w-0"
                    >
                      <div className="relative">
                        {userInfo.profileImage ? (
                          <img
                            src={userInfo.profileImage}
                            alt={userInfo.name}
                            className="w-8 h-8 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0F6B4F] to-[#2BAF85] flex items-center justify-center text-xs font-bold text-white">
                            {userInfo.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-card" />
                      </div>
                      <div className="min-w-0 text-left">
                        <div className="text-xs font-bold text-heading truncate">{userInfo.name}</div>
                        <div className="text-[10px] text-[#4FD1A5] font-mono uppercase tracking-wider">{userInfo.role || 'MEMBER'}</div>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2 py-2 text-center rounded-xl bg-soft text-[11px] text-[#4FD1A5] font-semibold hover:bg-[#0F6B4F]/15 border border-line"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/problemhub/my-problems"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2 py-2 text-center rounded-xl bg-soft text-[11px] text-blue-400 font-semibold hover:bg-blue-500/15 border border-line"
                    >
                      My Hub
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2 py-2 text-center rounded-xl bg-soft text-[11px] text-[#0F6B4F] font-semibold hover:bg-[#0F6B4F]/15 border border-line"
                    >
                      Write
                    </Link>
                    <Link
                      to="/admin/articles"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2 py-2 text-center rounded-xl bg-soft text-[11px] text-[#16805E] font-semibold hover:bg-[#16805E]/15 border border-line"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-soft text-[#0F6B4F] border border-[#0F6B4F]/20 text-xs font-semibold hover:bg-[#0F6B4F]/15"
                  >
                    <PenTool size={13} />
                    <span>Write</span>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#0F6B4F] text-white text-xs font-semibold hover:bg-[#0C5A42]"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ═══ MAIN CONTENT OUTLET ═══ */}
      <main className="flex-grow pt-24 pb-16">
        <div key={location.pathname} className="w-full h-full animate-fade-in">
          {currentOutlet}
        </div>
      </main>

      {/* ═══ FLOATING SMOOTH SCROLL-TO-TOP BUTTON ═══ */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          title="Back to top"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0F6B4F] to-[#16805E] text-white shadow-lg shadow-[#0F6B4F]/30 border border-[#4FD1A5]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 animate-fade-in cursor-pointer"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* ═══ MULTI-COLUMN FOOTER ═══ */}
      <footer className="border-t border-line bg-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
            {/* Brand & Description (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <TechJourneyLogo size={36} inverted />
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Your journey through technology, programming, and modern software development.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a href="https://www.instagram.com/techjourney822/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface/50 text-slate-400 hover:text-white hover:bg-surface border border-line transition-all group" aria-label="Instagram">
                  <InstagramIcon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Column 1: Explore */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0F6B4F]">
                Explore
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/articles" className="hover:text-white transition-colors">Articles</Link></li>
                <li><Link to="/problemhub" onClick={(e) => { if (!userInfo) { e.preventDefault(); setLoginModalOpen(true); } }} className="hover:text-white transition-colors">ProblemHub</Link></li>
                <li><Link to="/projecthub" onClick={(e) => { if (!userInfo) { e.preventDefault(); setLoginModalOpen(true); } }} className="hover:text-white transition-colors">ProjectHub</Link></li>
                <li><Link to="/roadmaps" onClick={(e) => { if (!userInfo) { e.preventDefault(); setLoginModalOpen(true); } }} className="hover:text-white transition-colors">Roadmaps</Link></li>
                <li><Link to="/interview-questions" onClick={(e) => { if (!userInfo) { e.preventDefault(); setLoginModalOpen(true); } }} className="hover:text-white transition-colors">Interview Questions</Link></li>
                <li><Link to="/news" className="hover:text-white transition-colors">Tech News</Link></li>
              </ul>
            </div>

            {/* Column 2: Technology */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#16805E]">
                Technology
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/blog?category=Web%20Development" className="hover:text-white transition-colors">Web Development</Link></li>
                <li><Link to="/blog?category=Backend" className="hover:text-white transition-colors">Backend</Link></li>
                <li><Link to="/blog?category=AI" className="hover:text-white transition-colors">AI & ML</Link></li>
                <li><Link to="/blog?category=Networking" className="hover:text-white transition-colors">Networking</Link></li>
                <li><Link to="/blog?category=Computer%20Science" className="hover:text-white transition-colors">Computer Science</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F4A62A]">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/problemhub" onClick={(e) => { if (!userInfo) { e.preventDefault(); setLoginModalOpen(true); } }} className="hover:text-white transition-colors">ProblemHub</Link></li>
                <li><Link to="/interview-questions" onClick={(e) => { if (!userInfo) { e.preventDefault(); setLoginModalOpen(true); } }} className="hover:text-white transition-colors">Interview Questions</Link></li>
                <li><Link to="/roadmaps" onClick={(e) => { if (!userInfo) { e.preventDefault(); setLoginModalOpen(true); } }} className="hover:text-white transition-colors">Roadmaps</Link></li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#4FD1A5]">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar Copyright */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
            <p>© 2026 TechJourney. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Developer Knowledge Platform</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-[#4FD1A5]">Engineered for Developers</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Login Popup Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
