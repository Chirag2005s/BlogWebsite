import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Code2, Clock, Eye, Sparkles, TrendingUp,
  Zap, Newspaper, FileText, Heart, Search, CheckCircle2, Layers,
  Compass, Flame, Terminal, Send, Star, Cpu, ShieldCheck, Tag
} from 'lucide-react';
import api from '../services/api';

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <div className="aspect-video skeleton" />
    <div className="p-6 space-y-3">
      <div className="skeleton h-3 w-20 rounded-full" />
      <div className="skeleton h-5 w-full rounded-lg" />
      <div className="skeleton h-5 w-3/4 rounded-lg" />
      <div className="skeleton h-3 w-full rounded-lg mt-4" />
      <div className="skeleton h-3 w-2/3 rounded-lg" />
      <div className="flex justify-between mt-4 pt-4 border-t border-white/5">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-3 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

/* ─── Modern Publication Card ─── */
const PublicationCard = ({ article, index }) => (
  <Link
    to={`/blog/${article.slug}`}
    className="blog-card glass-card rounded-2xl overflow-hidden group flex flex-col hover:border-primary-500/30 transition-all"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    {/* Image Container */}
    <div className="aspect-video overflow-hidden bg-surface-800 relative">
      {article.coverImage ? (
        <img
          src={article.coverImage}
          alt={article.title}
          className="blog-card-image w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-950/40 via-surface-800 to-surface-900">
          {article.type === 'article' ? (
            <FileText size={36} className="text-primary-400/50" />
          ) : (
            <BookOpen size={36} className="text-primary-400/50" />
          )}
        </div>
      )}

      {/* Floating Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg ${article.type === 'article'
            ? 'bg-purple-500/80 text-white border border-purple-400/30'
            : 'bg-primary-600/80 text-white border border-primary-400/30'
            }`}
        >
          {article.type === 'article' ? '📚 Article' : '📝 Blog'}
        </span>

        {article.difficulty && (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md shadow-md ${article.difficulty === 'Beginner'
              ? 'bg-success/20 text-green-300 border border-success/30'
              : article.difficulty === 'Intermediate'
                ? 'bg-warning/20 text-yellow-300 border border-warning/30'
                : 'bg-error/20 text-red-300 border border-error/30'
              }`}
          >
            {article.difficulty}
          </span>
        )}
      </div>
    </div>

    {/* Content */}
    <div className="p-5 sm:p-6 flex flex-col flex-grow space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-primary-400 uppercase tracking-wider">
          {article.category?.name || (article.type === 'article' ? 'Architecture & Engineering' : 'Daily Dev Log')}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors duration-200 line-clamp-2 leading-snug">
        {article.title}
      </h3>

      <p className="text-sm text-text-secondary line-clamp-2 flex-grow leading-relaxed">
        {article.excerpt}
      </p>

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {article.readingTime || 3} min
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {article.views || 0}
          </span>
          <span className="flex items-center gap-1 text-red-400/80">
            <Heart size={12} />
            {article.likes || 0}
          </span>
        </div>
        <div className="flex items-center gap-1 text-primary-400 font-medium group-hover:translate-x-0.5 transition-transform">
          Read <ArrowRight size={12} />
        </div>
      </div>
    </div>
  </Link>
);

