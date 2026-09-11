import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';

const TYPE_EMOJI = { blog: '✍️', article: '📄', programming: '💻' };

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
    const cls = type === 'article' ? 'badge-article'
               : type === 'programming' ? 'badge-programming'
               : 'badge-blog';
    return <span className={`badge ${cls}`}>{type || 'blog'}</span>;
  };

  return (
    <div className="content-table-wrapper">
      {/* ── Header & Filters ── */}
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
            <option value="programming">Programming</option>
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

      {/* ── Empty State ── */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-text">No content found matching your filters.</div>
        </div>
      ) : (
        /* ── Card Grid ── */
        <div className="content-card-grid">
          {filtered.map((item) => (
            <div key={item._id} className="content-card">
              {/* Cover Image */}
              {item.coverImage ? (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="card-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="card-cover-placeholder"
                style={{ display: item.coverImage ? 'none' : 'flex' }}
              >
                {TYPE_EMOJI[item.type] || '📝'}
              </div>

              {/* Body */}
              <div className="card-body">
                <div className="card-badges">
                  {getTypeBadge(item.type)}
                  {getStatusBadge(item.status)}
                </div>

                <div className="card-title">{item.title}</div>

                <div className="card-meta">
                  <span>by {item.author?.name || 'Unknown'}</span>
                  {item.category?.name && (
                    <>
                      <span style={{ color: 'var(--text-muted)' }}>·</span>
                      <span>{item.category.name}</span>
                    </>
                  )}
                </div>

                <div className="card-stats">
                  <span className="card-stat">👁 {item.views || 0}</span>
                  <span className="card-stat">❤️ {item.likes || 0}</span>
                  {item.difficulty && (
                    <span className="card-stat">📶 {item.difficulty}</span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="card-footer">
                <span className="card-date">{formatDate(item.createdAt)}</span>
                <div className="action-btns">
                  {item.status === 'Published' ? (
                    <a
                      href={`http://localhost:5173/${item.type === 'article' ? 'article' : item.type === 'programming' ? 'programming' : 'blog'}/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn action-btn-view"
                      title="View Live"
                    >
                      <HiOutlineEye />
                    </a>
                  ) : (
                    <button className="action-btn" title="Not Published" disabled style={{ opacity: 0.35 }}>
                      <HiOutlineEyeOff />
                    </button>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentTable;
