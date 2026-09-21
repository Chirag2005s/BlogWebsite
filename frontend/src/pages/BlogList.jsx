import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, Clock, ArrowRight, Search, Filter, Sparkles, 
  ChevronLeft, ChevronRight, SlidersHorizontal, Calendar, Eye, 
  Flame, CheckCircle2 
} from 'lucide-react';
import { ARTICLES } from '../data/mockData';
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

  const [articles, setArticles] = useState(ARTICLES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'popular' | 'readingTime'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Sync category param
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await api.get('/articles');
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        if (list.length > 0) {
          const existingSlugs = new Set(list.map((a) => a.slug));
          const missing = ARTICLES.filter((a) => !existingSlugs.has(a.slug));
          setArticles([...list, ...missing]);
        }
      } catch (err) {
        // Mock fallback
      }
    };
    fetchArticles();
  }, []);

  // Filter & Sort Logic
  const filteredArticles = useMemo(() => {
    let result = articles.filter((a) => {
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
      {/* ═══ HEADER ═══ */}
      <div className="relative py-8 sm:py-12 border-b border-[#334155]/60 overflow-hidden">
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-mono text-[#06B6D4]">
            <BookOpen size={14} />
            <span>Developer Knowledge Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F8FAFC] tracking-tight">
            Technical Articles &amp; <span className="tech-gradient-text">Blogs</span>
          </h1>

          <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed">
            In-depth guides, distributed systems architectures, programming language deep dives, and operating system internals.
          </p>
        </div>
      </div>

      {/* ═══ FEATURED ARTICLE BANNER ═══ */}
      {featuredArticle && (
        <div className="relative rounded-3xl overflow-hidden bg-[#1E293B] border border-[#334155] shadow-2xl shadow-black/60 group hover:border-blue-500/40 transition-all duration-300">
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
                <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1">
                  <Clock size={12} /> {featuredArticle.readingTime} min read
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-medium border border-blue-500/20">
                  {featuredArticle.difficulty}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] group-hover:text-blue-300 transition-colors leading-snug">
                <Link to={`/blog/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h2>

              <p className="text-sm text-[#94A3B8] line-clamp-3 leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {featuredArticle.author?.avatar ? (
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#334155]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-xs font-bold text-blue-300">
                      {featuredArticle.author?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div className="text-xs">
                    <div className="font-semibold text-white">{featuredArticle.author?.name || 'Staff Engineer'}</div>
                    <div className="text-[#64748B]">{new Date(featuredArticle.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>

                <Link
                  to={`/blog/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all"
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
      <div className="space-y-4">
        {/* Search Bar & Sorting Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search articles by title or keyword..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#111827] border border-[#334155] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#06B6D4] transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#94A3B8] hidden sm:inline font-mono">Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-[#111827] border border-[#334155] text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4]"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} className="bg-[#111827] text-white">
                    {d} Level
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#94A3B8] hidden sm:inline font-mono">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#111827] border border-[#334155] text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4]"
              >
                <option value="newest" className="bg-[#111827] text-white">Newest First</option>
                <option value="popular" className="bg-[#111827] text-white">Most Popular</option>
                <option value="readingTime" className="bg-[#111827] text-white">Reading Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-[#111827] text-[#94A3B8] border-[#334155] hover:text-[#F8FAFC] hover:border-blue-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ ARTICLES GRID ═══ */}
      {gridArticles.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#111827] border border-[#334155]">
          <div className="w-16 h-16 rounded-2xl bg-[#1E293B] flex items-center justify-center mx-auto mb-4 text-[#94A3B8]">
            <Search size={28} />
          </div>
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Articles Found</h3>
          <p className="text-sm text-[#94A3B8] max-w-md mx-auto mb-6">
            No technical articles matched your filter criteria. Try resetting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all"
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
              className="blog-card rounded-2xl overflow-hidden group flex flex-col hover:border-blue-500/40 transition-all duration-300"
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
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#0B1120]/80 text-[#F8FAFC] border border-[#334155] backdrop-blur-md">
                      {article.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex flex-col flex-grow space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {article.readingTime} min read
                  </span>
                  <span>•</span>
                  <span>{new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#94A3B8] line-clamp-2 flex-grow leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Author & Read More Footer */}
                <div className="pt-4 border-t border-[#334155] flex items-center justify-between text-xs mt-auto">
                  <div className="flex items-center gap-2">
                    {article.author?.avatar ? (
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#334155]"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center text-[10px] font-bold text-blue-300">
                        {article.author?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                    <span className="text-[#F8FAFC] font-medium text-xs">
                      {article.author?.name || 'TechJourney Contributor'}
                    </span>
                  </div>

                  <span className="font-semibold text-[#3B82F6] group-hover:text-cyan-400 transition-colors flex items-center gap-1">
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
        <div className="pt-8 border-t border-[#334155]/60 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-[#111827] border border-[#334155] text-[#94A3B8] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-xl text-xs font-semibold transition-all border ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20 font-bold'
                  : 'bg-[#111827] text-[#94A3B8] border-[#334155] hover:text-white hover:border-blue-500/40'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-[#111827] border border-[#334155] text-[#94A3B8] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
