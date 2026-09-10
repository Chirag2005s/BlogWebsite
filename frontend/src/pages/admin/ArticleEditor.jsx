import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Send, CheckCircle, AlertCircle, Image, Type, AlignLeft, FileText, BarChart3, Tag } from 'lucide-react';
import api from '../../services/api';

const ArticleEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Artificial Intelligence',
    difficulty: 'Beginner',
  });

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
      category: 'Artificial Intelligence',
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
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const payload = { 
        ...formData, 
        status: publishStatus, 
        type: 'article',
        author: userInfo?._id || undefined,
      };
      const { data } = await api.post('/articles', payload);
      
      if (data.success) {
        setSuccess(publishStatus === 'Published' ? '🎉 Article published successfully!' : '📝 Article saved as draft!');
        resetForm();
        setTimeout(() => {
          navigate('/admin/articles');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-surface-900/60 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-text-muted text-sm focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Link to="/admin/articles" className="text-text-secondary hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create New Article</h1>
            <p className="text-text-secondary text-sm mt-0.5">Write and publish premium technical articles.</p>
          </div>
        </div>
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

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            type="submit" 
            disabled={loading} 
            className="flex-1 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary-600/20 text-sm"
          >
            <Send size={16} />
            {loading ? 'Publishing...' : 'Publish Article'}
          </button>
          <button 
            type="button" 
            onClick={(e) => handleSubmit(e, 'Draft')} 
            disabled={loading} 
            className="flex-1 glass hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;
