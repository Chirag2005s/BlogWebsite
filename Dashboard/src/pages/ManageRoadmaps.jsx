import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineMap,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineFilter,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineBadgeCheck,
  HiOutlineRefresh,
} from 'react-icons/hi';
import api from '../services/api';

const ManageRoadmaps = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/roadmaps');
      if (data?.success && Array.isArray(data.data)) {
        setRoadmaps(data.data);
      }
    } catch (err) {
      console.error('Failed to load roadmaps in Dashboard', err);
      toast.error('Failed to fetch roadmaps from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the roadmap "${title}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const { data } = await api.delete(`/roadmaps/${id}`);
      if (data?.success) {
        toast.success(`Roadmap "${title}" deleted successfully!`);
        fetchRoadmaps();
      }
    } catch (err) {
      console.error('Failed to delete roadmap', err);
      toast.error(err.response?.data?.message || 'Failed to delete roadmap.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRoadmaps = roadmaps.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ||
      r.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HiOutlineMap style={{ color: 'var(--accent-purple)' }} /> Manage Roadmaps
          </h1>
          <p className="page-description">
            View, search, filter, and manage programmer roadmaps published on the platform.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={fetchRoadmaps}>
            <HiOutlineRefresh /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/add-roadmap')}>
            <HiOutlinePlus /> Create Roadmap
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justify: 'space-between',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <HiOutlineSearch
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: '18px',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search by title, description, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HiOutlineFilter style={{ color: 'var(--accent-cyan)', fontSize: '18px' }} />
          <select
            className="form-select"
            style={{ minWidth: '180px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="AI & Data Science">AI & Data Science</option>
            <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
            <option value="Cyber Security">Cyber Security</option>
          </select>
        </div>
      </div>

      {/* Table / Grid */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : filteredRoadmaps.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div className="empty-state-icon">🗺️</div>
          <div className="empty-state-text" style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginTop: '8px' }}>
            No roadmaps found
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Try resetting your search filters or click "Create Roadmap" to publish one.
          </p>
        </div>
      ) : (
        <div className="table-responsive" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          <table className="content-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '16px' }}>Roadmap Title & Slug</th>
                <th style={{ padding: '16px' }}>Category</th>
                <th style={{ padding: '16px' }}>Phases & Modules</th>
                <th style={{ padding: '16px' }}>Duration & Level</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoadmaps.map((map) => {
                const phaseCount = map.phases?.length || 0;
                let moduleCount = 0;
                map.phases?.forEach((p) => {
                  moduleCount += p.nodes?.length || 0;
                });

                return (
                  <tr key={map.id || map._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                    <th style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>
                        {map.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '2px', fontFamily: 'monospace' }}>
                        /{map.slug}
                      </div>
                    </th>

                    <td style={{ padding: '16px' }}>
                      <span className="badge badge-blog" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                        {map.category}
                      </span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <HiOutlineDocumentText style={{ color: 'var(--accent-purple)' }} />
                        <span>{phaseCount} Phases · {moduleCount} Modules</span>
                      </div>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <HiOutlineClock style={{ color: 'var(--accent-cyan)' }} /> {map.estimatedTime}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                          <HiOutlineBadgeCheck /> {map.level}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => setSelectedRoadmap(map)}
                          title="Preview Details"
                        >
                          <HiOutlineEye /> View
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)' }}
                          disabled={deletingId === (map.id || map._id)}
                          onClick={() => handleDelete(map.id || map._id, map.title)}
                          title="Delete Roadmap"
                        >
                          <HiOutlineTrash /> {deletingId === (map.id || map._id) ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {selectedRoadmap && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '20px',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '28px',
              borderRadius: '24px',
              background: '#16162a',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedRoadmap(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <span className="badge badge-blog" style={{ marginBottom: '8px', display: 'inline-block' }}>
              {selectedRoadmap.category}
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '4px 0 8px 0' }}>
              {selectedRoadmap.title}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
              {selectedRoadmap.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Estimated Time</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{selectedRoadmap.estimatedTime}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Target Level</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{selectedRoadmap.level}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Total Phases</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-purple)' }}>{selectedRoadmap.phases?.length || 0}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>Phases Preview</h4>
              {selectedRoadmap.phases?.map((p) => (
                <div key={p.phaseNumber} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    Phase {p.phaseNumber}: {p.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {p.description}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {p.nodes?.map((n) => (
                      <span key={n.id} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
                        {n.title}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoadmaps;
