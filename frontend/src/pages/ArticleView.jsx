import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import {
  ArrowLeft, Clock, Calendar, Eye, Heart, Bookmark,
  Share2, Tag as TagIcon, ChevronUp, Copy, Check, Users, Sparkles,
  MessageSquare, Send, BookOpen, ArrowRight, List, Edit3,
  Layers, ExternalLink, Server, Activity, Cpu, ArrowUpRight
} from 'lucide-react';
import { ARTICLES } from '../data/mockData';
import api from '../services/api';

/* ─── Reading Progress Bar ─── */
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-page">
      <div
        className="h-full bg-gradient-to-r from-[#0F6B4F] via-[#16805E] to-[#22C55E] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

/* ─── Code Block with Copy ─── */
const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || '';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="relative group my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 surface-card border border-line border-b-0 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
          </div>
          {language && (
            <span className="text-xs text-muted font-mono font-medium ml-2 uppercase">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-heading transition-colors px-2 py-1 rounded-md hover:bg-[#0F6B4F]/20 text-[#0F6B4F]"
        >
          {copied ? (
            <>
              <Check size={13} className="text-[#22C55E]" />
              <span className="text-[#22C55E]">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <pre className="!mt-0 !rounded-t-none !border-t-0 !surface-card/50 border border-line rounded-b-xl overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

/* ─── Scroll to Top ─── */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisible, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-xl surface-card border border-line flex items-center justify-center text-muted hover:text-heading hover:bg-soft hover:text-[#0F6B4F] transition-all shadow-xl shadow-black/60"
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} />
    </button>
  );
};

/* ─── Interactive Linked System Button ─── */
const LinkedSystemButton = ({ linkedSystem }) => {
  if (!linkedSystem || !linkedSystem.url) return null;

  const isExternal = /^https?:\/\//i.test(linkedSystem.url);
  const title = linkedSystem.title?.trim() || 'Launch Linked System';
  const systemType = linkedSystem.systemType?.trim() || 'Live System';
  const description = linkedSystem.description?.trim();

  const buttonInner = (
    <motion.div
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="relative group overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#0c1f17] via-surface-card to-[#091712] border border-[#0F6B4F]/40 hover:border-[#22C55E]/70 transition-all duration-300 shadow-xl shadow-black/40 hover:shadow-[#0F6B4F]/25 cursor-pointer"
    >
      {/* Top subtle decorative gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F6B4F] via-[#22C55E] to-[#16805E]" />

      <div className="relative z-10 space-y-3 pt-1">
        {/* Status header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]" />
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#22C55E]">
              {systemType}
            </span>
          </div>

          <span className="text-[10px] font-mono text-muted group-hover:text-heading transition-colors flex items-center gap-1">
            {isExternal ? (
              <>
                <span>Live System</span>
                <ExternalLink size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#22C55E]" />
              </>
            ) : (
              <>
                <span>Internal Route</span>
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform text-[#22C55E]" />
              </>
            )}
          </span>
        </div>

        {/* Title and Icon */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#0F6B4F] to-[#16805E] text-white shadow-md shadow-[#0F6B4F]/30 group-hover:scale-105 transition-transform flex-shrink-0">
            <Server size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-heading group-hover:text-[#22C55E] transition-colors leading-snug">
              {title}
            </h4>
            {description && (
              <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="pt-2 border-t border-line/60 flex items-center justify-between">
          <span className="text-[11px] font-mono text-muted truncate max-w-[170px]" title={linkedSystem.url}>
            {linkedSystem.url.replace(/^https?:\/\//, '')}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0F6B4F] to-[#16805E] group-hover:from-[#16805E] group-hover:to-[#22C55E] text-white font-semibold text-xs shadow-sm transition-all group-hover:translate-x-0.5">
            <span>Access System</span>
            {isExternal ? <ExternalLink size={12} /> : <ArrowRight size={12} />}
          </span>
        </div>
      </div>
    </motion.div>
  );

  if (isExternal) {
    return (
      <a
        href={linkedSystem.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline"
        title={`Open linked system: ${title}`}
      >
        {buttonInner}
      </a>
    );
  }

  return (
    <Link
      to={linkedSystem.url}
      className="block no-underline"
      title={`Navigate to linked system: ${title}`}
    >
      {buttonInner}
    </Link>
  );
};

/* ─── Header Quick-Action Pill for Linked System ─── */
const LinkedSystemQuickButton = ({ linkedSystem }) => {
  if (!linkedSystem || !linkedSystem.url) return null;
  const isExternal = /^https?:\/\//i.test(linkedSystem.url);

  const btnContent = (
    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0F6B4F] to-[#16805E] hover:from-[#16805E] hover:to-[#22C55E] text-white text-xs font-bold shadow-md shadow-[#0F6B4F]/25 hover:shadow-[#0F6B4F]/40 hover:scale-[1.02] transition-all cursor-pointer">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
      </span>
      <span>Linked System</span>
      {isExternal ? <ExternalLink size={13} /> : <ArrowRight size={13} />}
    </div>
  );

  return isExternal ? (
    <a href={linkedSystem.url} target="_blank" rel="noopener noreferrer" title={`Launch linked system: ${linkedSystem.title || 'System'}`}>
      {btnContent}
    </a>
  ) : (
    <Link to={linkedSystem.url} title={`Launch linked system: ${linkedSystem.title || 'System'}`}>
      {btnContent}
    </Link>
  );
};

export default function ArticleView() {
  const { slug } = useParams();
  const location = useLocation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const isArticleRoute = Boolean(
    location.pathname.startsWith('/article') || 
    article?.type === 'article'
  );
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const isAuthor = Boolean(
    userInfo?._id &&
    article?.author &&
    String(article.author?._id || article.author) === String(userInfo._id)
  );

  // Local comments state
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'David K.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      date: '2 days ago',
      content: 'Incredible breakdown! The explanation of the TCP handshake and physical fiber repeaters really connected the dots for me.'
    },
    {
      id: 2,
      author: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      date: 'Yesterday',
      content: 'Bookmarking this for my upcoming systems architecture interview. Clear, concise, and beautifully formatted.'
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  // Check bookmarks in localStorage
  useEffect(() => {
    try {
      const savedBookmarks = JSON.parse(localStorage.getItem('techjourney_bookmarks') || '[]');
      setIsBookmarked(savedBookmarks.includes(slug));
    } catch {
      // ignore
    }
  }, [slug]);

  useEffect(() => {
    let isMounted = true;
    const fetchArticle = async () => {
      // 1. Check if slug matches local built-in articles first
      const localArticle = ARTICLES.find((a) => a.slug === slug || a._id === slug);
      if (localArticle) {
        if (isMounted) {
          setArticle(localArticle);
          setLikesCount(localArticle.likesCount || 85);
          setLoading(false);
        }
        return;
      }

      // 2. Fetch from backend API for database-stored articles
      try {
        setLoading(true);
        const { data } = await api.get(`/articles/${slug}`);
        if (isMounted && data && data.data) {
          setArticle(data.data);
          setLikesCount(data.data.likes ?? (data.data.likesCount || 120));
        } else if (isMounted) {
          setArticle(null);
        }
      } catch (error) {
        if (isMounted) {
          // Double-check fallback
          const fallback = ARTICLES.find((a) => a.slug === slug || a._id === slug);
          if (fallback) {
            setArticle(fallback);
            setLikesCount(fallback.likesCount || 85);
          } else {
            setArticle(null);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Generate Table of Contents from markdown headings
  const tableOfContents = useMemo(() => {
    if (!article || !article.content) return [];
    const lines = article.content.split('\n');
    const headings = [];
    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headings.push({ level, text, id });
      }
    });
    return headings;
  }, [article]);

  // Resolve linked system configuration for the article
  const resolvedLinkedSystem = useMemo(() => {
    if (!article) return null;
    if (article.linkedSystem && (article.linkedSystem.url || article.linkedSystem.enabled)) {
      return {
        enabled: article.linkedSystem.enabled !== false,
        title: article.linkedSystem.title || 'Launch Linked System',
        url: article.linkedSystem.url,
        systemType: article.linkedSystem.systemType || 'Live System',
        description: article.linkedSystem.description || '',
      };
    }
    // Check if flat fields were provided
    if (article.linkedSystemUrl) {
      return {
        enabled: article.linkedSystemEnabled !== false,
        title: article.linkedSystemTitle || 'Launch Linked System',
        url: article.linkedSystemUrl,
        systemType: article.linkedSystemType || 'Live System',
        description: article.linkedSystemDescription || '',
      };
    }
    return null;
  }, [article]);

  const hasLinkedSystem = Boolean(resolvedLinkedSystem && resolvedLinkedSystem.url);

  const handleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
  };

  const handleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    try {
      const saved = JSON.parse(localStorage.getItem('techjourney_bookmarks') || '[]');
      const updated = next ? [...saved, slug] : saved.filter((s) => s !== slug);
      localStorage.setItem('techjourney_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
        return;
      } catch {
        // fallback
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const authorName = commentAuthor.trim() || 'Fellow Developer';
    const commentObj = {
      id: Date.now(),
      author: authorName,
      avatar: '',
      date: 'Just now',
      content: newComment.trim()
    };
    setComments([commentObj, ...comments]);
    setNewComment('');
  };

  // Related content — strictly match type (articles for article page, blogs for blog page)
  const relatedArticles = useMemo(() => {
    return ARTICLES.filter((a) => {
      if (a.slug === slug) return false;
      if (isArticleRoute) {
        return a.type === 'article';
      }
      return !a.type || a.type === 'blog';
    }).slice(0, 3);
  }, [slug, isArticleRoute]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-12 px-4">
        <div className="skeleton h-6 w-32 rounded-full" />
        <div className="skeleton h-12 w-full rounded-xl" />
        <div className="skeleton h-6 w-2/3 rounded-lg" />
        <div className="skeleton aspect-video w-full rounded-2xl" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center px-4">
        <div className="p-12 rounded-2xl surface-card border border-line space-y-4">
          <h2 className="text-2xl font-bold text-heading">Article Not Found</h2>
          <p className="text-sm text-muted">
            The requested technical document or slug could not be located.
          </p>
          <Link
            to={isArticleRoute ? "/articles" : "/blog"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F6B4F] hover:bg-[#0C5A42] text-heading font-semibold text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{isArticleRoute ? "Back to All Articles" : "Back to Technical Blogs"}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReadingProgress />
      <ScrollToTop />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Link */}
        <Link
          to={isArticleRoute ? "/articles" : "/blog"}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted hover:text-[#0F6B4F] transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>{isArticleRoute ? "Back to All Articles" : "Back to All Blogs"}</span>
        </Link>

        {/* ═══ ARTICLE HERO HEADER ═══ */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-4xl space-y-6 pb-8 border-b border-line"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0F6B4F]/10 text-[#0F6B4F] border border-[#0F6B4F]/20 shadow-sm">
              {article.category?.name || 'Technical Deep Dive'}
            </span>
            {article.difficulty && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-soft text-heading border border-line shadow-sm">
                {article.difficulty} Level
              </span>
            )}
            <span className="text-xs font-mono text-muted flex items-center gap-1">
              <Clock size={12} /> {article.readingTime || 8} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-heading tracking-tight leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-base sm:text-xl text-muted leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Author & Action Buttons Bar */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {article.author?.avatar ? (
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-line"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0F6B4F] to-[#16805E] flex items-center justify-center text-sm font-bold text-heading">
                  {article.author?.name?.charAt(0) || 'E'}
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-heading">
                  {article.author?.name || 'Dr. Elena Rostova'}
                </div>
                <div className="text-xs text-muted">
                  {article.author?.role || 'Staff Engineer'} • {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Like, Bookmark, Share Buttons & Author Edit & Linked System */}
            <div className="flex flex-wrap items-center gap-2">
              {hasLinkedSystem && (
                <LinkedSystemQuickButton linkedSystem={resolvedLinkedSystem} />
              )}

              {isAuthor && article._id && (
                <Link
                  to={article.type === 'article' ? `/admin/edit-article/${article._id}` : `/admin/edit-blog/${article._id}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-soft text-heading border border-line text-xs font-semibold hover:border-[#0F6B4F]/40 hover:text-[#0F6B4F] transition-all shadow-sm"
                  title="Edit your publication"
                >
                  <Edit3 size={14} />
                  <span>Edit Post</span>
                </Link>
              )}

              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isLiked
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-sm'
                    : 'surface-card text-muted border-line hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5'
                }`}
                title="Like article"
              >
                <Heart size={15} className={isLiked ? 'fill-current text-red-400' : ''} />
                <span>{likesCount}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleBookmark}
                className={`p-2 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-[#0F6B4F]/10 text-[#0F6B4F] border-[#0F6B4F]/40'
                    : 'surface-card text-muted border-line hover:text-[#0F6B4F] hover:border-[#0F6B4F]/30 hover:bg-[#0F6B4F]/5'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Save bookmark'}
              >
                <Bookmark size={15} className={isBookmarked ? 'fill-current text-blue-400' : ''} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl surface-card border border-line text-xs font-semibold text-muted hover:text-heading hover:border-[#0F6B4F]/30 hover:text-[#0F6B4F] hover:bg-[#0F6B4F]/5 transition-all"
                title="Share article"
              >
                {copiedShare ? (
                  <>
                    <Check size={14} className="text-[#22C55E]" />
                    <span className="text-[#22C55E]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} />
                    <span>Share</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* ═══ TWO-COLUMN ARTICLE BODY + TOC ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
          {/* Main Article Content (8 cols) */}
          <main className="lg:col-span-8 space-y-8">
            {/* Cover Image */}
            {article.coverImage && (
              <div className="rounded-2xl overflow-hidden border border-line shadow-2xl shadow-black/50 aspect-[16/9]">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Markdown Content */}
            <div className="article-content font-sans text-heading">
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    if (!inline && className) {
                      return <CodeBlock className={className}>{children}</CodeBlock>;
                    }
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-soft text-[#0F6B4F] font-mono text-xs border border-line" {...props}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => <h1 className="text-3xl sm:text-4xl font-extrabold text-heading mt-8 mb-4">{children}</h1>,
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                    return (
                      <h2 id={id} className="text-2xl font-bold text-heading mt-10 mb-4 pb-2 border-b border-line flex items-center gap-2 scroll-mt-28">
                        <span className="text-[#0F6B4F]">#</span> {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => <h3 className="text-xl font-bold text-heading mt-6 mb-3">{children}</h3>,
                  p: ({ children }) => <p className="text-base text-muted leading-relaxed mb-5">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-5 text-muted">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-5 text-muted">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#0F6B4F] bg-soft px-5 py-4 rounded-r-xl my-6 text-heading">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 rounded-xl border border-line">
                      <table className="w-full text-left text-sm text-muted">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-soft text-heading border-b border-line font-mono">{children}</thead>,
                  th: ({ children }) => <th className="p-3 font-semibold">{children}</th>,
                  td: ({ children }) => <td className="p-3 border-t border-line/40">{children}</td>,
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* ═══ COMMENTS SECTION ═══ */}
            <section className="pt-12 border-t border-line space-y-6">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-[#0F6B4F]" />
                <h3 className="text-2xl font-bold text-heading">
                  Discussion &amp; Insights ({comments.length})
                </h3>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="p-5 rounded-2xl bg-page border border-line space-y-3">
                <input
                  type="text"
                  placeholder="Your Name (or alias)..."
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl surface-card border border-line text-sm text-heading placeholder-[#94A3B8] focus:outline-none focus:border-[#0F6B4F]"
                />
                <textarea
                  rows={3}
                  placeholder="Join the discussion or ask a technical question..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl surface-card border border-line text-sm text-heading placeholder-[#94A3B8] focus:outline-none focus:border-[#0F6B4F] resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-heading font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-[#0F6B4F]/15"
                  >
                    <Send size={13} />
                    <span>Post Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl surface-card border border-line space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {c.avatar ? (
                          <img src={c.avatar} alt={c.author} className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-600/30 flex items-center justify-center text-xs font-bold text-blue-300">
                            {c.author.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold text-xs text-heading">{c.author}</span>
                      </div>
                      <span className="text-[11px] font-mono text-muted">{c.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed pl-9">
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Sticky Sidebar: Article Page Details & Table of Contents (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* ═══ ARTICLE PAGE DETAILS SECTION ═══ */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }}
              className="p-6 rounded-2xl bg-page border border-line space-y-5 shadow-xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#0F6B4F]/15 text-[#0F6B4F]">
                    <Layers size={16} />
                  </div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-heading">
                    Article Page Details
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-soft text-[#0F6B4F] border border-[#0F6B4F]/30 font-semibold">
                  Technical Specs
                </span>
              </div>

              {/* Technical Specifications List */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-line/40">
                  <span className="text-muted flex items-center gap-1.5">
                    <Clock size={13} className="text-muted" />
                    <span>Reading Duration:</span>
                  </span>
                  <strong className="text-heading font-mono">{article.readingTime || 8} min read</strong>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-line/40">
                  <span className="text-muted flex items-center gap-1.5">
                    <BookOpen size={13} className="text-muted" />
                    <span>Technical Level:</span>
                  </span>
                  <strong className="text-[#0F6B4F] font-semibold">{article.difficulty || 'Intermediate'}</strong>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-line/40">
                  <span className="text-muted flex items-center gap-1.5">
                    <TagIcon size={13} className="text-muted" />
                    <span>Category:</span>
                  </span>
                  <strong className="text-heading font-medium">{article.category?.name || 'Computer Science'}</strong>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-line/40">
                  <span className="text-muted flex items-center gap-1.5">
                    <Eye size={13} className="text-muted" />
                    <span>Total Reads:</span>
                  </span>
                  <strong className="text-heading font-mono">{(article.views || 1420).toLocaleString()} views</strong>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted flex items-center gap-1.5">
                    <Activity size={13} className="text-[#22C55E]" />
                    <span>System Status:</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#22C55E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                    {hasLinkedSystem ? 'Linked System Online' : 'Verified Documentation'}
                  </span>
                </div>
              </div>

              {/* ═══ LINKED SYSTEM BUTTON ═══ */}
              <div className="pt-2">
                <div className="text-[11px] font-mono uppercase font-semibold text-muted mb-2.5 flex items-center justify-between">
                  <span>Linked System Button</span>
                  {hasLinkedSystem && resolvedLinkedSystem?.systemType && (
                    <span className="text-[10px] text-[#22C55E] font-bold">
                      {resolvedLinkedSystem.systemType}
                    </span>
                  )}
                </div>

                {hasLinkedSystem ? (
                  <LinkedSystemButton linkedSystem={resolvedLinkedSystem} />
                ) : (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c1f17]/60 via-surface-card to-[#091712]/60 border border-line text-xs text-muted space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-heading font-bold text-xs">
                        <Server size={14} className="text-[#0F6B4F]" />
                        <span>Interactive System Sandbox</span>
                      </div>
                      <span className="text-[9px] font-mono text-[#0F6B4F] bg-[#0F6B4F]/10 px-1.5 py-0.5 rounded border border-[#0F6B4F]/20">
                        Default
                      </span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Practice coding problems, test algorithms, and explore system architectures in the ProblemHub platform.
                    </p>
                    <Link
                      to="/problemhub"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F6B4F] hover:bg-[#16805E] text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <span>Launch ProblemHub</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <div className="sticky top-28 p-6 rounded-2xl bg-page border border-line space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#0F6B4F]">
                  <List size={14} />
                  <span>Table of Contents</span>
                </div>
                <nav className="space-y-1.5 text-xs text-muted max-h-72 overflow-y-auto pr-1">
                  {tableOfContents.map((item, idx) => (
                    <a
                      key={idx}
                      href={`#${item.id}`}
                      className="block py-1 hover:text-heading hover:underline transition-colors hover:text-[#16805E] pl-2 border-l border-line hover:border-[#0F6B4F]"
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </aside>
        </div>

        {/* ═══ RELATED ARTICLES ═══ */}
        <section className="pt-16 mt-16 border-t border-line space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#0F6B4F] font-semibold">
                Explore More
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-heading">
                Related Engineering Guides
              </h3>
            </div>
            <Link
              to={isArticleRoute ? "/articles" : "/blog"}
              className="text-xs font-semibold text-[#0F6B4F] hover:underline flex items-center gap-1"
            >
              Browse All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                to={rel.type === 'article' || isArticleRoute ? `/article/${rel.slug}` : `/blog/${rel.slug}`}
                className="p-5 rounded-2xl surface-card border border-line hover:border-[#0F6B4F]/35 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-[#0F6B4F] px-2 py-0.5 rounded bg-cyan-500/10 border border-[#0F6B4F]/20 inline-block">
                    {rel.category.name}
                  </span>
                  <h4 className="text-base font-bold text-heading group-hover:text-[#0F6B4F] transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-muted line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-line flex items-center justify-between text-xs text-muted mt-4">
                  <span>{rel.readingTime} min read</span>
                  <span className="text-[#0F6B4F] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
