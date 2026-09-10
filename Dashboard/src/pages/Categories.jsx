import { useState, useEffect } from 'react';
import { HiOutlineTag, HiOutlineDocumentText } from 'react-icons/hi';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <p className="page-description">
          TechJourney active technology categories and content distribution.
        </p>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏷️</div>
          <div className="empty-state-text">No categories found.</div>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat._id} className="category-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <HiOutlineTag style={{ color: 'var(--accent-cyan)', fontSize: '18px' }} />
                <h3 className="category-card-name" style={{ margin: 0 }}>{cat.name}</h3>
              </div>
              <p className="category-card-desc">
                {cat.description || `Articles and resources focusing on ${cat.name}.`}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span className="badge badge-blog" style={{ textTransform: 'lowercase' }}>
                  /{cat.slug}
                </span>
                <span className="category-card-count">
                  <HiOutlineDocumentText /> {cat.articleCount ?? 0} articles
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
