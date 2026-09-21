import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, Send, CheckCircle, AlertCircle, Image, Type, AlignLeft, FileText, BarChart3, Tag, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const AddBlog = () => {
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
    category: 'Web Technology',
    difficulty: 'Beginner',
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
      const fetchBlogForEdit = async () => {
        try {
          setFetching(true);
          const { data } = await api.get(`/articles/id/${id}`);
          const blog = data?.data || data;

          // Check author ownership
          const authorId = blog?.author?._id ? blog.author._id : blog?.author;
          if (userInfo?._id && authorId && String(userInfo._id) !== String(authorId)) {
            setNotAuthorized(true);
            setError('Unauthorized: You can only edit blogs that you personally uploaded.');
            return;
          }

          setFormData({
            title: blog.title || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            coverImage: blog.coverImage || '',
            category: blog.category?.name || blog.category || 'Web Technology',
            difficulty: blog.difficulty || 'Beginner',
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch blog for editing');
        } finally {
          setFetching(false);
        }
      };

      fetchBlogForEdit();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: 'Web Technology',
      difficulty: 'Beginner',
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
        type: 'blog',
        author: userInfo?._id || undefined,
      };

      if (isEditing) {
        const { data } = await api.put(`/articles/${id}`, payload);
        if (data.success) {
          setSuccess(publishStatus === 'Published' ? '🎉 Blog updated and published successfully!' : '📝 Blog update saved as draft!');
          setTimeout(() => {
            navigate('/admin/articles');
          }, 1200);
        }
      } else {
        const { data } = await api.post('/articles', payload);
        if (data.success) {
          setSuccess(publishStatus === 'Published' ? '🎉 Blog published successfully!' : '📝 Blog saved as draft!');
          resetForm();
          setTimeout(() => {
            navigate('/admin/articles');
          }, 1200);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || (isEditing ? 'Failed to update blog. You can only update your own content.' : 'Failed to save blog. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-surface-900/60 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all";

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-3" />
        <p className="text-text-secondary text-sm">Loading blog data for editing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            {isEditing && (
              <Link
                to="/admin/articles"
                className="p-2 rounded-xl bg-surface-800 border border-white/8 text-text-secondary hover:text-white transition-all"
                title="Back to Manage Content"
              >
                <ArrowLeft size={16} />
              </Link>
            )}
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isEditing ? 'Update Blog Post' : 'Add Daily Blog'}
            </h1>
          </div>
          <p className="text-text-secondary text-sm mt-1.5">
            {isEditing ? 'Modify and update your published blog.' : 'Write and publish your daily blog post.'}
          </p>
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
        <div className="mb-6 flex items-center gap-3 bg-error/10 border border-error/20 text-red-400 px-5 py-4 rounded-xl animate-fade-in text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-3 bg-success/10 border border-success/20 text-green-400 px-5 py-4 rounded-xl animate-fade-in text-sm">
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
              Blog Title
            </label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. What I Learned About React Server Components Today" className={`${inputClass} text-base font-medium`} required />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              <AlignLeft size={13} className="text-primary-400" />
              Short Description
            </label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="A brief summary of your blog post..." rows={3} className={`${inputClass} resize-none`} required />
          </div>

          <div>
            <label className="flex items-center justify-between text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <FileText size={13} className="text-primary-400" />
                Content
              </span>
              <span className="text-primary-400 normal-case font-normal text-xs">Supports Markdown</span>
            </label>
            <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Write your blog content here..." rows={16} className={`${inputClass} font-mono text-xs resize-y`} required />
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
              <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
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
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className={inputClass}>
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
              <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://example.com/image.jpg" className={inputClass} />
            </div>
          </div>
          {formData.coverImage && (
            <div className="mt-4">
              <div className="w-full max-h-44 rounded-xl overflow-hidden border border-white/6">
                <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
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
            {loading ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update & Publish' : 'Publish Blog')}
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

export default AddBlog;
