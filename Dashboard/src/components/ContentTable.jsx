import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';

const ContentTable = ({ articles, onRefresh, title = 'All Content' }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = articles.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async (id, itemTitle) => {
    if (!window.confirm(`Delete "${itemTitle}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success('Deleted successfully');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const cls = status === 'Published' ? 'badge-published' :
                status === 'Draft' ? 'badge-draft' : 'badge-archived';
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  const getTypeBadge = (type) => {
    const cls = type === 'article' ? 'badge-article' : 'badge-blog';
    return <span className={`badge ${cls}`}>{type || 'blog'}</span>;
  };

  return (
    <div className="content-table-wrapper">
      <div className="table-header">
        <div className="table-title">{title} ({filtered.length})</div>
        <div className="table-actions">
          <div className="table-search">
            <HiOutlineSearch className="table-search-icon" />
            <input
              type="text"
              placeholder="Search content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="table-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="blog">Blogs</option>
            <option value="article">Articles</option>
          </select>
          <select
            className="table-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-text">No content found matching your filters.</div>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Category</th>
              <th>Status</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>
                  <span className="table-content-title">{item.title}</span>
                  <span className="table-content-meta">by {item.author?.name || 'Unknown'}</span>
                </td>
                <td>{getTypeBadge(item.type)}</td>
                <td>{item.category?.name || '—'}</td>
                <td>{getStatusBadge(item.status)}</td>
                <td>{item.views || 0}</td>
                <td>{item.likes || 0}</td>
                <td>{formatDate(item.createdAt)}</td>
                <td>
                  <div className="action-btns">
                    {item.status === 'Published' && (
                      <a
                        href={`http://localhost:5173/${item.type === 'article' ? 'article' : 'blog'}/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn action-btn-view"
                        title="View Live"
                      >
                        <HiOutlineEye />
                      </a>
                    )}
                    <button
                      className="action-btn action-btn-edit"
                      title="Edit"
                      onClick={() => navigate(`/edit/${item._id}`)}
                    >
                      <HiOutlinePencil />
                    </button>
                    <button
                      className="action-btn action-btn-delete"
                      title="Delete"
                      onClick={() => handleDelete(item._id, item.title)}
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContentTable;
