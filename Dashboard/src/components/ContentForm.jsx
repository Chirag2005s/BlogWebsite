import { useState, useEffect } from 'react';
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
      });
    }
  }, [initialData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) {
      toast.error('Title, excerpt, and content are required.');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, type };

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
            placeholder="Write your content here... (supports HTML)"
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
          {loading ? 'Saving...' : isEditing ? 'Update' : `Publish ${type === 'blog' ? 'Blog' : 'Article'}`}
        </button>
      </div>
    </form>
  );
};

export default ContentForm;
