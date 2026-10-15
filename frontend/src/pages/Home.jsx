import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Sparkles, BookOpen, Compass, Code2, Terminal, 
  Globe, Server, BrainCircuit, Binary, Network, Cpu, Clock, 
  User, ExternalLink, Flame, CheckCircle2, ChevronRight, Zap,
  Layers, Newspaper, ShieldCheck
} from 'lucide-react';
import { 
  CATEGORIES, ROADMAPS, PROGRAMMING_LANGUAGES, 
  TECH_NEWS, ARTICLES 
} from '../data/mockData';
import CodeEditorSnippet from '../components/CodeEditorSnippet';
import StatsCounter from '../components/StatsCounter';
import RoadmapInteractiveFlow from '../components/RoadmapInteractiveFlow';
import Roadmap3DSection from '../components/Roadmap3DSection';
import NewsletterBanner from '../components/NewsletterBanner';
import AdvertisementSection from '../components/AdvertisementSection';
import api from '../services/api';

// Animation variants for Home page
const heroContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

// Map icon name string to Lucide component
const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'Code2': return <Code2 size={24} className="text-[#0F6B4F]" />;
    case 'Globe': return <Globe size={24} className="text-[#06B6D4]" />;
    case 'Server': return <Server size={24} className="text-[#8B5CF6]" />;
    case 'BrainCircuit': return <BrainCircuit size={24} className="text-[#A855F7]" />;
    case 'Binary': return <Binary size={24} className="text-[#06B6D4]" />;
    case 'Network': return <Network size={24} className="text-[#0F6B4F]" />;
    case 'Terminal': return <Terminal size={24} className="text-[#22C55E]" />;
    case 'Cpu': return <Cpu size={24} className="text-[#F59E0B]" />;
    default: return <Code2 size={24} className="text-[#0F6B4F]" />;
  }
};

