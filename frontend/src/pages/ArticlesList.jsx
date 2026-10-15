import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Eye, ArrowRight, Search, FileText, Sparkles, Filter } from 'lucide-react';
import api from '../services/api';
import { CURATED_ARTICLES } from '../data/mockData';

const articleDeckVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 }
  }
};

const articleCardPerspectiveVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

/* ─── Skeleton ─── */
const SkeletonCard = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <div className="aspect-video skeleton" />
    <div className="p-6 space-y-3">
      <div className="skeleton h-3 w-20 rounded-full" />
      <div className="skeleton h-5 w-full rounded-lg" />
      <div className="skeleton h-5 w-3/4 rounded-lg" />
      <div className="skeleton h-3 w-full rounded-lg mt-3" />
      <div className="skeleton h-3 w-2/3 rounded-lg" />
      <div className="flex justify-between mt-4 pt-4 border-t border-white/5">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-3 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

const ArticlesList = () => {
  const [articles, setArticles] = useState(CURATED_ARTICLES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Artificial Intelligence',
    'Machine Learning',
    'Generative AI',
    'Robotics',
    'Web Technology',
    'Internet & Networking',
    'Hardware',
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/articles?type=article');
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        // Strictly filter to ensure only articles are included
        const onlyArticles = list.filter((a) => a.type === 'article');
        if (isMounted) {
          if (onlyArticles.length > 0) {
            const dbSlugs = new Set(onlyArticles.map((a) => a.slug));
            const missingDefaults = CURATED_ARTICLES.filter((a) => !dbSlugs.has(a.slug));
            setArticles([...onlyArticles, ...missingDefaults]);
          } else {
            setArticles(CURATED_ARTICLES);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch articles from backend, using curated fallback:', error.message);
        if (isMounted) setArticles(CURATED_ARTICLES);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchArticles();
    return () => { isMounted = false; };
  }, []);

  // Strictly enforce articles only
  const safeArticles = (Array.isArray(articles) ? articles : []).filter((a) => a.type === 'article');

  const filteredArticles = safeArticles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === 'All' || a.difficulty === selectedDifficulty;
    const articleCat = a.category?.name || '';
    const matchesCategory =
      selectedCategory === 'All' || articleCat.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* ═══ Page Header ═══ */}
      <div className="relative py-8 sm:py-12 border-b border-line overflow-hidden">
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full surface-card border border-line text-xs font-mono text-purple-400">
            <Sparkles size={14} />
            <span>Curated Engineering Knowledge</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-heading tracking-tight">
            Curated Articles &amp; <span className="tech-gradient-text">Guides</span>
          </h1>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            In-depth architectural patterns, production deep-dives, and detailed engineering walkthroughs.
          </p>
        </div>
      </div>

      {/* ═══ Controls: Search & Difficulty Filter ═══ */}
      <div className="space-y-6">
        <div className="p-4 sm:p-5 rounded-2xl surface-card border border-line shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-[#0F6B4F] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-page border border-line hover:border-[#0F6B4F]/40 focus:border-[#0F6B4F] focus:ring-4 focus:ring-[#0F6B4F]/10 outline-none text-heading placeholder:text-muted/70 text-sm transition-all shadow-inner"
            />
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none px-1">
            {difficulties.map((diff) => (
              <motion.button
                key={diff}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm shrink-0 ${
                  selectedDifficulty === diff
                    ? 'bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white shadow-md shadow-[#0F6B4F]/30 scale-105 border border-transparent'
                    : 'bg-page text-muted border border-line hover:text-heading hover:border-[#0F6B4F]/50 hover:bg-[#0F6B4F]/5'
                }`}
              >
                {diff}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none px-1">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm shrink-0 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white shadow-md shadow-[#0F6B4F]/30 scale-105 border border-transparent'
                  : 'bg-page text-muted border border-line hover:text-heading hover:border-[#0F6B4F]/50 hover:bg-[#0F6B4F]/5'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ═══ Articles Grid ═══ */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-5">
            <FileText size={28} className="text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {searchQuery || selectedDifficulty !== 'All'
              ? 'No matching articles'
              : 'No articles published yet'}
          </h3>
          <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">
            {searchQuery || selectedDifficulty !== 'All'
              ? 'Try modifying your search query or difficulty filter.'
              : 'Technical articles created with the Article Editor will be displayed exclusively here.'}
          </p>
          <Link
            to="/admin/add-article"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all shadow-lg shadow-primary-600/20"
          >
            + Create an Article
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedDifficulty !== 'All' && ` (${selectedDifficulty})`}
            </span>
          </div>

          <motion.div
            key={`${selectedCategory}-${selectedDifficulty}-${searchQuery}`}
            variants={articleDeckVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredArticles.map((article) => (
              <motion.div
                key={article._id}
                variants={articleCardPerspectiveVariants}
                whileHover={{ y: -8, rotateX: 2, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="h-full"
              >
                <Link
                  to={`/article/${article.slug}`}
                  className="article-card glass-card rounded-2xl overflow-hidden group flex flex-col hover:border-primary-500/40 transition-colors h-full"
                >
                  {/* Image */}
                  <div className="aspect-video overflow-hidden bg-surface-700 relative">
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="blog-card-image w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/40 via-surface-800 to-surface-900">
                        <FileText size={34} className="text-primary-400/60" />
                      </div>
                    )}
                    {article.difficulty && (
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                          article.difficulty === 'Beginner'
                            ? 'bg-success/15 text-green-400 border border-success/20'
                            : article.difficulty === 'Intermediate'
                            ? 'bg-warning/15 text-yellow-400 border border-warning/20'
                            : 'bg-error/15 text-red-400 border border-error/20'
                        }`}>
                          {article.difficulty}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-400 uppercase tracking-wider">
                        <FileText size={12} />
                        {article.category?.name || 'Technical Article'}
                      </span>
                      {(article.linkedSystem?.enabled || (article.linkedSystem?.url && article.linkedSystem?.url.trim())) && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Linked System
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-sm text-text-secondary line-clamp-2 flex-grow leading-relaxed">
                      {article.excerpt}
                    </p>

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
                      </div>
                      <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ArticlesList;
