import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Eye, ArrowRight, Search, FileText, Sparkles, Filter } from 'lucide-react';
import api from '../services/api';

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
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchArticles = async () => {
      try {
        const { data } = await api.get('/articles?type=article');
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        setArticles(list);
      } catch (error) {
        console.error('Failed to fetch articles', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const safeArticles = Array.isArray(articles) ? articles : [];

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
    <div className="space-y-10">
      {/* ═══ Page Header ═══ */}
      <div className="relative py-8 sm:py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-primary-700/5 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20 uppercase tracking-wider">
              <Sparkles size={13} />
              📚 Technical Articles
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Curated Articles & Guides
          </h1>
          <p className="text-text-secondary mt-3 text-lg max-w-xl leading-relaxed">
            In-depth architectural patterns, production deep-dives, and detailed engineering walkthroughs.
          </p>
        </div>
      </div>

      {/* ═══ Controls: Search & Difficulty Filter ═══ */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-700/50 border border-white/6 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all"
            />
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedDifficulty === diff
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-surface-700/40 text-text-secondary hover:text-white hover:bg-surface-700 border border-white/5'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-text-muted mr-1 whitespace-nowrap">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'bg-surface-800/60 text-text-secondary hover:text-white border border-white/5 hover:bg-surface-700'
              }`}
            >
              {cat}
            </button>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article._id}
                to={`/blog/${article.slug}`}
                className="blog-card glass-card rounded-2xl overflow-hidden group flex flex-col hover:border-primary-500/30 transition-all"
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
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticlesList;
