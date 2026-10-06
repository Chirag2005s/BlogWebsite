import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineTerminal,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineX,
  HiOutlineCode,
  HiOutlineCheckCircle,
  HiOutlineQuestionMarkCircle,
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineTag,
  HiOutlineFilter,
  HiOutlineClipboardCopy,
  HiOutlineCheck,
  HiOutlineChatAlt2,
  HiOutlineLightBulb,
} from 'react-icons/hi';
import api from '../services/api';

const CATEGORY_OPTIONS = [
  'DSA',
  'Frontend',
  'Backend',
  'Fullstack',
  'System Design',
  'Database',
  'DevOps',
  'JavaScript',
  'React',
  'Python',
  'Algorithms',
  'General',
];

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
const TYPE_OPTIONS = ['Standard', 'Debug Challenge'];
const LANGUAGE_OPTIONS = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL', 'HTML/CSS'];

const ManageProblemHub = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'statement' | 'code'
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State
  const initialFormState = {
    title: '',
    description: '',
    category: 'DSA',
    difficulty: 'Medium',
    language: 'JavaScript',
    type: 'Standard',
    tags: '',
    expectedBehavior: '',
    currentBehavior: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    exampleInput: '',
    exampleOutput: '',
    starterCode: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/problems');
      // Backend may return an array directly or an object { success, data }
      const problemList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setProblems(problemList);
    } catch (err) {
      console.error('Failed to load problems in Dashboard', err);
      toast.error('Failed to fetch problems from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleOpenModal = (p = null) => {
    if (p) {
      setEditingId(p._id);
      setFormData({
        title: p.title || '',
        description: p.description || '',
        category: p.category || 'DSA',
        difficulty: p.difficulty || 'Medium',
        language: p.language || 'JavaScript',
        type: p.type || 'Standard',
        tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
        expectedBehavior: p.expectedBehavior || '',
        currentBehavior: p.currentBehavior || '',
        inputFormat: p.inputFormat || '',
        outputFormat: p.outputFormat || '',
        constraints: p.constraints || '',
        exampleInput: p.exampleInput || '',
        exampleOutput: p.exampleOutput || '',
        starterCode: p.starterCode || '',
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleViewDetail = (problem) => {
    setSelectedProblem(problem);
    setIsDetailOpen(true);
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success('Starter code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Problem Title and Description are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        language: formData.language,
        type: formData.type,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        expectedBehavior: formData.expectedBehavior.trim(),
        currentBehavior: formData.currentBehavior.trim(),
        inputFormat: formData.inputFormat.trim(),
        outputFormat: formData.outputFormat.trim(),
        constraints: formData.constraints.trim(),
        exampleInput: formData.exampleInput.trim(),
        exampleOutput: formData.exampleOutput.trim(),
        starterCode: formData.starterCode.trim(),
      };

      if (editingId) {
        await api.put(`/problems/${editingId}`, payload);
        toast.success('Problem updated successfully!');
      } else {
        await api.post('/problems', payload);
        toast.success('Problem created successfully!');
      }
      fetchProblems();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving problem', err);
      toast.error(err.response?.data?.message || 'Failed to save problem.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, problemTitle) => {
    if (!window.confirm(`Are you sure you want to delete problem:\n"${problemTitle}"?\n\nThis will also remove all associated solutions and comments.`)) {
      return;
    }

    try {
      await api.delete(`/problems/${id}`);
      toast.success('Problem deleted successfully!');
      setProblems((prev) => prev.filter((p) => p._id !== id));
      if (selectedProblem?._id === id) {
        setIsDetailOpen(false);
      }
    } catch (err) {
      console.error('Failed to delete problem', err);
      toast.error(err.response?.data?.message || 'Failed to delete problem.');
    }
  };

  const handleToggleSolved = async (problem) => {
    try {
      const updatedStatus = !problem.isSolved;
      await api.put(`/problems/${problem._id}`, { isSolved: updatedStatus });
      toast.success(`Problem marked as ${updatedStatus ? 'Solved' : 'Open'}`);
      setProblems((prev) =>
        prev.map((p) => (p._id === problem._id ? { ...p, isSolved: updatedStatus } : p))
      );
      if (selectedProblem?._id === problem._id) {
        setSelectedProblem((prev) => ({ ...prev, isSolved: updatedStatus }));
      }
    } catch (err) {
      console.error('Failed to update status', err);
      toast.error('Failed to update problem status');
    }
  };

  // Metrics Calculations
  const totalProblems = problems.length;
  const solvedProblems = problems.filter((p) => p.isSolved).length;
  const openProblems = totalProblems - solvedProblems;
  const totalSolutions = problems.reduce((acc, p) => acc + (p.solutionsCount || 0), 0);
  const totalViews = problems.reduce((acc, p) => acc + (p.views || 0), 0);

  // Filtered List
  const filteredProblems = problems.filter((p) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      p.title?.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower) ||
      p.category?.toLowerCase().includes(searchLower) ||
      p.language?.toLowerCase().includes(searchLower) ||
      (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(searchLower))) ||
      p.creator?.name?.toLowerCase().includes(searchLower);

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'All' || p.type === typeFilter;
    const matchesLanguage = languageFilter === 'All' || p.language === languageFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Solved' && p.isSolved) ||
      (statusFilter === 'Open' && !p.isSolved);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesType && matchesLanguage && matchesStatus;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HiOutlineTerminal style={{ color: 'var(--accent-cyan)' }} /> Problem Hub Studio
          </h1>
          <p className="page-description">
            Create, moderate, inspect, and manage coding challenges and debug problems published on Problem Hub.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={fetchProblems}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HiOutlineRefresh /> Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HiOutlinePlus /> Create Problem
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Problems</span>
            <div className="stat-card-icon" style={{ background: 'rgba(0, 212, 255, 0.15)', color: '#00d4ff' }}>
              <HiOutlineTerminal size={22} />
            </div>
          </div>
          <div className="stat-card-value">{totalProblems}</div>
          <div className="stat-card-change" style={{ color: 'var(--text-secondary)' }}>
            Across {new Set(problems.map((p) => p.category)).size} Categories
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Solved Challenges</span>
            <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <HiOutlineCheckCircle size={22} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: '#10b981' }}>{solvedProblems}</div>
          <div className="stat-card-change" style={{ color: 'var(--text-secondary)' }}>
            {totalProblems ? Math.round((solvedProblems / totalProblems) * 100) : 0}% Resolution Rate
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Open Questions</span>
            <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <HiOutlineQuestionMarkCircle size={22} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: '#f59e0b' }}>{openProblems}</div>
          <div className="stat-card-change" style={{ color: 'var(--text-secondary)' }}>
            Awaiting Solutions
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Solutions</span>
            <div className="stat-card-icon" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#7c3aed' }}>
              <HiOutlineSparkles size={22} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: '#a78bfa' }}>{totalSolutions}</div>
          <div className="stat-card-change" style={{ color: 'var(--text-secondary)' }}>
            Submitted by Community
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Views</span>
            <div className="stat-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <HiOutlineEye size={22} />
            </div>
          </div>
          <div className="stat-card-value">{totalViews.toLocaleString()}</div>
          <div className="stat-card-change" style={{ color: 'var(--text-secondary)' }}>
            Platform Interactions
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <HiOutlineSearch
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search problems by title, tags, description, or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ minWidth: '140px', flex: '1 1 140px' }}>
            <select
              className="form-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div style={{ minWidth: '130px', flex: '1 1 130px' }}>
            <select
              className="form-input"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div style={{ minWidth: '140px', flex: '1 1 140px' }}>
            <select
              className="form-input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '120px', flex: '1 1 120px' }}>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Open">Open</option>
            </select>
          </div>

          {/* Language Filter */}
          <div style={{ minWidth: '130px', flex: '1 1 130px' }}>
            <select
              className="form-input"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <option value="All">All Languages</option>
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          {(search || categoryFilter !== 'All' || difficultyFilter !== 'All' || typeFilter !== 'All' || statusFilter !== 'All' || languageFilter !== 'All') && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setDifficultyFilter('All');
                setTypeFilter('All');
                setStatusFilter('All');
                setLanguageFilter('All');
              }}
              style={{ fontSize: '13px', padding: '8px 12px' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Problems Table / List */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <HiOutlineTerminal size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Problems Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
            {problems.length === 0
              ? 'Get started by creating your first Problem Hub coding challenge or debug exercise.'
              : 'No challenges match your active search and filter criteria.'}
          </p>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <HiOutlinePlus /> Create Problem
          </button>
        </div>
      ) : (
        <div className="table-container" style={{ borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', minWidth: '240px' }}>Challenge / Problem</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Category & Diff</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Language / Type</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Author</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Metrics</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((p) => {
                const diffColor =
                  p.difficulty === 'Easy'
                    ? '#10b981'
                    : p.difficulty === 'Hard'
                    ? '#f43f5e'
                    : '#f59e0b';

                return (
                  <tr
                    key={p._id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.2s ease',
                    }}
                    className="table-row-hover"
                  >
                    {/* Title & Preview */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {p.title}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.4',
                        }}
                      >
                        {p.description}
                      </div>
                      {p.tags && p.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                          {p.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '11px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-muted)',
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                          {p.tags.length > 3 && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              +{p.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Category & Difficulty */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(124, 58, 237, 0.15)',
                            color: '#a78bfa',
                            display: 'inline-block',
                          }}
                        >
                          {p.category || 'DSA'}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: `${diffColor}22`,
                            color: diffColor,
                            border: `1px solid ${diffColor}44`,
                            display: 'inline-block',
                          }}
                        >
                          {p.difficulty || 'Medium'}
                        </span>
                      </div>
                    </td>

                    {/* Language / Type */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                        {p.language || 'JavaScript'}
                      </div>
                      <div style={{ fontSize: '11px', color: p.type === 'Debug Challenge' ? '#f59e0b' : 'var(--text-secondary)' }}>
                        {p.type || 'Standard'}
                      </div>
                    </td>

                    {/* Author */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                        {p.creator?.name || 'System Admin'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {p.creator?.email || 'admin@techjourney.dev'}
                      </div>
                    </td>

                    {/* Metrics */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span title="Solutions Count" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <HiOutlineSparkles style={{ color: '#a78bfa' }} /> {p.solutionsCount || 0}
                        </span>
                        <span title="Comments Count" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <HiOutlineChatAlt2 style={{ color: '#38bdf8' }} /> {p.commentsCount || 0}
                        </span>
                        <span title="Views" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <HiOutlineEye style={{ color: '#94a3b8' }} /> {p.views || 0}
                        </span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleSolved(p)}
                        title="Click to toggle solved status"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: p.isSolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: p.isSolved ? '#10b981' : '#f59e0b',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          borderColor: p.isSolved ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                          transition: 'transform 0.15s ease',
                        }}
                      >
                        {p.isSolved ? (
                          <>
                            <HiOutlineCheckCircle /> Solved
                          </>
                        ) : (
                          <>
                            <HiOutlineQuestionMarkCircle /> Open
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon"
                          onClick={() => handleViewDetail(p)}
                          title="Preview Challenge Details"
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: 'var(--accent-cyan)',
                            cursor: 'pointer',
                          }}
                        >
                          <HiOutlineEye size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleOpenModal(p)}
                          title="Edit Challenge"
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: '#a78bfa',
                            cursor: 'pointer',
                          }}
                        >
                          <HiOutlinePencilAlt size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(p._id, p.title)}
                          title="Delete Challenge"
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(244, 63, 94, 0.1)',
                            border: '1px solid rgba(244, 63, 94, 0.2)',
                            borderRadius: '6px',
                            color: '#f43f5e',
                            cursor: 'pointer',
                          }}
                        >
                          <HiOutlineTrash size={16} />
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

      {/* ─── CREATE / EDIT MODAL ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '850px',
              width: '95%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '20px',
              background: '#121224',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              padding: '0',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HiOutlineTerminal style={{ color: 'var(--accent-cyan)' }} />
                  {editingId ? 'Edit Problem Challenge' : 'Create Problem Challenge'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Fill in the problem specifications, code templates, and challenge criteria.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-color)',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '0 24px',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                style={{
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'basic' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  color: activeTab === 'basic' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                1. Overview & Setup
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('statement')}
                style={{
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'statement' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  color: activeTab === 'statement' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                2. Problem Statement & Rules
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                style={{
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'code' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  color: activeTab === 'code' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                3. Starter Code & Test Cases
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>
                      Problem Title <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Reverse a Linked List, Fix Async Race Condition..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        className="form-input"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Difficulty</label>
                      <select
                        className="form-input"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      >
                        {DIFFICULTY_OPTIONS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Challenge Type</label>
                      <select
                        className="form-input"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        {TYPE_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Primary Language</label>
                      <select
                        className="form-input"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      >
                        {LANGUAGE_OPTIONS.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tags (comma-separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. linkedlist, pointers, recursion, bugfix"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: STATEMENT & RULES */}
              {activeTab === 'statement' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>
                      Problem Description <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <textarea
                      className="form-input"
                      rows={6}
                      placeholder="Explain the problem statement clearly. Markdown formatting is supported..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Input Format</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        placeholder="e.g. The first parameter is head node of singly linked list."
                        value={formData.inputFormat}
                        onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Output Format</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        placeholder="e.g. Return the new head node of the reversed list."
                        value={formData.outputFormat}
                        onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Constraints</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 0 <= Node.val <= 5000, 1 <= number of nodes <= 10^5"
                      value={formData.constraints}
                      onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    />
                  </div>

                  {formData.type === 'Debug Challenge' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', background: 'rgba(245, 158, 11, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ color: '#f59e0b' }}>Current Buggy Behavior</label>
                        <textarea
                          className="form-input"
                          rows={3}
                          placeholder="What is failing or producing the wrong output?"
                          value={formData.currentBehavior}
                          onChange={(e) => setFormData({ ...formData, currentBehavior: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ color: '#10b981' }}>Expected Proper Behavior</label>
                        <textarea
                          className="form-input"
                          rows={3}
                          placeholder="What should the code output after fixing?"
                          value={formData.expectedBehavior}
                          onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CODE & TEST CASES */}
              {activeTab === 'code' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Starter Code / Boilerplate ({formData.language})</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Given to users in editor</span>
                    </label>
                    <textarea
                      className="form-input"
                      rows={8}
                      style={{
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: '13px',
                        background: '#090912',
                      }}
                      placeholder={`function solve(input) {\n  // Your code here\n}`}
                      value={formData.starterCode}
                      onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Example Input</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        style={{ fontFamily: 'monospace', fontSize: '12px', background: '#090912' }}
                        placeholder="head = [1,2,3,4,5]"
                        value={formData.exampleInput}
                        onChange={(e) => setFormData({ ...formData, exampleInput: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Example Output</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        style={{ fontFamily: 'monospace', fontSize: '12px', background: '#090912' }}
                        placeholder="[5,4,3,2,1]"
                        value={formData.exampleOutput}
                        onChange={(e) => setFormData({ ...formData, exampleOutput: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeTab !== 'basic' && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setActiveTab(activeTab === 'code' ? 'statement' : 'basic')}
                    >
                      Previous Step
                    </button>
                  )}
                  {activeTab !== 'code' && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setActiveTab(activeTab === 'basic' ? 'statement' : 'code')}
                    >
                      Next Step
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : editingId ? 'Update Problem' : 'Publish Problem'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── PREVIEW / INSPECT MODAL ────────────────────────────────── */}
      {isDetailOpen && selectedProblem && (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '800px',
              width: '95%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '20px',
              background: '#121224',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              padding: '24px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(0, 212, 255, 0.15)',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    {selectedProblem.category}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background:
                        selectedProblem.difficulty === 'Easy'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : selectedProblem.difficulty === 'Hard'
                          ? 'rgba(244, 63, 94, 0.15)'
                          : 'rgba(245, 158, 11, 0.15)',
                      color:
                        selectedProblem.difficulty === 'Easy'
                          ? '#10b981'
                          : selectedProblem.difficulty === 'Hard'
                          ? '#f43f5e'
                          : '#f59e0b',
                    }}
                  >
                    {selectedProblem.difficulty}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {selectedProblem.language} • {selectedProblem.type}
                  </span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {selectedProblem.title}
                </h2>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <HiOutlineX size={22} />
              </button>
            </div>

            {/* Problem Description */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '16px',
                lineHeight: '1.6',
                color: 'var(--text-primary)',
                whiteSpace: 'pre-line',
              }}
            >
              {selectedProblem.description}
            </div>

            {/* Inputs & Outputs */}
            {(selectedProblem.exampleInput || selectedProblem.exampleOutput) && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                {selectedProblem.exampleInput && (
                  <div style={{ background: '#090912', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Example Input
                    </div>
                    <code style={{ fontSize: '12px', color: '#38bdf8' }}>{selectedProblem.exampleInput}</code>
                  </div>
                )}
                {selectedProblem.exampleOutput && (
                  <div style={{ background: '#090912', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Example Output
                    </div>
                    <code style={{ fontSize: '12px', color: '#10b981' }}>{selectedProblem.exampleOutput}</code>
                  </div>
                )}
              </div>
            )}

            {/* Starter Code Block */}
            {selectedProblem.starterCode && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Starter Code Template:
                  </span>
                  <button
                    onClick={() => handleCopyCode(selectedProblem.starterCode)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedCode ? <HiOutlineCheck /> : <HiOutlineClipboardCopy />} {copiedCode ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
                <pre
                  style={{
                    background: '#090912',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    overflowX: 'auto',
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '12px',
                    color: '#e2e8f0',
                  }}
                >
                  {selectedProblem.starterCode}
                </pre>
              </div>
            )}

            {/* Metadata Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Created by <strong>{selectedProblem.creator?.name || 'Admin'}</strong> •{' '}
                {new Date(selectedProblem.createdAt).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsDetailOpen(false);
                    handleOpenModal(selectedProblem);
                  }}
                >
                  <HiOutlinePencilAlt /> Edit Problem
                </button>
                <button className="btn btn-secondary" onClick={() => setIsDetailOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProblemHub;
