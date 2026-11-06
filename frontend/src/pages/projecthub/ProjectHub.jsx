import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Dices,
  MessageSquare,
  Heart,
  Bookmark,
  Layers,
  Sparkles,
  ExternalLink,
  Eye,
  User,
  GitBranch,
  SlidersHorizontal,
  FolderGit2,
  ArrowUpRight,
  Users,
  Terminal,
  Cpu,
  Code2,
  Rocket,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = [
  'All',
  'Full Stack',
  'Web App',
  'AI / ML',
  'Internet of Things',
  'Backend & API',
  'DevTools & CLI',
  'Mobile App',
  'System Design',
  'Open Source',
];

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ProjectHub() {
  const navigate = useNavigate();

  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [activeFeedTab, setActiveFeedTab] = useState('all'); // 'all' | 'mine' | 'bookmarked' | 'contributors'
  const [busyLikeIds, setBusyLikeIds] = useState({});
  const [busyBookmarkIds, setBusyBookmarkIds] = useState({});
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects', {
        params: { sort: sortBy },
      });
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [sortBy]);

  const isLikedByMe = (project) => {
    if (!userInfo?._id || !Array.isArray(project?.likes)) return false;
    return project.likes.some((id) => String(id) === String(userInfo._id));
  };

  const isBookmarkedByMe = (project) => {
    if (!userInfo?._id || !Array.isArray(project?.bookmarks)) return false;
    return project.bookmarks.some((id) => String(id) === String(userInfo._id));
  };

  const handleToggleLike = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (busyLikeIds[projectId]) return;
    setBusyLikeIds((prev) => ({ ...prev, [projectId]: true }));

    try {
      const { data } = await api.post(`/projects/${projectId}/like`);
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? {
              ...p,
              likes: data.likes,
              likesCount: data.likesCount,
            }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setBusyLikeIds((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const handleToggleBookmark = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (busyBookmarkIds[projectId]) return;
    setBusyBookmarkIds((prev) => ({ ...prev, [projectId]: true }));

    try {
      const { data } = await api.post(`/projects/${projectId}/bookmark`);
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? {
              ...p,
              bookmarks: data.bookmarks,
              bookmarksCount: data.bookmarksCount,
            }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setBusyBookmarkIds((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const handleRandomProject = () => {
    if (!projects.length) return;
    const randomItem = projects[Math.floor(Math.random() * projects.length)];
    navigate(`/projecthub/project/${randomItem._id}`);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (!p) return false;
      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.tagline || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (Array.isArray(p.techStack) &&
          p.techStack.some((t) => t.toLowerCase().includes(q))) ||
        (Array.isArray(p.tags) &&
          p.tags.some((t) => t.toLowerCase().includes(q)));

      const matchCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      const matchDifficulty =
        selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

      let matchTab = true;
      if (activeFeedTab === 'mine') {
        matchTab =
          Boolean(userInfo?._id) &&
          String(p.creator?._id || p.creator) === String(userInfo._id);
      } else if (activeFeedTab === 'bookmarked') {
        matchTab = isBookmarkedByMe(p);
      } else if (activeFeedTab === 'contributors') {
        matchTab = Boolean(p.lookingForContributors);
      }

      return (
        matchSearch &&
        matchCategory &&
        matchDifficulty &&
        matchTab
      );
    });
  }, [
    projects,
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    activeFeedTab,
    userInfo,
  ]);

  const featuredProjects = useMemo(
    () => projects.filter((p) => p.isFeatured).slice(0, 3),
    [projects]
  );

  const myProjectsCount = useMemo(
    () =>
      projects.filter(
        (p) =>
          userInfo?._id &&
          String(p.creator?._id || p.creator) === String(userInfo._id)
      ).length,
    [projects, userInfo]
  );

  const openCollabCount = useMemo(
    () => projects.filter((p) => p.lookingForContributors).length,
    [projects]
  );

  const bookmarkedCount = useMemo(
    () => projects.filter((p) => isBookmarkedByMe(p)).length,
    [projects, userInfo]
  );

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setActiveFeedTab('all');
  };

  const heroShowcaseList = useMemo(() => {
    if (featuredProjects.length > 0) return featuredProjects;
    return projects.slice(0, 3);
  }, [featuredProjects, projects]);

  useEffect(() => {
    if (heroShowcaseList.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlideIdx((prev) => (prev + 1) % heroShowcaseList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroShowcaseList.length]);

  const activeHeroProject =
    heroShowcaseList[heroSlideIdx % Math.max(1, heroShowcaseList.length)] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <style>{`
        @keyframes robotFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(1.5deg); }
        }
        @keyframes robotArmWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-18deg); }
          75% { transform: rotate(12deg); }
        }
        @keyframes robotBlink {
          0%, 45%, 55%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }
        @keyframes thrusterPulse {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.85; }
          50% { transform: scaleY(1.35) scaleX(0.85); opacity: 1; }
        }
        @keyframes orbitClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbitCounter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes holoShadow {
          0%, 100% { transform: scale(1); opacity: 0.45; }
          50% { transform: scale(0.75); opacity: 0.2; }
        }
        @keyframes radarPing {
          0% { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .robot-body-float { animation: robotFloat 4.2s ease-in-out infinite; }
        .robot-arm-left { transform-origin: 68px 142px; animation: robotArmWave 3s ease-in-out infinite; }
        .robot-arm-right { transform-origin: 192px 142px; animation: robotArmWave 3.4s ease-in-out infinite reverse; }
        .robot-eyes { transform-origin: 130px 92px; animation: robotBlink 4.5s infinite; }
        .robot-thruster { transform-origin: 130px 225px; animation: thrusterPulse 0.6s ease-in-out infinite; }
        .robot-orbit-cw { animation: orbitClockwise 26s linear infinite; }
        .robot-orbit-ccw { animation: orbitCounter 20s linear infinite; }
        .robot-shadow { animation: holoShadow 4.2s ease-in-out infinite; }
        .robot-antenna-ping { transform-origin: 130px 30px; animation: radarPing 2s ease-out infinite; }
      `}</style>

      {/* ═══ ANIMATED HERO BANNER ═══ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071812] via-[#06120e] to-[#030907] border border-[#16805E]/40 p-6 sm:p-10 lg:p-12 mb-10 shadow-2xl">
        {/* Animated Cyber Grid & Radial Glow Backdrop */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(79, 209, 165, 0.28) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#0F6B4F]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-96 h-96 rounded-full bg-[#4FD1A5]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Headline, Actions & Telemetry (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              {userInfo && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F6B4F]/25 border border-[#0F6B4F]/50 text-[#4FD1A5] text-xs font-semibold backdrop-blur-sm shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#4FD1A5] animate-pulse" />
                  <span>Builder Workspace · @{userInfo.name || 'Developer'}</span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-300 text-[11px] font-mono font-semibold">
                <Sparkles size={12} className="text-amber-400" />
                <span>LIVE ARCHITECTURE SHOWCASE</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Project<span className="text-[#4FD1A5]">Hub</span>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-[#4FD1A5] to-teal-200 mt-2">
                Build in Public. Ship Production Systems.
              </span>
            </h1>

            <p className="text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              Explore full-stack systems, AI pipelines, IoT telemetry, and developer tools built by the TechJourney community. Inspect real architectures, test live demos, and showcase your own engineering work.
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to="/projecthub/create"
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0F6B4F] to-[#16805E] hover:from-[#16805E] hover:to-[#0F6B4F] text-white rounded-xl font-bold transition-all shadow-[0_0_25px_rgba(15,107,79,0.5)] hover:shadow-[0_0_35px_rgba(79,209,165,0.45)] hover:-translate-y-0.5 text-sm"
              >
                <Plus size={18} />
                <span>Submit a Project</span>
              </Link>

              <Link
                to="/projecthub/my-projects"
                className="flex items-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl font-semibold transition-all backdrop-blur-md hover:-translate-y-0.5 text-sm"
              >
                <User size={18} className="text-[#4FD1A5]" />
                <span>My Project Hub</span>
              </Link>
            </div>

            {/* Live Platform Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-[#4FD1A5]/40 transition-colors">
                <div className="text-2xl font-black text-white">{projects.length}</div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  Published Builds
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-[#4FD1A5]/40 transition-colors">
                <div className="text-2xl font-black text-[#4FD1A5]">
                  {openCollabCount}
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  Open for Collab
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-amber-400/40 transition-colors">
                <div className="text-2xl font-black text-amber-400">
                  {myProjectsCount}
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  My Submissions
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-sky-400/40 transition-colors">
                <div className="text-2xl font-black text-sky-400">
                  {bookmarkedCount}
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  Saved Bookmarks
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Animated AI Cyber Robot & Holographic Orbit Stage (5 Cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[340px] select-none">
            {/* Outer & Inner Counter-Rotating Orbital Rings */}
            <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-dashed border-[#4FD1A5]/25 absolute pointer-events-none robot-orbit-cw" />
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-[#0F6B4F]/40 absolute pointer-events-none robot-orbit-ccw" />

            {/* Ambient Hologram Core Glow */}
            <div className="w-48 h-48 rounded-full bg-[#4FD1A5]/15 blur-2xl absolute pointer-events-none" />

            {/* Floating Holographic Node Chips Around Robot */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#081A14]/90 border border-[#4FD1A5]/40 text-[11px] font-mono font-bold text-[#4FD1A5] shadow-lg absolute top-2 left-2 z-20">
              <Cpu size={12} className="text-[#4FD1A5]" />
              <span>AI + IoT Core</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#081A14]/90 border border-amber-400/40 text-[11px] font-mono font-bold text-amber-300 shadow-lg absolute top-6 right-2 z-20">
              <Rocket size={12} className="text-amber-400" />
              <span>Ship Faster</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#081A14]/90 border border-sky-400/40 text-[11px] font-mono font-bold text-sky-300 shadow-lg absolute bottom-12 left-4 z-20">
              <Code2 size={12} className="text-sky-400" />
              <span>Full-Stack Lab</span>
            </div>

            {/* Interactive Speech Bubble Above Robot */}
            <div
              onClick={() =>
                setHeroSlideIdx((prev) => (prev + 1) % Math.max(1, heroShowcaseList.length))
              }
              className="mb-2 px-4 py-2 rounded-2xl bg-[#0B221A]/95 border border-[#4FD1A5]/40 shadow-xl backdrop-blur-md text-center max-w-[260px] cursor-pointer hover:border-[#4FD1A5] transition-all z-20"
              title="Click to cycle featured project"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#4FD1A5] flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4FD1A5] animate-ping" />
                <span>TJ-BOT · AI ARCHITECT</span>
              </div>
              <p className="text-xs font-bold text-white truncate mt-0.5">
                {activeHeroProject
                  ? `Spotlight: ${activeHeroProject.title}`
                  : 'Ready to launch your next project!'}
              </p>
            </div>

            {/* Animated SVG Cyber Robot */}
            <div
              onClick={() => {
                if (activeHeroProject?._id) {
                  navigate(`/projecthub/project/${activeHeroProject._id}`);
                }
              }}
              className="relative z-10 cursor-pointer group"
              title={
                activeHeroProject
                  ? `Inspect ${activeHeroProject.title}`
                  : 'Explore Projects'
              }
            >
              <svg
                width="240"
                height="245"
                viewBox="0 0 260 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="robot-body-float drop-shadow-[0_16px_30px_rgba(15,107,79,0.55)]"
              >
                <defs>
                  <linearGradient id="botMetal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1B3B2F" />
                    <stop offset="50%" stopColor="#0E241C" />
                    <stop offset="100%" stopColor="#07130E" />
                  </linearGradient>
                  <linearGradient id="botAccent" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4FD1A5" />
                    <stop offset="100%" stopColor="#0F6B4F" />
                  </linearGradient>
                  <linearGradient id="thrusterGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4FD1A5" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Antenna Radar Wave & Stem */}
                <circle
                  cx="130"
                  cy="30"
                  r="10"
                  stroke="#4FD1A5"
                  strokeWidth="2"
                  className="robot-antenna-ping"
                />
                <line
                  x1="130"
                  y1="34"
                  x2="130"
                  y2="56"
                  stroke="#4FD1A5"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="130" cy="30" r="6" fill="#4FD1A5" />

                {/* Robot Head / Helmet */}
                <rect
                  x="76"
                  y="54"
                  width="108"
                  height="72"
                  rx="26"
                  fill="url(#botMetal)"
                  stroke="#4FD1A5"
                  strokeWidth="2.5"
                />
                {/* Ear Bolts */}
                <rect x="66" y="78" width="10" height="24" rx="5" fill="url(#botAccent)" />
                <rect x="184" y="78" width="10" height="24" rx="5" fill="url(#botAccent)" />

                {/* Glowing Visor Screen */}
                <rect
                  x="88"
                  y="68"
                  width="84"
                  height="42"
                  rx="14"
                  fill="#040B08"
                  stroke="#16805E"
                  strokeWidth="1.5"
                />

                {/* Blinking Cyber LED Eyes & Happy Mouth */}
                <g className="robot-eyes">
                  <circle cx="110" cy="88" r="7" fill="#4FD1A5" />
                  <circle cx="112" cy="86" r="2.2" fill="#FFFFFF" />
                  <circle cx="150" cy="88" r="7" fill="#4FD1A5" />
                  <circle cx="152" cy="86" r="2.2" fill="#FFFFFF" />
                </g>
                <path
                  d="M118 100 Q130 107 142 100"
                  stroke="#4FD1A5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Neck Joint */}
                <rect x="116" y="126" width="28" height="10" rx="4" fill="#16805E" />

                {/* Left Waving Mechanical Arm */}
                <g className="robot-arm-left">
                  <rect
                    x="42"
                    y="136"
                    width="26"
                    height="52"
                    rx="13"
                    fill="url(#botMetal)"
                    stroke="#4FD1A5"
                    strokeWidth="2"
                  />
                  <circle cx="55" cy="192" r="8" fill="#4FD1A5" />
                </g>

                {/* Right Mechanical Arm */}
                <g className="robot-arm-right">
                  <rect
                    x="192"
                    y="136"
                    width="26"
                    height="52"
                    rx="13"
                    fill="url(#botMetal)"
                    stroke="#4FD1A5"
                    strokeWidth="2"
                  />
                  <circle cx="205" cy="192" r="8" fill="#4FD1A5" />
                </g>

                {/* Robot Torso / Chest Armor */}
                <rect
                  x="74"
                  y="134"
                  width="112"
                  height="84"
                  rx="24"
                  fill="url(#botMetal)"
                  stroke="#4FD1A5"
                  strokeWidth="2.5"
                />

                {/* Chest Core Reactor & Telemetry Bars */}
                <rect
                  x="92"
                  y="148"
                  width="76"
                  height="52"
                  rx="12"
                  fill="#05100C"
                  stroke="#16805E"
                  strokeWidth="1.5"
                />
                <circle
                  cx="114"
                  cy="174"
                  r="13"
                  fill="#0F6B4F"
                  stroke="#4FD1A5"
                  strokeWidth="2"
                />
                <circle cx="114" cy="174" r="6" fill="#4FD1A5" />
                <rect x="134" y="162" width="24" height="5" rx="2.5" fill="#4FD1A5" />
                <rect x="134" y="172" width="18" height="5" rx="2.5" fill="#06B6D4" />
                <rect x="134" y="182" width="22" height="5" rx="2.5" fill="#F4A62A" />

                {/* Hover Jet Thruster Flame */}
                <path
                  d="M108 218 L130 256 L152 218 Z"
                  fill="url(#thrusterGlow)"
                  className="robot-thruster"
                />
                <rect x="104" y="216" width="52" height="8" rx="4" fill="#16805E" />
              </svg>

              {/* Glowing Floor Hologram Pad Shadow */}
              <div className="w-32 h-4 mx-auto rounded-full bg-[#4FD1A5]/40 blur-md -mt-2 robot-shadow" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FEATURED PROJECTS SPOTLIGHT ═══ */}
      {featuredProjects.length > 0 &&
        activeFeedTab === 'all' &&
        selectedCategory === 'All' &&
        selectedDifficulty === 'All' &&
        !searchTerm.trim() && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-heading">
                    Featured Engineering Builds
                  </h2>
                  <p className="text-xs text-muted">
                    Staff-picked projects with standout system design and clean documentation
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((proj) => {
                const liked = isLikedByMe(proj);
                const bookmarked = isBookmarkedByMe(proj);
                return (
                  <Link
                    key={proj._id}
                    to={`/projecthub/project/${proj._id}`}
                    className="group rounded-2xl bg-card border border-[#0F6B4F]/40 hover:border-[#4FD1A5] overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-soft overflow-hidden">
                        {proj.coverImage ? (
                          <img
                            src={proj.coverImage}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0F6B4F]/30 to-[#081712] flex items-center justify-center">
                            <Layers size={42} className="text-[#4FD1A5]/60" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-black shadow">
                            ★ Featured
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/70 text-white border border-white/15 backdrop-blur-md">
                            {proj.category}
                          </span>
                        </div>
                        {proj.lookingForContributors && (
                          <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                            ● Open to Contributors
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-base font-bold text-heading group-hover:text-[#4FD1A5] transition-colors line-clamp-1">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                          {proj.tagline}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-3.5">
                          {(proj.techStack || []).slice(0, 4).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-soft text-muted border border-line"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 border-t border-line bg-soft/30 flex items-center justify-between text-xs text-muted">
                      <span className="font-medium truncate max-w-[130px]">
                        by {proj.creator?.name || proj.creatorName || 'Developer'}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleToggleLike(e, proj._id)}
                          className={`inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer ${liked ? 'text-rose-400' : 'hover:text-rose-400'
                            }`}
                          title="Like project"
                        >
                          <Heart
                            size={14}
                            className={liked ? 'fill-current text-rose-400' : ''}
                          />
                          <span>{proj.likesCount || 0}</span>
                        </button>
                        <button
                          onClick={(e) => handleToggleBookmark(e, proj._id)}
                          className={`inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer ${bookmarked ? 'text-sky-400' : 'hover:text-sky-400'
                            }`}
                          title="Bookmark project"
                        >
                          <Bookmark
                            size={14}
                            className={bookmarked ? 'fill-current text-sky-400' : ''}
                          />
                          <span>{proj.bookmarksCount || 0}</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      {/* ═══ SEARCH & DROPDOWN FILTERS ═══ */}
      <div className="mb-8 bg-card border border-line rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input (4 cols on desktop) */}
          <div className="relative sm:col-span-2 lg:col-span-4">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="Search projects, architecture, or tech..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-page border border-line rounded-xl pl-10 pr-14 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#0F6B4F] focus:ring-1 focus:ring-[#0F6B4F] text-heading placeholder:text-muted transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted hover:text-heading px-2 py-0.5 rounded bg-soft cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* View / Feed Dropdown (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={activeFeedTab}
              onChange={(e) => setActiveFeedTab(e.target.value)}
              aria-label="Filter by View"
              className="w-full bg-page border border-line rounded-xl px-3 py-2.5 text-xs font-semibold text-heading focus:outline-none focus:border-[#0F6B4F] cursor-pointer"
            >
              <option value="all">View: All Projects ({projects.length})</option>
              <option value="contributors">Open to Collab ({openCollabCount})</option>
              <option value="mine">My Projects ({myProjectsCount})</option>
              <option value="bookmarked">Saved Bookmarks ({bookmarkedCount})</option>
            </select>
          </div>

          {/* Category Dropdown (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by Category"
              className="w-full bg-page border border-line rounded-xl px-3 py-2.5 text-xs font-semibold text-heading focus:outline-none focus:border-[#0F6B4F] cursor-pointer"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category === 'All' ? 'Category: All' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Complexity Dropdown (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Filter by Complexity"
              className="w-full bg-page border border-line rounded-xl px-3 py-2.5 text-xs font-semibold text-heading focus:outline-none focus:border-[#0F6B4F] cursor-pointer"
            >
              {DIFFICULTIES.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'Level: All' : diff}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort Projects"
              className="w-full bg-page border border-line rounded-xl px-3 py-2.5 text-xs font-semibold text-heading focus:outline-none focus:border-[#0F6B4F] cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="likes">Most Liked</option>
              <option value="views">Most Viewed</option>
              <option value="comments">Most Discussed</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>

        {(searchTerm ||
          activeFeedTab !== 'all' ||
          selectedCategory !== 'All' ||
          selectedDifficulty !== 'All') && (
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-line text-xs text-muted">
              <span>
                Showing <strong className="text-heading">{filteredProjects.length}</strong> matching project{filteredProjects.length === 1 ? '' : 's'}
              </span>
              <button
                onClick={resetFilters}
                className="text-[#4FD1A5] hover:underline font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
      </div>

      {/* ═══ PROJECT CARDS GRID ═══ */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-card border border-line p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="h-40 rounded-xl bg-soft" />
              <div className="space-y-3">
                <div className="h-5 w-3/4 bg-soft rounded" />
                <div className="h-4 w-full bg-soft rounded" />
                <div className="h-4 w-2/3 bg-soft rounded" />
              </div>
              <div className="h-8 w-full bg-soft rounded" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-card border border-line rounded-3xl p-8">
          <FolderGit2 className="mx-auto text-muted mb-4" size={48} />
          <h3 className="text-xl font-bold text-heading mb-2">
            No matching projects found
          </h3>
          <p className="text-muted text-sm mb-6 max-w-md mx-auto">
            No projects matched your active filters. Try clearing the filters or submit the first project in this category!
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-soft hover:bg-line text-heading rounded-xl font-semibold text-sm transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
            <Link
              to="/projecthub/create"
              className="px-5 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-semibold text-sm transition-all"
            >
              Submit a Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const liked = isLikedByMe(project);
            const bookmarked = isBookmarkedByMe(project);

            return (
              <div
                key={project._id}
                onClick={() => navigate(`/projecthub/project/${project._id}`)}
                className="group rounded-2xl bg-card border border-line hover:border-[#0F6B4F]/60 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Cover Thumbnail */}
                  <div className="relative h-48 bg-soft overflow-hidden border-b border-line">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0F6B4F]/25 via-card to-page flex items-center justify-center">
                        <FolderGit2 size={48} className="text-[#4FD1A5]/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                    {/* Top Left Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/70 text-white border border-white/15 backdrop-blur-md">
                        {project.category}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md border ${project.difficulty === 'Beginner'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : project.difficulty === 'Intermediate'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                      >
                        {project.difficulty}
                      </span>
                    </div>

                    {/* Bookmark Quick Action */}
                    <button
                      onClick={(e) => handleToggleBookmark(e, project._id)}
                      className={`absolute top-3 right-3 p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${bookmarked
                        ? 'bg-sky-500/25 border-sky-400/50 text-sky-300'
                        : 'bg-black/60 border-white/15 text-slate-200 hover:text-white'
                        }`}
                      title={bookmarked ? 'Remove bookmark' : 'Save project'}
                    >
                      <Bookmark
                        size={15}
                        className={bookmarked ? 'fill-current' : ''}
                      />
                    </button>

                    {/* Contributors Badge */}
                    {project.lookingForContributors && (
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                        <Users size={11} />
                        <span>Seeking Contributors</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-heading group-hover:text-[#4FD1A5] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                      {project.tagline}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {(project.techStack || []).slice(0, 5).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-soft text-heading border border-line"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.techStack || []).length > 5 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-soft text-muted">
                          +{project.techStack.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-5 py-3.5 border-t border-line bg-soft/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0F6B4F] to-[#2BAF85] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {(project.creator?.name || project.creatorName || 'D')
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <span className="text-xs text-muted truncate">
                      {project.creator?.name || project.creatorName || 'Developer'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted shrink-0">
                    {/* Like Button */}
                    <button
                      onClick={(e) => handleToggleLike(e, project._id)}
                      className={`inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer ${liked ? 'text-rose-400' : 'hover:text-rose-400'
                        }`}
                      title="Like Project"
                    >
                      <Heart
                        size={14}
                        className={liked ? 'fill-current text-rose-400' : ''}
                      />
                      <span>{project.likesCount || 0}</span>
                    </button>

                    {/* Comments Count */}
                    <span
                      className="inline-flex items-center gap-1"
                      title="Comments"
                    >
                      <MessageSquare size={14} />
                      <span>{project.commentsCount || 0}</span>
                    </span>

                    {/* Views Count */}
                    <span className="inline-flex items-center gap-1" title="Views">
                      <Eye size={14} />
                      <span>{project.views || 0}</span>
                    </span>

                    {/* External Links */}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-soft hover:bg-[#0F6B4F] text-muted hover:text-white transition-colors"
                        title="GitHub Repository"
                      >
                        <GitBranch size={13} />
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-soft hover:bg-[#0F6B4F] text-muted hover:text-white transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

