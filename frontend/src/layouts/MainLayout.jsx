import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation, useOutlet } from 'react-router-dom';
import {
  Menu, X, Search, ChevronRight,
  PenTool, LogOut, ChevronDown, FileText, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [writeMenuOpen, setWriteMenuOpen] = useState(false);
  const writeMenuRef = useRef(null);

  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // Close write menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (writeMenuRef.current && !writeMenuRef.current.contains(e.target)) {
        setWriteMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
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
    // { to: '/programming', label: 'Programming' },
    { to: '/problemhub', label: 'Problem' },
    { to: '/roadmaps', label: 'Roadmaps', requiresLogin: true },
    { to: '/interview-questions', label: 'Interview', requiresLogin: true },
    { to: '/news', label: 'Tech' },
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

            {/* Write Button & Session / Sign In */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-line">
              {/* Write & Manage Dropdown - Always visible in Navbar */}
              <div className="relative" ref={writeMenuRef}>
                <button
                  onClick={() => setWriteMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-sm group ${writeMenuOpen
                    ? 'bg-[#111827] text-white border-[#334155] shadow-black/20'
                    : 'bg-[#111827]/60 text-muted border-[#1E293B] hover:bg-[#111827] hover:text-white hover:border-[#334155]'
                    }`}
                  aria-expanded={writeMenuOpen}
                  title="Write, Update or Manage Content"
                >
                  <PenTool size={13} className="currentColor" />
                  <span>Write</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 currentColor ${writeMenuOpen ? 'rotate-180' : 'opacity-70'
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {writeMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-line shadow-2xl shadow-black/20 py-2 z-50 backdrop-blur-xl animate-fade-in">
                    <div className="px-3.5 py-2 border-b border-line/60 mb-1">
                      <p className="text-[11px] font-semibold text-heading uppercase tracking-wider">Content Studio</p>
                      <p className="text-[11px] text-muted">Write, update & manage your posts</p>
                    </div>

                    <Link
                      to="/admin"
                      onClick={() => setWriteMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2 text-xs text-heading hover:bg-soft hover:text-[#0F6B4F] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#0F6B4F]/10 border border-[#0F6B4F]/20 flex items-center justify-center text-[#0F6B4F] group-hover:bg-[#0F6B4F]/20">
                        <PenTool size={14} />
                      </div>
                      <div>
                        <div className="font-semibold text-heading">Write Blog</div>
                        <div className="text-[10px] text-muted">Post daily development blog</div>
                      </div>
                    </Link>

                    <Link
                      to="/admin/add-article"
                      onClick={() => setWriteMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2 text-xs text-heading hover:bg-soft hover:text-[#F4A62A] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#F4A62A]/10 border border-[#F4A62A]/20 flex items-center justify-center text-[#F4A62A] group-hover:bg-[#F4A62A]/20">
                        <PlusCircle size={14} />
                      </div>
                      <div>
                        <div className="font-semibold text-heading">Write Article</div>
                        <div className="text-[10px] text-muted">Technical deep-dive publication</div>
                      </div>
                    </Link>

                    <div className="my-1 border-t border-line/60" />

                    <Link
                      to="/admin/articles"
                      onClick={() => setWriteMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 text-xs text-heading hover:bg-soft hover:text-[#16805E] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#16805E]/10 border border-[#16805E]/20 flex items-center justify-center text-[#16805E] group-hover:bg-[#16805E]/20">
                        <FileText size={14} />
                      </div>
                      <div>
                        <div className="font-semibold text-heading flex items-center gap-1.5">
                          <span>Manage Content</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#16805E]/15 text-[#16805E] text-[9px] font-mono">
                            Update / Delete
                          </span>
                        </div>
                        <div className="text-[10px] text-muted">Update or delete your own publications</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* User Session or Sign In */}
              {userInfo ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-card border border-line shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0F6B4F] to-[#16805E] flex items-center justify-center text-[11px] font-bold text-white shadow-sm flex-shrink-0">
                      {userInfo.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-heading max-w-[130px] truncate" title={userInfo.name}>
                      {userInfo.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-muted hover:text-[#EF4444] hover:bg-red-500/10 transition-all"
                    title="Logout"
                  >
                    <LogOut size={15} />
                  </button>
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
                <div className="flex flex-col gap-2 w-full pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-heading">{userInfo.name}</span>
                    <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">
                      Logout
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2.5 py-2 text-center rounded-xl bg-soft text-[11px] text-[#0F6B4F] font-medium hover:bg-[#0F6B4F]/15 border border-line"
                    >
                      Write Blog
                    </Link>
                    <Link
                      to="/admin/add-article"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2.5 py-2 text-center rounded-xl bg-soft text-[11px] text-[#F4A62A] font-medium hover:bg-[#F4A62A]/15 border border-line"
                    >
                      Write Article
                    </Link>
                    <Link
                      to="/admin/articles"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2.5 py-2 text-center rounded-xl bg-soft text-[11px] text-[#16805E] font-medium hover:bg-[#16805E]/15 border border-line"
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
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {currentOutlet}
          </motion.div>
        </AnimatePresence>
      </main>

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
                <li><Link to="/programming" className="hover:text-white transition-colors">Programming</Link></li>
                <li><Link to="/problemhub" className="hover:text-white transition-colors">ProblemHub</Link></li>
                <li><Link to="/roadmaps" onClick={(e) => { if (!userInfo) { e.preventDefault(); setLoginModalOpen(true); } }} className="hover:text-white transition-colors">Roadmaps</Link></li>
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
                <li><Link to="/problemhub" className="hover:text-white transition-colors">ProblemHub</Link></li>
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
