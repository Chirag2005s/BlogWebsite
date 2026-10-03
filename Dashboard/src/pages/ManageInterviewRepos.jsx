import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineSave,
  HiOutlineRefresh,
  HiOutlineLink,
  HiOutlineExternalLink,
  HiOutlineInformationCircle,
} from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import api from '../services/api';

const ManageInterviewRepos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/settings/github_interview_repos');
      if (data?.success && data.data) {
        try {
          const parsed = JSON.parse(data.data);
          setGithubRepos(Array.isArray(parsed) ? parsed : []);
        } catch (parseErr) {
          console.error('Failed to parse repo settings', parseErr);
          setGithubRepos([]);
        }
      } else {
        setGithubRepos([]);
      }
    } catch (error) {
      console.error('Failed to fetch interview repos settings', error);
      toast.error('Failed to load GitHub repository configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const addRepo = () => {
    setGithubRepos((prev) => [...prev, { title: '', url: '' }]);
  };

  const removeRepo = (index) => {
    setGithubRepos((prev) => prev.filter((_, i) => i !== index));
    toast.success('Link removed from draft');
  };

  const updateRepo = (index, field, value) => {
    setGithubRepos((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    try {
      setSaving(true);
      const filteredRepos = githubRepos
        .map((r) => ({
          title: (r.title || '').trim(),
          url: (r.url || '').trim(),
        }))
        .filter((r) => r.url !== '');

      const { data } = await api.post('/settings', {
        key: 'github_interview_repos',
        value: JSON.stringify(filteredRepos),
      });

      if (data?.success) {
        toast.success('GitHub repositories saved successfully!');
        setGithubRepos(filteredRepos);
      } else {
        toast.success('Settings updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error(error.response?.data?.message || 'Failed to save repositories. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '50px' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/interview-questions')}
            className="action-btn"
            style={{
              width: '38px',
              height: '38px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
            }}
            title="Back to Interview Q&A"
          >
            <HiOutlineArrowLeft size={18} />
          </button>

          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0, 212, 255, 0.2))',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              fontSize: '22px',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
            }}
          >
            <FaGithub />
          </div>

          <div>
            <h1 className="page-title" style={{ margin: 0 }}>
              Manage GitHub Links
            </h1>
            <p className="page-description" style={{ margin: '4px 0 0' }}>
              Configure open-source interview repositories displayed on the TechJourney frontend.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchSettings}
            disabled={loading || saving}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HiOutlineRefresh /> Refresh
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={addRepo}
            disabled={loading || saving}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HiOutlinePlus /> Add New Link
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading || saving}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HiOutlineSave /> {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Info Notice Banner */}
      <div
        style={{
          background: 'rgba(0, 212, 255, 0.05)',
          border: '1px solid rgba(0, 212, 255, 0.15)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <HiOutlineInformationCircle style={{ color: 'var(--accent-cyan)', fontSize: '24px', flexShrink: 0 }} />
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Visitors on the <strong style={{ color: 'var(--text-primary)' }}>Interview Questions</strong> page can click the GitHub icon in the header to view and clone these repositories in a modal popup.
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="form-card" style={{ padding: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Repository Link Collection ({githubRepos.length})
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Each item requires a descriptive title and a valid GitHub HTTPS link.
                </p>
              </div>

              <button
                type="button"
                onClick={addRepo}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <HiOutlinePlus /> Add Link
              </button>
            </div>

            {githubRepos.length === 0 ? (
              <div className="empty-state" style={{ padding: '50px 20px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px dashed var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    color: 'var(--text-muted)',
                    margin: '0 auto 16px',
                  }}
                >
                  <FaGithub />
                </div>
                <div className="empty-state-text" style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>
                  No GitHub Repositories Configured
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px' }}>
                  No links are currently configured. Click below to add your first curated interview GitHub repository.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={addRepo}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <HiOutlinePlus /> Add First Link
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {githubRepos.map((repo, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '18px',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.035)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: 'rgba(0, 212, 255, 0.1)',
                          color: 'var(--accent-cyan)',
                          fontFamily: 'monospace',
                        }}
                      >
                        #{index + 1}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {repo.title || 'Untitled Repository'}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(200px, 1fr) minmax(260px, 2fr) auto',
                        gap: '14px',
                        alignItems: 'flex-end',
                      }}
                    >
                      {/* Title input */}
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '12px' }}>
                          Display Title
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Node.js Master Repo"
                          value={repo.title}
                          onChange={(e) => updateRepo(index, 'title', e.target.value)}
                        />
                      </div>

                      {/* URL input */}
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '12px' }}>
                          GitHub URL
                        </label>
                        <div style={{ position: 'relative' }}>
                          <HiOutlineLink
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: 'var(--text-muted)',
                              fontSize: '16px',
                            }}
                          />
                          <input
                            type="url"
                            className="form-input"
                            placeholder="https://github.com/username/repository"
                            value={repo.url}
                            onChange={(e) => updateRepo(index, 'url', e.target.value)}
                            style={{ paddingLeft: '36px', paddingRight: repo.url ? '40px' : '14px', fontFamily: 'monospace', fontSize: '13px' }}
                          />
                          {repo.url && (
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--accent-cyan)',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              title="Test link (opens in new tab)"
                            >
                              <HiOutlineExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Delete button */}
                      <div>
                        <button
                          type="button"
                          onClick={() => removeRepo(index)}
                          className="action-btn action-btn-delete"
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(244, 63, 94, 0.2)',
                            background: 'rgba(244, 63, 94, 0.06)',
                          }}
                          title="Remove repository"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="form-actions" style={{ marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/interview-questions')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ minWidth: '160px' }}
              >
                <HiOutlineSave /> {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageInterviewRepos;
