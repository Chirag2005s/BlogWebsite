import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen, Clock, ArrowRight, Search, Filter, Sparkles,
  ChevronLeft, ChevronRight, SlidersHorizontal, Calendar, Eye,
  Flame, CheckCircle2
} from 'lucide-react';
import { ARTICLES, BLOGS } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

const CATEGORIES_LIST = [
  'All',
  'Programming',
  'Web Development',
  'Backend',
  'Frontend',
  'AI',
  'Machine Learning',
  'Networking',
  'Computer Science',
  'Operating Systems',
  'Hardware',
  'Technology'
];

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [articles, setArticles] = useState(BLOGS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'popular' | 'readingTime'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Fetch only blogs (type=blog) from backend and combine with built-in blogs
  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/articles?type=blog');
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        // Strictly filter to ensure only blogs are added
        const onlyBlogs = list.filter((a) => !a.type || a.type === 'blog');
        if (isMounted && onlyBlogs.length > 0) {
          const dbSlugs = new Set(onlyBlogs.map((a) => a.slug));
          const missingDefaults = BLOGS.filter((a) => !dbSlugs.has(a.slug));
          setArticles([...onlyBlogs, ...missingDefaults]);
        }
      } catch (err) {
        console.warn('Backend blogs fetch notice, using built-in blogs fallback:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBlogs();
    return () => { isMounted = false; };
  }, []);

  // Sync category param
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Filter & Sort Logic — Strictly show blogs only
  const filteredArticles = useMemo(() => {
    let result = articles.filter((a) => {
      // Exclude any non-blog items
      if (a.type && a.type !== 'blog') return false;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        a.title.toLowerCase().includes(q) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q));

      const artCat = (a.category?.name || a.category || '').toLowerCase();
      const targetCat = selectedCategory.toLowerCase();

      const matchesCategory = selectedCategory === 'All' ||
        artCat.includes(targetCat) ||
        targetCat.includes(artCat) ||
        (selectedCategory === 'Networking' && artCat.includes('network')) ||
        (selectedCategory === 'AI' && (artCat.includes('ai') || artCat.includes('machine learning'))) ||
        (selectedCategory === 'Frontend' && artCat.includes('web'));

      const matchesDifficulty = selectedDifficulty === 'All' ||
        (a.difficulty && a.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    } else if (sortBy === 'readingTime') {
      result.sort((a, b) => (a.readingTime || 5) - (b.readingTime || 5));
    }

    return result;
  }, [articles, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  // Featured Article is always the highest rated / first item
  const featuredArticle = filteredArticles[0] || ARTICLES[0];
  const gridArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredArticles.length / pageSize) || 1;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <PageHeader
        icon={BookOpen}
        eyebrow="Developer Knowledge Hub"
        title="Technical "
        titleAccent="Blogs"
        description="In-depth guides, distributed systems architectures, programming language deep dives, and operating system internals."
      />

      {/* ═══ FEATURED ARTICLE BANNER ═══ */}
      {featuredArticle && (
        <div className="relative rounded-3xl overflow-hidden surface-card border border-line shadow-2xl shadow-black/60 group hover:border-[#0F6B4F]/35 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Image (7 cols) */}
            <div className="lg:col-span-7 h-64 sm:h-80 lg:h-full relative overflow-hidden">
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent lg:hidden" />
            </div>

            {/* Content (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {featuredArticle.category?.name || 'Featured'}
                </span>
                <span className="text-xs font-mono text-muted flex items-center gap-1">
                  <Clock size={12} /> {featuredArticle.readingTime} min read
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-medium border border-blue-500/20">
                  {featuredArticle.difficulty}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-heading group-hover:text-[#0F6B4F] transition-colors leading-snug">
                <Link to={`/blog/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h2>

              <p className="text-sm text-muted line-clamp-3 leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {featuredArticle.author?.avatar ? (
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-line"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-xs font-bold text-blue-300">
                      {featuredArticle.author?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div className="text-xs">
                    <div className="font-semibold text-white">{featuredArticle.author?.name || 'Staff Engineer'}</div>
                    <div className="text-muted">{new Date(featuredArticle.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>

                <Link
                  to={`/blog/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white font-bold text-xs shadow-md shadow-[#0F6B4F]/15 hover:opacity-95 transition-all"
                >
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FILTER & CONTROLS TOOLBAR ═══ */}
      <div className="space-y-6">
        {/* Search & Sort Container */}
        <div className="p-4 sm:p-5 rounded-2xl surface-card border border-line shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-[28rem] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-[#0F6B4F] transition-colors" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search articles, tutorials, or keywords..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-page border border-line hover:border-[#0F6B4F]/40 focus:border-[#0F6B4F] focus:ring-4 focus:ring-[#0F6B4F]/10 outline-none text-heading placeholder:text-muted/70 transition-all text-sm shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-muted hidden sm:block" />
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-page border border-line hover:border-[#0F6B4F]/50 focus:border-[#0F6B4F] focus:ring-4 focus:ring-[#0F6B4F]/10 outline-none text-xs font-bold text-heading transition-all cursor-pointer shadow-sm"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d} className="bg-page text-heading">
                      {d} Level
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-page border border-line hover:border-[#0F6B4F]/50 focus:border-[#0F6B4F] focus:ring-4 focus:ring-[#0F6B4F]/10 outline-none text-xs font-bold text-heading transition-all cursor-pointer shadow-sm"
              >
                <option value="newest" className="bg-page text-heading">Newest First</option>
                <option value="popular" className="bg-page text-heading">Most Popular</option>
                <option value="readingTime" className="bg-page text-heading">Reading Time</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none px-1">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm shrink-0 ${selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white shadow-md shadow-[#0F6B4F]/30 scale-105 border border-transparent'
                  : 'bg-page text-muted border border-line hover:text-heading hover:border-[#0F6B4F]/50 hover:bg-[#0F6B4F]/5'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ ARTICLES GRID ═══ */}
      {loading && articles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl surface-card border border-line p-4 space-y-4 animate-pulse">
              <div className="aspect-[16/9] w-full bg-soft rounded-xl" />
              <div className="h-4 bg-soft rounded w-3/4" />
              <div className="h-3 bg-soft rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : gridArticles.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-page border border-line">
          <div className="w-16 h-16 rounded-2xl bg-[#1E293B] flex items-center justify-center mx-auto mb-4 text-muted">
            <Search size={28} />
          </div>
          <h3 className="text-xl font-bold text-heading mb-2">No Articles Found</h3>
          <p className="text-sm text-muted max-w-md mx-auto mb-6">
            No technical articles matched your filter criteria. Try resetting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#0F6B4F] hover:bg-[#0C5A42] text-white text-xs font-semibold transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridArticles.map((article) => (
            <Link
              key={article._id || article.slug}
              to={`/blog/${article.slug}`}
              className="blog-card rounded-2xl overflow-hidden group flex flex-col hover:border-[#0F6B4F]/35 transition-all duration-300"
            >
              {/* Cover Image Container */}
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#111827] relative">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="blog-card-image w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Badges */}
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
          ))}
        </div>
      )}

      {/* ═══ PAGINATION ═══ */}
      {totalPages > 1 && (
        <div className="pt-12 flex items-center justify-center">
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl sm:rounded-full bg-page border border-line shadow-lg shadow-black/10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 rounded-full text-muted hover:text-[#0F6B4F] hover:bg-[#0F6B4F]/10 disabled:opacity-40 disabled:hover:bg-transparent disabled:pointer-events-none transition-all"
              title="Previous Page"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 border-x border-line/50">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center ${currentPage === page
                      ? 'bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white shadow-md shadow-[#0F6B4F]/30 scale-105'
                      : 'text-muted hover:text-heading hover:bg-soft'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-10 h-10 rounded-full text-muted hover:text-[#0F6B4F] hover:bg-[#0F6B4F]/10 disabled:opacity-40 disabled:hover:bg-transparent disabled:pointer-events-none transition-all"
              title="Next Page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
