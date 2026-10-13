import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, Send, CheckCircle, AlertCircle, Image, 
  Type, AlignLeft, FileText, BarChart3, Tag, Link2, 
  ExternalLink, Server, Sparkles 
} from 'lucide-react';
import api from '../../services/api';
import { ARTICLES } from '../../data/mockData';

const ArticleEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notAuthorized, setNotAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Artificial Intelligence',
    difficulty: 'Beginner',
    linkedSystem: {
      enabled: true,
      title: '',
      url: '',
      systemType: 'Live System',
      description: '',
    },
  });

  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (isEditing && id) {
      const fetchArticleForEdit = async () => {
        try {
          setFetching(true);
          setError('');

          // 1. Check if ID matches a built-in mock article first to avoid 404 network errors
          const mockArt = ARTICLES.find((a) => a._id === id || a.slug === id);
          if (mockArt) {
            setFormData({
              title: mockArt.title || '',
              excerpt: mockArt.excerpt || '',
              content: mockArt.content || '',
              coverImage: mockArt.coverImage || '',
              category: mockArt.category?.name || mockArt.category || 'Artificial Intelligence',
              difficulty: mockArt.difficulty || 'Beginner',
              linkedSystem: {
                enabled: Boolean(mockArt.linkedSystem?.enabled ?? mockArt.linkedSystem?.url),
                title: mockArt.linkedSystem?.title || '',
                url: mockArt.linkedSystem?.url || '',
                systemType: mockArt.linkedSystem?.systemType || 'Live System',
                description: mockArt.linkedSystem?.description || '',
              },
            });
            setFetching(false);
            return;
          }

          // 2. Fetch from backend API
          const { data } = await api.get(`/articles/id/${id}`);
          const article = data?.data || data;

          if (!article) {
            throw new Error('Article data not found');
          }

          // Check author ownership
          const authorId = article?.author?._id ? article.author._id : article?.author;
          if (userInfo?._id && authorId && String(userInfo._id) !== String(authorId)) {
            setNotAuthorized(true);
            setError('Unauthorized: You can only edit articles that you personally uploaded.');
            return;
          }

          setFormData({
            title: article.title || '',
            excerpt: article.excerpt || '',
            content: article.content || '',
            coverImage: article.coverImage || '',
            category: article.category?.name || article.category || 'Artificial Intelligence',
            difficulty: article.difficulty || 'Beginner',
            linkedSystem: {
              enabled: Boolean(article.linkedSystem?.enabled ?? article.linkedSystem?.url),
              title: article.linkedSystem?.title || '',
              url: article.linkedSystem?.url || '',
              systemType: article.linkedSystem?.systemType || 'Live System',
              description: article.linkedSystem?.description || '',
            },
          });
        } catch (err) {
          const fallback = ARTICLES.find((a) => a._id === id || a.slug === id);
          if (fallback) {
            setFormData({
              title: fallback.title || '',
              excerpt: fallback.excerpt || '',
              content: fallback.content || '',
              coverImage: fallback.coverImage || '',
              category: fallback.category?.name || fallback.category || 'Artificial Intelligence',
              difficulty: fallback.difficulty || 'Beginner',
              linkedSystem: {
                enabled: Boolean(fallback.linkedSystem?.enabled ?? fallback.linkedSystem?.url),
                title: fallback.linkedSystem?.title || '',
                url: fallback.linkedSystem?.url || '',
                systemType: fallback.linkedSystem?.systemType || 'Live System',
                description: fallback.linkedSystem?.description || '',
              },
            });
          } else {
            setError(err.response?.data?.message || 'Failed to fetch article for editing');
          }
        } finally {
          setFetching(false);
        }
      };

      fetchArticleForEdit();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleLinkedSystemChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const finalVal = inputType === 'checkbox' ? checked : value;
    setFormData(prev => {
      const updatedLinked = {
        ...prev.linkedSystem,
        [name]: finalVal,
      };
      if (name === 'url' && value.trim()) {
        updatedLinked.enabled = true;
      }
      return {
        ...prev,
        linkedSystem: updatedLinked,
      };
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: 'Artificial Intelligence',
      difficulty: 'Beginner',
      linkedSystem: {
        enabled: true,
        title: '',
        url: '',
        systemType: 'Live System',
        description: '',
      },
    });
  };

  const handleSubmit = async (e, publishStatus = 'Draft') => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      setError('Please fill in the Title, Excerpt, and Content fields.');
      setLoading(false);
      return;
    }

    try {
      const payload = { 
        ...formData, 
        status: publishStatus, 
        type: 'article',
        author: userInfo?._id || undefined,
        linkedSystem: {
          ...formData.linkedSystem,
          enabled: Boolean(formData.linkedSystem.enabled && formData.linkedSystem.url?.trim()),
          title: formData.linkedSystem.title.trim() || 'Launch Linked System',
          url: formData.linkedSystem.url.trim(),
          systemType: formData.linkedSystem.systemType.trim() || 'Live System',
          description: formData.linkedSystem.description.trim(),
        },
      };

      if (isEditing) {
        const { data } = await api.put(`/articles/${id}`, payload);
        if (data.success) {
          setSuccess(publishStatus === 'Published' ? '🎉 Article updated and published successfully!' : '📝 Article update saved as draft!');
          setTimeout(() => {
            navigate('/admin/articles');
          }, 1200);
        }
      } else {
        const { data } = await api.post('/articles', payload);
        if (data.success) {
          setSuccess(publishStatus === 'Published' ? '🎉 Article published successfully!' : '📝 Article saved as draft!');
          resetForm();
          setTimeout(() => {
            navigate('/admin/articles');
          }, 1200);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || (isEditing ? 'Failed to update article. You can only update your own content.' : 'Failed to save article. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-surface-900/60 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all";

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-3" />
        <p className="text-text-secondary text-sm">Loading article data for editing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Link to="/admin/articles" className="text-text-secondary hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl" title="Back to Manage Content">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isEditing ? 'Update Article' : 'Create New Article'}
            </h1>
            <p className="text-text-secondary text-sm mt-0.5">
              {isEditing ? 'Modify and update your technical article.' : 'Write and publish premium technical articles.'}
            </p>
          </div>
        </div>
        {isEditing && (
          <Link
            to="/admin/articles"
            className="text-xs text-primary-400 hover:underline font-medium"
          >
            Manage All Content →
          </Link>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-3 bg-error/10 border border-error/20 text-red-400 px-5 py-4 rounded-xl animate-fade-in text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 bg-success/10 border border-success/20 text-green-400 px-5 py-4 rounded-xl animate-fade-in text-sm">
          <CheckCircle size={18} className="flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e, 'Published')} className="space-y-5">
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              <Type size={13} className="text-primary-400" />
              Article Title
            </label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. Deep Dive into Javascript Event Loop Architecture" 
              className={`${inputClass} text-base font-medium`} 
              required 
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              <AlignLeft size={13} className="text-primary-400" />
              Short Description
            </label>
            <textarea 
              name="excerpt" 
              value={formData.excerpt} 
              onChange={handleChange} 
              placeholder="A brief summary of your article..." 
              rows={3} 
              className={`${inputClass} resize-none`} 
              required 
            />
          </div>

          <div>
            <label className="flex items-center justify-between text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <FileText size={13} className="text-primary-400" />
                Content
              </span>
              <span className="text-primary-400 normal-case font-normal text-xs">Supports Markdown</span>
            </label>
            <textarea 
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              placeholder="Write your article content here using markdown format..." 
              rows={16} 
              className={`${inputClass} font-mono text-xs resize-y`} 
              required 
            />
            {formData.content && (
              <div className="mt-2 text-xs text-text-muted">
                ~{Math.ceil(formData.content.split(/\s+/).filter(Boolean).length / 200)} min read · {formData.content.split(/\s+/).filter(Boolean).length} words
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                <Tag size={13} className="text-primary-400" />
                Category
              </label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className={inputClass}
              >
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Generative AI">Generative AI</option>
                <option value="Robotics">Robotics</option>
                <option value="Web Technology">Web Technology</option>
                <option value="Internet & Networking">Internet & Networking</option>
                <option value="Hardware">Hardware</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                <BarChart3 size={13} className="text-primary-400" />
                Difficulty
              </label>
              <select 
                name="difficulty" 
                value={formData.difficulty} 
                onChange={handleChange} 
                className={inputClass}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                <Image size={13} className="text-primary-400" />
                Cover Image URL
              </label>
              <input 
                type="text" 
                name="coverImage" 
                value={formData.coverImage} 
                onChange={handleChange} 
                placeholder="https://example.com/image.jpg" 
                className={inputClass} 
              />
            </div>
          </div>
          {formData.coverImage && (
            <div className="mt-4">
              <div className="w-full max-h-44 rounded-xl overflow-hidden border border-white/6">
                <img 
                  src={formData.coverImage} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Article Page Details & Linked System Button */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/6 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-400">
                <Link2 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Article Page Details
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 font-semibold uppercase tracking-wider">
                    Linked System Feature
                  </span>
                </h3>
                <p className="text-xs text-text-muted">
                  Configure technical interactive elements and the Linked System Button displayed under the Article Page Details section.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="enabled"
                checked={Boolean(formData.linkedSystem?.enabled)}
                onChange={handleLinkedSystemChange}
                className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
              />
              <span className="text-xs font-semibold text-text-secondary">
                Enable Linked System Button
              </span>
            </label>
          </div>

          {formData.linkedSystem?.enabled ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                    Linked System Button Title / Text *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.linkedSystem?.title || ''}
                    onChange={handleLinkedSystemChange}
                    placeholder="e.g. Launch Interactive System Architecture"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                    System Type / Classification
                  </label>
                  <select
                    name="systemType"
                    value={formData.linkedSystem?.systemType || 'Live System'}
                    onChange={handleLinkedSystemChange}
                    className={inputClass}
                  >
                    <option value="Live System">Live System</option>
                    <option value="System Architecture">System Architecture</option>
                    <option value="Interactive Simulator">Interactive Simulator</option>
                    <option value="Production Metrics">Production Metrics</option>
                    <option value="Interactive Code Sandbox">Interactive Code Sandbox</option>
                    <option value="Frontier AI System">Frontier AI System</option>
                    <option value="GitHub Repository">GitHub Repository</option>
                    <option value="System Documentation">System Documentation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                  Linked System Target URL or Internal Route *
                </label>
                <input
                  type="text"
                  name="url"
                  value={formData.linkedSystem?.url || ''}
                  onChange={handleLinkedSystemChange}
                  placeholder="e.g. https://system.architecture.dev or /problemhub or /roadmaps/backend-developer"
                  className={inputClass}
                />
                <span className="text-[11px] text-text-muted mt-1 block">
                  Enter an external URL (https://...) or an internal platform route (/problemhub, /roadmaps, etc.).
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                  System Description / Subtitle (Optional)
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.linkedSystem?.description || ''}
                  onChange={handleLinkedSystemChange}
                  placeholder="e.g. Real-time distributed telemetry, interactive nodes, and system metrics."
                  className={inputClass}
                />
              </div>

              {/* Live Preview Card */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  <Sparkles size={13} />
                  <span>Live Button Preview (As displayed on website)</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-900/80 border border-primary-500/30 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F6B4F] to-[#16805E] flex items-center justify-center text-white shadow-md shadow-[#0F6B4F]/30 flex-shrink-0">
                      <Server size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          ● {formData.linkedSystem?.systemType || 'Live System'}
                        </span>
                        {formData.linkedSystem?.url && (
                          <span className="text-[11px] font-mono text-text-muted">
                            {formData.linkedSystem.url.replace(/^https?:\/\//, '').slice(0, 30)}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">
                        {formData.linkedSystem?.title || 'Launch Linked System'}
                      </h4>
                      {formData.linkedSystem?.description && (
                        <p className="text-xs text-text-muted mt-0.5">
                          {formData.linkedSystem.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F6B4F] to-[#22c55e] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#0F6B4F]/20 cursor-pointer">
                    <span>Open Linked System</span>
                    <ExternalLink size={13} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-surface-900/40 border border-dashed border-white/8 text-xs text-text-muted">
              Linked System Button is currently disabled. Toggle the checkbox above to connect an interactive architecture or live system to this article.
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            type="submit" 
            disabled={loading || notAuthorized} 
            className="flex-1 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary-600/20 text-sm"
          >
            <Send size={16} />
            {loading ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update & Publish' : 'Publish Article')}
          </button>
          <button 
            type="button" 
            onClick={(e) => handleSubmit(e, 'Draft')} 
            disabled={loading || notAuthorized} 
            className="flex-1 glass hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
          >
            <Save size={16} />
            {loading ? 'Saving...' : (isEditing ? 'Save Update as Draft' : 'Save as Draft')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;
