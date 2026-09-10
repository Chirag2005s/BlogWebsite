import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi';
import ContentTable from '../components/ContentTable';
import api from '../services/api';

const ManageContent = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // Fetch all content with limit 100 for CMS
      const { data } = await api.get('/articles?limit=100');
      if (data.success) {
        setArticles(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load content', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Manage Content</h1>
          <p className="page-description">Search, filter, edit, view, or delete all blogs and articles.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/add-blog')}>
            <HiOutlinePlus /> New Blog
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/add-article')}>
            <HiOutlinePlus /> New Article
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <ContentTable
          articles={articles}
          onRefresh={fetchArticles}
          title="All Content Items"
        />
      )}
    </div>
  );
};

export default ManageContent;
