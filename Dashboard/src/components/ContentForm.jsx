import { useState, useEffect } from 'react';
import { HiOutlineLink, HiOutlineExternalLink, HiOutlineServer, HiOutlineSparkles } from 'react-icons/hi';
import api from '../services/api';
import toast from 'react-hot-toast';

const ContentForm = ({ initialData, type = 'blog', onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    difficulty: 'Beginner',
    status: 'Draft',
    coverImage: '',
    seoTitle: '',
    seoDescription: '',
    linkedSystem: {
      enabled: type === 'article',
      title: '',
      url: '',
      systemType: 'Live System',
      description: '',
    },
  });

  const isEditing = !!initialData;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        category: initialData.category?._id || initialData.category || '',
        difficulty: initialData.difficulty || 'Beginner',
        status: initialData.status || 'Draft',
        coverImage: initialData.coverImage || '',
        seoTitle: initialData.seoTitle || '',
        seoDescription: initialData.seoDescription || '',
        linkedSystem: {
          enabled: Boolean(initialData.linkedSystem?.enabled ?? initialData.linkedSystem?.url),
          title: initialData.linkedSystem?.title || '',
          url: initialData.linkedSystem?.url || '',
          systemType: initialData.linkedSystem?.systemType || 'Live System',
          description: initialData.linkedSystem?.description || '',
        },
      });
    } else {
      setForm(prev => ({
        ...prev,
        linkedSystem: {
          ...prev.linkedSystem,
          enabled: type === 'article',
        }
      }));
    }
  }, [initialData, type]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      if (data.success) {
        setCategories(data.data);
      }
    } catch {
      console.error('Failed to fetch categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkedSystemChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const finalVal = inputType === 'checkbox' ? checked : value;
    setForm(prev => {
      const updatedLinked = {
        ...prev.linkedSystem,
        [name]: finalVal,
      };
      // Auto-enable if URL is entered
      if (name === 'url' && value.trim()) {
        updatedLinked.enabled = true;
      }
      return {
        ...prev,
        linkedSystem: updatedLinked,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) {
      toast.error('Title, excerpt, and content are required.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        type,
        linkedSystem: {
          ...form.linkedSystem,
          enabled: Boolean(form.linkedSystem.enabled && form.linkedSystem.url?.trim()),
          title: form.linkedSystem.title.trim() || 'Launch Linked System',
          url: form.linkedSystem.url.trim(),
          systemType: form.linkedSystem.systemType.trim() || 'Live System',
          description: form.linkedSystem.description.trim(),
        },
      };

      if (isEditing) {
        await api.put(`/articles/${initialData._id}`, payload);
        toast.success(`${type === 'blog' ? 'Blog' : 'Article'} updated successfully!`);
      } else {
        await api.post('/articles', payload);
        toast.success(`${type === 'blog' ? 'Blog' : 'Article'} created successfully!`);
      }

      if (!isEditing) {
        setForm({
          title: '',
          excerpt: '',
          content: '',
          category: '',
          difficulty: 'Beginner',
          status: 'Draft',
          coverImage: '',
          seoTitle: '',
          seoDescription: '',
          linkedSystem: {
            enabled: type === 'article',
            title: '',
            url: '',
            systemType: 'Live System',
            description: '',
          },
        });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group full-width">
          <label className="form-label">Title *</label>
          <input
            className="form-input"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={`Enter ${type} title...`}
            required
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Excerpt *</label>
          <input
            className="form-input"
            type="text"
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            placeholder="Brief summary or description..."
            required
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Content *</label>
          <textarea
            className="form-textarea"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your content here... (supports HTML & Markdown)"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Difficulty</label>
          <select
            className="form-select"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Cover Image URL</label>
          <input
            className="form-input"
            type="url"
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label className="form-label">SEO Title</label>
          <input
            className="form-input"
            type="text"
            name="seoTitle"
            value={form.seoTitle}
            onChange={handleChange}
            placeholder="Custom SEO title..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">SEO Description</label>
          <input
            className="form-input"
            type="text"
            name="seoDescription"
            value={form.seoDescription}
            onChange={handleChange}
            placeholder="Custom SEO description..."
          />
        </div>

        {/* ═══ Article Page Details Section & Linked System Button ═══ */}
        <div className="form-group full-width" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.2))',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00d4ff',
              }}>
                <HiOutlineLink size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f0f0f5', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Article Page Details
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff', border: '1px solid rgba(0, 212, 255, 0.25)', fontWeight: '600' }}>
                    Linked System Feature
                  </span>
                </h3>
                <p style={{ fontSize: '12px', color: '#8b8ba3', margin: '2px 0 0' }}>
                  Configure the technical interactive elements and the Linked System Button displayed under the Article Page Details section on the website.
                </p>
              </div>
            </div>

            {/* Toggle Switch / Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                name="enabled"
                checked={form.linkedSystem.enabled}
                onChange={handleLinkedSystemChange}
                style={{ width: '16px', height: '16px', accentColor: '#00d4ff', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '600', color: form.linkedSystem.enabled ? '#00d4ff' : '#8b8ba3' }}>
                Enable Linked System Button
              </span>
            </label>
          </div>

          {/* Form fields for Linked System Button */}
          {form.linkedSystem.enabled ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              marginBottom: '8px'
            }}>
              <div className="form-group">
                <label className="form-label">
                  Linked System Button Title / Text *
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="title"
                  value={form.linkedSystem.title}
                  onChange={handleLinkedSystemChange}
                  placeholder="e.g. Launch Interactive System Architecture"
                />
              </div>

              <div className="form-group">
                <label className="form-label">System Type / Classification</label>
                <select
                  className="form-select"
                  name="systemType"
                  value={form.linkedSystem.systemType}
                  onChange={handleLinkedSystemChange}
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

              <div className="form-group full-width">
                <label className="form-label">
                  Linked System Target URL or Internal Route *
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="url"
                  value={form.linkedSystem.url}
                  onChange={handleLinkedSystemChange}
                  placeholder="e.g. https://system.architecture.dev or /problemhub or /roadmaps/backend-developer"
                />
                <span style={{ fontSize: '11px', color: '#5a5a72', marginTop: '4px' }}>
                  Enter an external URL (https://...) or an internal path (/problemhub, /roadmaps, etc.).
                </span>
              </div>

              <div className="form-group full-width">
                <label className="form-label">System Description / Subtitle (Optional)</label>
                <input
                  className="form-input"
                  type="text"
                  name="description"
                  value={form.linkedSystem.description}
                  onChange={handleLinkedSystemChange}
                  placeholder="e.g. Real-time distributed telemetry, interactive nodes, and system metrics."
                />
              </div>

              {/* Live Preview Card of the Button */}
              <div className="form-group full-width" style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <HiOutlineSparkles className="text-cyan" size={14} style={{ color: '#00d4ff' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Live Website Button Preview
                  </span>
                </div>
                <div style={{
                  background: 'rgba(10, 15, 26, 0.85)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0F6B4F, #16805E)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 0 16px rgba(15, 107, 79, 0.45)',
                      flexShrink: 0
                    }}>
                      <HiOutlineServer size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'rgba(34, 197, 94, 0.15)',
                          color: '#22c55e',
                          fontWeight: '700',
                          border: '1px solid rgba(34, 197, 94, 0.3)'
                        }}>
                          ● {form.linkedSystem.systemType || 'Live System'}
                        </span>
                        {form.linkedSystem.url && (
                          <span style={{ fontSize: '11px', color: '#8b8ba3', fontFamily: 'monospace' }}>
                            {form.linkedSystem.url.replace(/^https?:\/\//, '').slice(0, 32)}...
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f0f0f5', margin: '4px 0 0' }}>
                        {form.linkedSystem.title || 'Launch Linked System'}
                      </h4>
                      {form.linkedSystem.description && (
                        <p style={{ fontSize: '11px', color: '#8b8ba3', margin: '2px 0 0' }}>
                          {form.linkedSystem.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #0F6B4F, #22c55e)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(15, 107, 79, 0.35)',
                    cursor: 'pointer'
                  }}>
                    <span>Open Linked System</span>
                    <HiOutlineExternalLink size={14} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
              color: '#8b8ba3'
            }}>
              Linked System Button is currently disabled. Toggle the checkbox above to connect an interactive architecture or live system to this article.
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            if (!isEditing) {
              setForm({
                title: '', excerpt: '', content: '', category: '',
                difficulty: 'Beginner', status: 'Draft', coverImage: '',
                seoTitle: '', seoDescription: '',
                linkedSystem: {
                  enabled: type === 'article',
                  title: '',
                  url: '',
                  systemType: 'Live System',
                  description: '',
                },
              });
            }
          }}
        >
          {isEditing ? 'Cancel' : 'Reset'}
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEditing ? 'Update' : `Publish ${type === 'blog' ? 'Blog' : type === 'programming' ? 'Programming Post' : 'Article'}`}
        </button>
      </div>
    </form>
  );
};

export default ContentForm;