/* ─── Metric Stat Card ─── */
const StatCard = ({ icon: Icon, label, value, sublabel, color, borderGlow }) => (
  <div className={`gradient-card p-5 group hover:-translate-y-1 transition-all ${borderGlow}`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-md`}>
        <Icon size={20} />
      </div>
      <Sparkles size={14} className="text-white/20 group-hover:text-primary-400 transition-colors" />
    </div>
    <p className="text-2xl font-black text-white tracking-tight">{value}</p>
    <p className="text-xs font-semibold text-text-primary mt-0.5">{label}</p>
    <p className="text-[11px] text-text-muted mt-0.5">{sublabel}</p>
  </div>
);

/* ═══════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════ */

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'blog' | 'article'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const heroRef = useRef(null);
  const feedRef = useRef(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const { data } = await api.get('/articles');
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      setArticles(list);
    } catch (error) {
      console.error('Failed to fetch articles', error);
      const serverMsg = error.response?.data?.message || error.message || 'Failed to connect to backend';
      setErrorMsg(serverMsg);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // The 7 official categories
  const categories = [
    {
      name: 'Artificial Intelligence',
      slug: 'artificial-intelligence',
      emoji: '🤖',
      description: 'Autonomous systems, reasoning agents, neural cognition, and AI safety.',
      color: 'from-blue-500/20 to-indigo-500/10',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
    },
    {
      name: 'Machine Learning',
      slug: 'machine-learning',
      emoji: '🧠',
      description: 'Predictive modeling, deep neural architectures, and data pipelines.',
      color: 'from-indigo-500/20 to-purple-500/10',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
    },
    {
      name: 'Generative AI',
      slug: 'generative-ai',
      emoji: '✨',
      description: 'Large language models, diffusion systems, and multimodal synthesis.',
      color: 'from-purple-500/20 to-pink-500/10',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
    },
    {
      name: 'Robotics',
      slug: 'robotics',
      emoji: '🦾',
      description: 'Kinematics, sensory feedback loops, embedded ROS, and physical computing.',
      color: 'from-amber-500/20 to-orange-500/10',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
    },
    {
      name: 'Web Technology',
      slug: 'web-technology',
      emoji: '🌐',
      description: 'Full-stack platforms, modern browser APIs, frontend frameworks, and runtimes.',
      color: 'from-emerald-500/20 to-teal-500/10',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    },
    {
      name: 'Internet & Networking',
      slug: 'internet-networking',
      emoji: '📡',
      description: 'Distributed network routing, cloud infrastructure, TCP/IP, and protocols.',
      color: 'from-cyan-500/20 to-sky-500/10',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
    },
    {
      name: 'Hardware',
      slug: 'hardware',
      emoji: '💻',
      description: 'Silicon processors, GPUs, custom ASICs, microcontrollers, and circuits.',
      color: 'from-rose-500/20 to-red-500/10',
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
    },
  ];

  // Defensive array fallback to prevent undefined errors if response is malformed or in flight
  const safeArticles = Array.isArray(articles) ? articles : [];

  // Compute metrics
  const blogs = useMemo(() => safeArticles.filter((a) => !a.type || a.type === 'blog'), [safeArticles]);
  const technicalArticles = useMemo(() => safeArticles.filter((a) => a.type === 'article'), [safeArticles]);
  const totalViews = useMemo(() => safeArticles.reduce((acc, a) => acc + (a.views || 0), 0), [safeArticles]);
  const totalLikes = useMemo(() => safeArticles.reduce((acc, a) => acc + (a.likes || 0), 0), [safeArticles]);

  // Featured Spotlight: first featured or highest view/newest article
  const spotlight = useMemo(() => {
    if (safeArticles.length === 0) return null;
    return safeArticles.find((a) => a.featured) || safeArticles[0];
  }, [safeArticles]);

  // Filtered publications
  const filteredArticles = useMemo(() => {
    return safeArticles.filter((a) => {
      const isBlog = !a.type || a.type === 'blog';
      const matchesTab =
        activeTab === 'all' ? true : activeTab === 'article' ? a.type === 'article' : isBlog;

      const matchesSearch =
        searchQuery.trim() === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

      const articleCat = (a.category?.name || '').toLowerCase();
      const matchesCategory =
        selectedCategory === 'All' || articleCat === selectedCategory.toLowerCase();

      return matchesTab && matchesSearch && matchesCategory;
    });
  }, [safeArticles, activeTab, searchQuery, selectedCategory]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    if (feedRef.current) {
      feedRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-28 -mt-6">
      {/* Ambient background light orbs */}
      <div className="floating-orb w-[500px] h-[500px] bg-primary-600/10 top-0 left-1/2 -translate-x-1/2" />
      <div className="floating-orb w-[400px] h-[400px] bg-purple-600/10 top-[600px] right-0" />

      {/* ═══════════════════════════════════
           HERO SECTION
         ═══════════════════════════════════ */}
      <section ref={heroRef} className="relative py-16 sm:py-24 lg:py-32 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="hero-grid" />
        <div className="hero-glow" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border border-primary-500/20 text-xs font-semibold text-primary-300 shadow-xl shadow-primary-500/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <span>DAILY DEV DISPATCH • 2026 EDITION</span>
            <span className="text-white/20">|</span>
            <span className="text-text-secondary font-normal">Blogs & Technical Articles</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[0.98]">
            Architectures.{' '}
            <span className="bg-gradient-to-r from-primary-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Learnings.
            </span>{' '}
            Code. Blogs <p style={{ color: "#a04dffff" }}>.Developer Roadmaps</p>
          </h1>

          {/* Description */}
          <p className="animate-fade-up text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '100ms' }}>
            A curated engineering hub separating daily developer logs from in-depth architectural deep-dives. Real production lessons, zero fluff.
          </p>

          {/* Hero CTAs */}
          <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2" style={{ animationDelay: '200ms' }}>
            <Link
              to="/blog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all shadow-xl shadow-primary-600/30 hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              <BookOpen size={18} />
              Explore Daily Blogs
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/articles"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-white font-semibold border border-purple-500/30 hover:border-purple-500/60 transition-all shadow-lg hover:-translate-y-0.5"
            >
              <FileText size={18} className="text-purple-400" />
              Read Technical Articles
            </Link>
          </div>

          {/* Quick Search Bar */}
          <div className="animate-fade-up max-w-lg mx-auto pt-4" style={{ animationDelay: '300ms' }}>
            <div className="relative">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all blogs and articles..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-800/80 border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 backdrop-blur-md transition-all shadow-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           LIVE METRICS STRIP
         ═══════════════════════════════════ */}
      <section className="-mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={BookOpen}
            label="Developer Blogs"
            value={blogs.length}
            sublabel="Daily engineering logs"
            color="bg-primary-500/20 text-primary-300"
            borderGlow="hover:border-primary-500/30"
          />
          <StatCard
            icon={FileText}
            label="Technical Articles"
            value={technicalArticles.length}
            sublabel="In-depth architectures"
            color="bg-purple-500/20 text-purple-300"
            borderGlow="hover:border-purple-500/30"
          />
          <StatCard
            icon={Eye}
            label="Total Readership"
            value={totalViews.toLocaleString()}
            sublabel="Verified post reads"
            color="bg-emerald-500/20 text-emerald-300"
            borderGlow="hover:border-emerald-500/30"
          />
          <StatCard
            icon={Heart}
            label="Community Likes"
            value={totalLikes.toLocaleString()}
            sublabel="Appreciations"
            color="bg-red-500/20 text-red-300"
            borderGlow="hover:border-red-500/30"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════
           FEATURED SPOTLIGHT (EDITORIAL HERO)
         ═══════════════════════════════════ */}
      {spotlight && !searchQuery && (
        <section className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-amber-400" />
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Featured Spotlight
              </h2>
            </div>
            <span className="text-xs text-text-muted">Editor's recommendation</span>
          </div>

          <div className="gradient-card overflow-hidden p-6 sm:p-8 lg:p-10 border border-white/10 hover:border-primary-500/40 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image Col */}
              <div className="lg:col-span-6 overflow-hidden rounded-xl bg-surface-800 aspect-video relative group">
                {spotlight.coverImage ? (
                  <img
                    src={spotlight.coverImage}
                    alt={spotlight.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-primary-950 via-surface-800 to-purple-950/40">
                    <Sparkles size={48} className="text-primary-400/40" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-primary-300 border border-white/10">
                    {spotlight.type === 'article' ? '📚 Technical Article' : '📝 Daily Blog'}
                  </span>
                </div>
              </div>

              {/* Text Col */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="tech-tag text-xs">
                    {spotlight.category?.name || 'Featured Publication'}
                  </span>
                  {spotlight.difficulty && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-text-secondary border border-white/5">
                      {spotlight.difficulty}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  <Link to={`/blog/${spotlight.slug}`} className="hover:text-primary-300 transition-colors">
                    {spotlight.title}
                  </Link>
                </h3>

                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  {spotlight.excerpt}
                </p>

                {/* Author & Metrics */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                      {spotlight.author?.name?.charAt(0) || 'A'}
                    </div>
                    <span className="text-text-secondary font-medium">{spotlight.author?.name || 'Editor'}</span>
                  </div>
                  <span className="w-px h-3.5 bg-white/10" />
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {spotlight.readingTime || 3} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={13} />
                    {spotlight.views || 0} reads
                  </span>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/blog/${spotlight.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/25 hover:shadow-primary-500/35"
                  >
                    Read Full Story
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
           MAIN FEED: BLOGS & ARTICLES
         ═══════════════════════════════════ */}
      <section ref={feedRef} className="space-y-6">
        {/* Section Header with Segmented Switch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                ⚡ Comprehensive Publications
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {activeTab === 'article'
                ? 'Technical Articles'
                : activeTab === 'blog'
                  ? 'Developer Blogs'
                  : 'All Engineering Content'}
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              {activeTab === 'article'
                ? 'Deep-dive architectural patterns, production blueprints, and extensive engineering tutorials.'
                : activeTab === 'blog'
                  ? 'Daily dev reflections, short-form learnings, debugging fixes, and tool discoveries.'
                  : 'Browse our complete dual library of short-form logs and comprehensive deep-dives.'}
            </p>
          </div>

          {/* Segmented Control Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-surface-800/90 border border-white/8 backdrop-blur-md self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'all'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'text-text-secondary hover:text-white'
                }`}
            >
              All ({articles.length})
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'blog'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'text-text-secondary hover:text-white'
                }`}
            >
              📝 Blogs ({blogs.length})
            </button>
            <button
              onClick={() => setActiveTab('article')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'article'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-text-secondary hover:text-white'
                }`}
            >
              📚 Articles ({technicalArticles.length})
            </button>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === 'All'
              ? 'bg-white text-surface-900 shadow-md font-bold'
              : 'bg-surface-800/80 text-text-secondary hover:text-white border border-white/6 hover:bg-surface-700'
              }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory.toLowerCase() === cat.name.toLowerCase()
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-surface-800/80 text-text-secondary hover:text-white border border-white/6 hover:bg-surface-700'
                }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Publications Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center space-y-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${errorMsg ? 'bg-amber-500/10 text-amber-400' : 'bg-primary-500/10 text-primary-400'}`}>
              <BookOpen size={30} />
            </div>
            <h3 className="text-xl font-bold text-white">
              {errorMsg
                ? 'Backend Notice'
                : searchQuery
                  ? `No results matching "${searchQuery}"`
                  : activeTab === 'article'
                    ? 'No technical articles published yet'
                    : 'No blogs published yet'}
            </h3>
            <p className="text-text-secondary text-sm max-w-lg mx-auto leading-relaxed">
              {errorMsg
                ? errorMsg
                : searchQuery
                  ? 'Try clearing your search query or switching tabs.'
                  : activeTab === 'article'
                    ? 'Publish your first technical deep-dive using the Article Editor.'
                    : 'Daily blogs published will appear here.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              {errorMsg && (
                <button
                  onClick={fetchArticles}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all shadow-lg shadow-amber-600/20"
                >
                  🔄 Retry Connection
                </button>
              )}
              <Link
                to={activeTab === 'article' ? '/admin/add-article' : '/admin'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold transition-all"
              >
                {activeTab === 'article' ? '+ Create Article' : '+ Write Blog'}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <PublicationCard key={article._id} article={article} index={index} />
            ))}
          </div>
        )}

        {/* View Full Section Footer Link */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-xs text-text-muted">
            Showing {filteredArticles.length} of {articles.length} items
          </span>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/blog" className="text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              All Blogs <ArrowRight size={13} />
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/articles" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
              All Articles <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           THREE CORE PILLARS (WHY TECHJOURNEY)
         ═══════════════════════════════════ */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
            🧠 Editorial Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Modern Engineers
          </h2>
          <p className="text-text-secondary text-sm">
            Everything structured with strict separation of concerns, high technical accuracy, and zero fluff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="gradient-card p-8 space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400 mb-2">
              <Terminal size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Daily Developer Logs</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Fast, practical write-ups documenting real everyday bugs, tricky API quirks, and workflow productivity wins.
            </p>
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:underline pt-2">
              Explore logs <ArrowRight size={12} />
            </Link>
          </div>

          <div className="gradient-card p-8 space-y-4 hover:-translate-y-1 transition-transform border-purple-500/20">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 mb-2">
              <Layers size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Technical Deep-Dives</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Long-form architectural case studies covering microservices, caching layers, distributed databases, and high availability.
            </p>
            <Link to="/articles" className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:underline pt-2">
              Read articles <ArrowRight size={12} />
            </Link>
          </div>

          <div className="gradient-card p-8 space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-2">
              <Cpu size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Curated Tech Radar</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Stay ahead of emerging tools, AI frameworks, runtimes, and engineering best practices shaping modern software teams.
            </p>
            <Link to="/news" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline pt-2">
              Read Tech News <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           BROWSE BY CATEGORY (7 OFFICIAL CATEGORIES)
         ═══════════════════════════════════ */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                🏷️ Core Disciplines
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore by Category
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Select any discipline to filter through our published blogs and technical articles.
            </p>
          </div>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-primary-400 hover:text-primary-300 font-medium self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20"
            >
              Showing: <span className="font-bold text-white">{selectedCategory}</span> · Reset ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = safeArticles.filter(
              (a) => (a.category?.name || '').toLowerCase() === cat.name.toLowerCase()
            ).length;
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

            return (
              <div
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className={`gradient-card p-5 cursor-pointer group transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between ${isSelected ? 'border-primary-500 shadow-xl shadow-primary-500/25 ring-1 ring-primary-500/40' : 'hover:border-white/20'
                  }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-xl bg-surface-800/90 border border-white/8 inline-block shadow-sm">
                      {cat.emoji}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-text-muted border border-white/5">
                      {count} {count === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-primary-400 font-medium">
                  <span>{isSelected ? 'Currently filtering' : 'Filter publications'}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════
           NEWSLETTER / DISPATCH CTA
         ═══════════════════════════════════ */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-14 border border-white/10 gradient-card">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/15 via-purple-600/15 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-text-secondary">
            <Sparkles size={13} className="text-primary-400" />
            <span>Developer Dispatch • Zero Spam</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Stay Ahead of the Engineering Curve
          </h2>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Get curated summaries of our latest blogs, architectural deep-dives, and emerging software paradigms delivered straight to your inbox.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your developer email..."
              className="w-full px-4 py-3 rounded-xl bg-surface-900/90 border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/30 whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Send size={15} />
              Subscribe
            </button>
          </form>

          {newsletterSuccess && (
            <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl animate-fade-in">
              <CheckCircle2 size={14} />
              <span>You're in! You'll receive our next technical digest.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
