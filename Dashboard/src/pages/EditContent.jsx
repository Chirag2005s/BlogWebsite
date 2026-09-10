import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import ContentForm from '../components/ContentForm';
import api from '../services/api';
import toast from 'react-hot-toast';

const EditContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        // Try get by ID endpoint first
        let res;
        try {
          res = await api.get(`/articles/id/${id}`);
        } catch {
          res = await api.get(`/articles/${id}`);
        }
        if (res?.data?.success) {
          setContent(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load content for editing');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <div className="empty-state-text">Content not found.</div>
        <button className="btn btn-secondary" onClick={() => navigate('/content')}>
          Back to Content
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/content')}
          style={{ padding: '8px 12px' }}
        >
          <HiOutlineArrowLeft /> Back
        </button>
        <div>
          <h1 className="page-title">Edit {content.type === 'article' ? 'Article' : 'Blog'}</h1>
          <p className="page-description">Update details, status, or content for "{content.title}".</p>
        </div>
      </div>

      <ContentForm
        initialData={content}
        type={content.type || 'blog'}
        onSuccess={() => navigate('/content')}
      />
    </div>
  );
};

export default EditContent;
