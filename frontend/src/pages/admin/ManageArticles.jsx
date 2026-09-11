import { useState, useEffect } from 'react';
import { Trash2, Eye, Clock, ExternalLink, BookOpen, FileText, Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data } = await api.get('/articles/admin/all');
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      setArticles(list);
    } catch (error) {
      console.error('Failed to fetch articles', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      try {
        await api.delete(`/articles/${id}`);
        setArticles((prev) => (Array.isArray(prev) ? prev.filter((article) => article._id !== id) : []));
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const safeArticles = Array.isArray(articles) ? articles : [];

  const filteredArticles = safeArticles.filter((article) => {
    if (typeFilter === 'all') return true;
    if (typeFilter === 'article') return article.type === 'article';
    return !article.type || article.type === 'blog';
  });

  const blogsCount = safeArticles.filter((a) => !a.type || a.type === 'blog').length;
  const articlesCount = safeArticles.filter((a) => a.type === 'article').length;

  return (
    <div className="space-y-6">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Manager</h1>
          <p className="text-text-secondary text-sm mt-1">
            {articles.length} total publication{articles.length !== 1 ? 's' : ''} ({blogsCount} blogs, {articlesCount} articles)
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin"
            className="bg-surface-700 hover:bg-surface-600 text-white px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all text-sm border border-white/8"
          >
            <Plus size={15} />
            Write Blog
          </Link>
          <Link
            to="/admin/add-article"
            className="bg-primary-600 hover:bg-primary-500 text-white px-3.5 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all text-sm shadow-lg shadow-primary-600/20"
          >
            <Plus size={15} />
            Write Article
          </Link>
        </div>
      </div>

      {/* ═══ Filter Tabs ═══ */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-800/80 border border-white/6 w-fit">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            typeFilter === 'all'
              ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
              : 'text-text-secondary hover:text-white'
          }`}
        >
          All ({articles.length})
        </button>
        <button
          onClick={() => setTypeFilter('blog')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            typeFilter === 'blog'
              ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
              : 'text-text-secondary hover:text-white'
          }`}
        >
          📝 Blogs ({blogsCount})
        </button>
        <button
          onClick={() => setTypeFilter('article')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            typeFilter === 'article'
              ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
              : 'text-text-secondary hover:text-white'
          }`}
        >
          📚 Articles ({articlesCount})
        </button>
      </div>

      {/* ═══ Table Card ═══ */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-3" />
            <p className="text-text-secondary text-sm">Loading publications...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} className="text-primary-400" />
            </div>
            <p className="text-white font-semibold mb-1">
              {typeFilter === 'article'
                ? 'No articles found'
                : typeFilter === 'blog'
                ? 'No blogs found'
                : 'No content yet'}
            </p>
            <p className="text-text-muted text-sm mb-4">
              {typeFilter === 'article'
                ? 'Create a technical article to populate this list.'
                : 'Write your first blog to get started!'}
            </p>
            <Link
              to={typeFilter === 'article' ? '/admin/add-article' : '/admin'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium"
            >
              <Plus size={14} />
              {typeFilter === 'article' ? 'Create Article' : 'Write Blog'}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-semibold">Title</th>
                  <th className="px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-semibold">Type</th>
                  <th className="px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-semibold">Status</th>
                  <th className="px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-semibold">Engagement</th>
                  <th className="px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-semibold">Date</th>
                  <th className="px-6 py-4 text-xs text-text-muted uppercase tracking-wider font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article._id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white text-sm">{article.title}</div>
                      <div className="text-xs text-text-muted mt-0.5 line-clamp-1">{article.excerpt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          article.type === 'article'
                            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                            : 'bg-primary-500/15 text-primary-300 border border-primary-500/20'
                        }`}
                      >
                        {article.type === 'article' ? '📚 Article' : '📝 Blog'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          article.status === 'Published'
                            ? 'bg-success/10 text-green-400'
                            : 'bg-warning/10 text-yellow-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            article.status === 'Published' ? 'bg-green-400' : 'bg-yellow-400'
                          }`}
                        />
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1" title="Views">
                          <Eye size={13} />
                          {article.views || 0}
                        </span>
                        <span className="flex items-center gap-1 text-red-400/80" title="Likes">
                          <Heart size={13} />
                          {article.likes || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Clock size={13} />
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {article.status === 'Published' && (
                          <Link
                            to={`/blog/${article.slug}`}
                            className="text-text-muted hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-primary-500/10"
                            title="View"
                          >
                            <ExternalLink size={15} />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="text-text-muted hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-error/10"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageArticles;