export default function Home() {
  const [blogs, setBlogs] = useState(ARTICLES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally fetch articles from backend if available, fallback smoothly to mockData
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles');
        const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        if (list.length > 0) {
          // Merge API data with mock data so required articles are always present
          const existingSlugs = new Set(list.map((a) => a.slug));
          const missingRequired = ARTICLES.filter((a) => !existingSlugs.has(a.slug));
          setBlogs([...list, ...missingRequired]);
        }
      } catch (err) {
        // Fallback to rich mockData
        console.log('Using local developer mock dataset for immediate fast loading.');
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ═══════════════════════════════════════════
          1. HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative pt-6 sm:pt-12 pb-8 overflow-hidden">
        {/* Background glow orbs */}
        <div className="hero-grid" />
        <div className="hero-glow-primary" />
        <div className="hero-glow-cyan" />
        <div className="hero-glow-purple" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content (7 cols) */}
            <motion.div
              variants={heroContainerVariants}
              initial="hidden"
              animate="show"
              className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div variants={heroItemVariants} className="eyebrow-badge shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#0F6B4F] animate-pulse" />
                <span>Developer Knowledge Platform</span>
                <span className="text-[#D9E2DE]">|</span>
                <span className="text-muted font-mono">v2.6</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 variants={heroItemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-heading leading-[1.08]">
                Explore Technology.{' '}
                <span className="tech-gradient-text block mt-1 sm:mt-2">
                  Build Skills.
                </span>{' '}
                Shape Your Journey.
              </motion.h1>

              {/* Description */}
              <motion.p variants={heroItemVariants} className="text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                TechJourney helps developers explore programming, technology, roadmaps, tutorials, and the latest trends in the software world.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/blog"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#0F6B4F] to-[#16805E] hover:opacity-95 text-white font-bold text-base shadow-xl shadow-[#0F6B4F]/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
                >
                  <BookOpen size={18} />
                  <span>Explore Blogs</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/roadmaps"
                  className="w-full sm:w-auto btn-secondary px-8 py-4 text-base shadow-sm group"
                >
                  <Compass size={18} className="text-[#0F6B4F] group-hover:rotate-45 transition-transform duration-300" />
                  <span>View Roadmaps</span>
                </Link>
              </motion.div>

              {/* Tech Badges Row */}
              <motion.div variants={heroItemVariants} className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-muted">
                <span className="text-muted font-mono">Popular:</span>
                {['React 19', 'System Design', 'AI Agents', 'Linux Kernel', 'TypeScript', 'eBPF'].map((topic) => (
                  <Link
                    key={topic}
                    to={`/blog?search=${encodeURIComponent(topic)}`}
                    className="px-2.5 py-1 rounded-md pill-inactive text-xs hover:text-[#0F6B4F] transition-colors"
                  >
                    #{topic}
                  </Link>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Futuristic Developer Illustration (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-lg lg:max-w-none card-3d-perspective">
                {/* 3D Floating Terminal Window */}
                <motion.div
                  whileHover={{ rotateY: -3, rotateX: 2, scale: 1.015 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-2xl bg-[#020617] border border-line p-5 shadow-2xl shadow-cyan-950/40 card-3d-tilt"
                >
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                      <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                      <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                      <span className="ml-2 text-xs font-mono text-muted">techjourney-core.ts</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#06B6D4]">AI Engine Active</span>
                  </div>

                  {/* Code Editor Content */}
                  <div className="font-mono text-xs sm:text-sm space-y-1.5 text-heading">
                    <div>
                      <span className="text-[#8B5CF6]">interface</span>{' '}
                      <span className="text-[#06B6D4]">DevJourney</span> {'{'}
                    </div>
                    <div className="pl-4">
                      <span className="text-[#0F6B4F]">skills</span>: <span className="text-[#22C55E]">string[]</span>;
                    </div>
                    <div className="pl-4">
                      <span className="text-[#0F6B4F]">curiosity</span>: <span className="text-[#8B5CF6]">Infinity</span>;
                    </div>
                    <div className="pl-4">
                      <span className="text-[#0F6B4F]">roadmap</span>: <span className="text-[#06B6D4]">'Frontend' | 'Backend' | 'AI'</span>;
                    </div>
                    <div>{'}'}</div>
                    <div className="pt-2 text-muted italic">
                      // Deploying knowledge node to mesh...
                    </div>
                    <div className="text-[#22C55E]">
                      &gt; Compiling roadmaps: <span className="text-white">100% complete</span>
                    </div>
                  </div>

                  {/* Connected Roadmap Node Flow inside terminal */}
                  <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-1 text-[#0F6B4F]">
                      <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                      <span>Syntax</span>
                    </div>
                    <ChevronRight size={12} className="text-muted" />
                    <div className="flex items-center gap-1 text-[#06B6D4]">
                      <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                      <span>Architecture</span>
                    </div>
                    <ChevronRight size={12} className="text-muted" />
                    <div className="flex items-center gap-1 text-[#8B5CF6]">
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      <span>Scale</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Floating Code Badge 1 (Top Right) */}
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 p-3 rounded-xl bg-[#1E293B]/90 border border-cyan-500/40 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[#06B6D4]">
                    <BrainCircuit size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">AI / LLM Agents</div>
                    <div className="text-[10px] text-cyan-300 font-mono">Autonomous Loop</div>
                  </div>
                </motion.div>

                {/* Floating Floating Code Badge 2 (Bottom Left) */}
                <motion.div
                  animate={{ y: [0, 7, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-8 -left-6 p-3 rounded-xl bg-[#1E293B]/90 border border-purple-500/40 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[#8B5CF6]">
                    <Layers size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Full Stack Node</div>
                    <div className="text-[10px] text-purple-300 font-mono">Connected &amp; Live</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. ROADMAP FEATURE SECTION (PLACEMENT RIGHT AFTER HERO)
          ═══════════════════════════════════════════ */}
      <Roadmap3DSection />

      {/* ═══════════════════════════════════════════
          3. EXPLORE TECHNOLOGY CATEGORIES
          ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#06B6D4] font-semibold">
                Domains &amp; Verticals
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
              Explore Technology
            </h2>
            <p className="text-sm sm:text-base text-muted mt-1 max-w-xl">
              Curated deep dives into the foundational pillars of modern software engineering.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#06B6D4] hover:text-cyan-300 transition-colors group"
          >
            <span>Browse All Domains</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 8 Categories Grid */}
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              variants={cardItemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            >
              <Link
                to={`/blog?category=${encodeURIComponent(cat.name)}`}
                className="group relative p-6 rounded-2xl surface-card border border-line hover:border-[#0F6B4F]/40 transition-colors duration-300 shadow-xl shadow-black/30 flex flex-col justify-between overflow-hidden h-full"
              >
                {/* Subtle top-right gradient flare on hover */}
                <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-bl ${cat.color} opacity-0 group-hover:opacity-15 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-soft border border-line flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <span className="text-xs font-mono text-muted px-2.5 py-1 rounded-full bg-page border border-line">
                      {cat.articleCount} Articles
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-heading group-hover:text-[#0F6B4F] transition-colors mb-2">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-line flex items-center justify-between text-xs font-semibold text-[#06B6D4]">
                  <span>Explore Domain</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          3. CODE OF THE DAY COMPONENT
          ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full surface-card border border-line text-xs font-mono text-[#06B6D4]">
            <Flame size={13} />
            <span>Interactive Terminal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
            Code of the Day
          </h2>
          <p className="text-sm text-muted">
            Sharpen your fundamentals with daily syntax snippets and computational mental models.
          </p>
        </div>

        <CodeEditorSnippet />
      </section>

      {/* ═══════════════════════════════════════════
          4. LATEST FROM TECHJOURNEY (BLOGS)
          ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#0F6B4F] font-semibold">
                Technical Publication
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
              Latest From TechJourney
            </h2>
            <p className="text-sm sm:text-base text-muted mt-1 max-w-xl">
              Deep architectural guides, network internals, and interview masterclasses written by seasoned engineers.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl surface-card border border-line hover:border-[#0F6B4F]/35 text-xs sm:text-sm font-semibold text-heading hover:text-white transition-all group"
            >
              <span>View Blogs</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/articles"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-600/10 border border-primary-500/25 hover:border-primary-500/50 text-xs sm:text-sm font-semibold text-primary-400 hover:text-primary-300 transition-all group"
            >
              <span>View Articles</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {blogs.slice(0, 6).map((article) => (
            <motion.div
              key={article._id || article.slug}
              variants={cardItemVariants}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="h-full"
            >
              <Link
                to={article.type === 'article' ? `/article/${article.slug}` : `/blog/${article.slug}`}
                className="blog-card rounded-2xl overflow-hidden group flex flex-col hover:border-[#0F6B4F]/35 transition-all duration-300 h-full"
              >
                {/* Cover Image Container */}
                <div className="aspect-[16/9] w-full overflow-hidden bg-[#111827] relative">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="blog-card-image w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0B1120]/80 text-[#06B6D4] border border-cyan-500/30 backdrop-blur-md">
                      {article.category?.name || 'Engineering'}
                    </span>

                    {article.difficulty && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#0B1120]/80 text-heading border border-line backdrop-blur-md">
                        {article.difficulty}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col flex-grow space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {article.readingTime} min read
                    </span>
                    <span>•</span>
                    <span>{new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <h3 className="text-lg font-bold text-heading group-hover:text-[#0F6B4F] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted line-clamp-2 flex-grow leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Author & Read More Footer */}
                  <div className="pt-4 border-t border-line flex items-center justify-between text-xs mt-auto">
                    <div className="flex items-center gap-2">
                      {article.author?.avatar ? (
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-line"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center text-[10px] font-bold text-blue-300">
                          {article.author?.name?.charAt(0) || 'A'}
                        </div>
                      )}
                      <span className="text-heading font-medium text-xs">
                        {article.author?.name || 'TechJourney Contributor'}
                      </span>
                    </div>

                    <span className="font-semibold text-[#0F6B4F] group-hover:text-[#16805E] transition-colors flex items-center gap-1">
                      Read More <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          4.5 ADVERTISEMENT SECTION
          ═══════════════════════════════════════════ */}
      <AdvertisementSection />

      {/* ═══════════════════════════════════════════
          5. DEVELOPER ROADMAPS (INTERACTIVE JOURNEY)
          ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface-card border border-line text-xs font-mono text-[#8B5CF6]">
            <Compass size={14} />
            <span>Structured Learning Paths</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-heading tracking-tight">
            Choose Your <span className="tech-gradient-text">Developer Journey</span>
          </h2>
          <p className="text-sm sm:text-base text-muted">
            Interactive career roadmaps mapped to the actual skills demanded by top engineering organizations.
          </p>
        </div>

        {/* Connected Node Flow Component */}
        <RoadmapInteractiveFlow />
      </section>

      {/* ═══════════════════════════════════════════
          6. LEARN PROGRAMMING
          ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gradient-to-br from-[#0F6B4F]/5 via-transparent to-[#16805E]/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-soft border border-line text-[#0F6B4F]">
                <Code2 size={16} />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#0F6B4F] font-bold">
                Language Hub
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-heading tracking-tight mb-2">
              Learn <span className="tech-gradient-text">Programming</span>
            </h2>
            <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed">
              Master the core syntax, paradigms, and design patterns across industry-standard languages through comprehensive, interactive guides.
            </p>
          </div>

          <Link
            to="/programming"
            className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-soft border border-line hover:border-[#0F6B4F]/40 text-sm font-semibold text-heading hover:text-[#0F6B4F] transition-all group shrink-0 shadow-sm hover:shadow-md"
          >
            <span>Explore All Languages</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Languages Grid */}
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
        >
          {PROGRAMMING_LANGUAGES.map((lang) => (
            <motion.div
              key={lang.slug}
              variants={cardItemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="group relative flex flex-col justify-between p-6 rounded-2xl surface-card hover:border-[#0F6B4F]/40 transition-colors duration-300 overflow-hidden"
            >
              {/* Animated Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0F6B4F]/0 to-[#0F6B4F]/0 group-hover:from-[#0F6B4F]/5 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Glowing Top Border Effect */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0F6B4F]/0 to-transparent group-hover:via-[#0F6B4F]/50 transition-all duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-page border border-line flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                    {lang.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#0F6B4F] bg-[#0F6B4F]/10 border border-[#0F6B4F]/20 px-3 py-1 rounded-full font-bold shadow-sm">
                    {lang.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-heading group-hover:text-[#0F6B4F] transition-colors mb-2 tracking-tight">
                  {lang.name}
                </h3>

                <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
                  {lang.description}
                </p>

                <div className="flex items-center gap-3 text-xs font-medium text-muted bg-page/50 rounded-lg p-2.5 border border-line/50">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[#0F6B4F]/70" />
                    <span>{lang.tutorialCount} Guides</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-line" />
                  <div className="flex items-center gap-1.5">
                    <Flame size={14} className="text-orange-500/70" />
                    <span>{lang.popularity}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-line/50 relative z-10">
                <Link
                  to="/programming"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-page border border-line hover:border-[#0F6B4F]/50 hover:bg-[#0F6B4F]/5 text-sm font-bold text-heading hover:text-[#0F6B4F] transition-all group/btn shadow-sm"
                >
                  <span>Start Learning</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          7. WHAT'S HAPPENING IN TECH? (TECH NEWS)
          ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#EF4444] font-semibold">
                Industry Radar
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight">
              What's Happening in Tech?
            </h2>
            <p className="text-sm sm:text-base text-muted mt-1 max-w-xl">
              Breakthrough developments in AI, cloud runtimes, browser standards, and quantum silicon.
            </p>
          </div>

          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl surface-card border border-line hover:border-red-500/40 text-sm font-semibold text-heading hover:text-white transition-all group shrink-0"
          >
            <Newspaper size={16} className="text-[#EF4444]" />
            <span>Tech News Feed</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal News Cards Grid */}
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {TECH_NEWS.slice(0, 4).map((item) => (
            <motion.div
              key={item.id}
              variants={cardItemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="p-5 rounded-2xl surface-card border border-line hover:border-[#0F6B4F]/35 transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:items-center group"
            >
              {/* Image */}
              <div className="w-full sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden bg-[#0B1120] relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text */}
              <div className="space-y-1.5 flex-grow">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${item.badgeColor}`}>
                    {item.category}
                  </span>
                  <span className="text-[11px] text-muted font-mono">
                    {item.date}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-heading group-hover:text-[#0F6B4F] transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted">{item.source} • {item.readTime}</span>
                  <Link
                    to="/news"
                    className="text-xs font-semibold text-[#06B6D4] hover:underline inline-flex items-center gap-1"
                  >
                    Read <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          8. ANIMATED STATISTICS
          ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsCounter />
      </section>

      {/* ═══════════════════════════════════════════
          9. NEWSLETTER BANNER
          ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterBanner />
      </section>
    </div>
  );
}
