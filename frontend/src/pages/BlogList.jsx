import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Eye, ArrowRight, Search, Filter } from 'lucide-react';
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

const BlogList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
        const { data } = await api.get('/articles?type=blog');
        setArticles(data.data);
      } catch (error) {
        console.error('Failed to fetch articles', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const articleCat = a.category?.name || '';
    const matchesCategory =
      selectedCategory === 'All' || articleCat.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10">
      {/* ═══ Page Header ═══ */}
      <div className="relative py-8 sm:py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">📝 Daily Blog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Developer Blog
          </h1>
          <p className="text-text-secondary mt-3 text-lg max-w-xl leading-relaxed">
            Personal thoughts, daily developer learnings, and workflow insights.
          </p>
        </div>
      </div>

      {/* ═══ Search & Category Filters ═══ */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-700/50 border border-white/6 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all"
          />
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
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
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
            <BookOpen size={28} className="text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {searchQuery ? 'No matching blogs' : 'No blogs yet'}
          </h3>
          <p className="text-text-secondary text-sm max-w-sm mx-auto">
            {searchQuery
              ? `No blogs match "${searchQuery}". Try a different search term.`
              : 'Blog posts will appear here once published.'}
          </p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <p className="text-xs text-text-muted">
            {filteredArticles.length} blog{filteredArticles.length !== 1 ? 's' : ''}{' '}
            {searchQuery && `matching "${searchQuery}"`}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <Link
                key={article._id}
                to={`/blog/${article.slug}`}
                className="blog-card glass-card rounded-2xl overflow-hidden group flex flex-col"
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
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-700 to-surface-800">
                      <BookOpen size={32} className="text-text-muted" />
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
                  <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    {article.category?.name || '📝 Blog'}
                  </span>
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

export default BlogList;
