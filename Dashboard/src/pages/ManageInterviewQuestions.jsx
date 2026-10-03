import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaGithub } from 'react-icons/fa';
import {
  HiOutlineAcademicCap,
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
} from 'react-icons/hi';
import api from '../services/api';

const CATEGORY_OPTIONS = [
  'Node.js',
  'React',
  'JavaScript',
  'System Design',
  'Python',
  'Java',
  'Backend',
  'Frontend',
  'Database',
  'DevOps',
  'General',
];

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

const ManageInterviewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    question: '',
    category: 'Node.js',
    difficulty: 'Medium',
    answer: '',
    codeSnippet: '',
    explanation: '',
    tags: '',
    companyTags: '',
  });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/interviews');
      if (data?.success && Array.isArray(data.data)) {
        setQuestions(data.data);
      }
    } catch (err) {
      console.error('Failed to load interview questions', err);
      toast.error('Failed to fetch interview questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpenModal = (q = null) => {
    if (q) {
      setEditingId(q._id);
      setFormData({
        question: q.question || '',
        category: q.category || 'Node.js',
        difficulty: q.difficulty || 'Medium',
        answer: q.answer || '',
        codeSnippet: q.codeSnippet || '',
        explanation: q.explanation || '',
        tags: Array.isArray(q.tags) ? q.tags.join(', ') : '',
        companyTags: Array.isArray(q.companyTags) ? q.companyTags.join(', ') : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        question: '',
        category: 'Node.js',
        difficulty: 'Medium',
        answer: '',
        codeSnippet: '',
        explanation: '',
        tags: '',
        companyTags: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Question title and Detailed Answer are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        question: formData.question.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        answer: formData.answer.trim(),
        codeSnippet: formData.codeSnippet.trim(),
        explanation: formData.explanation.trim(),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        companyTags: formData.companyTags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingId) {
        const { data } = await api.put(`/interviews/${editingId}`, payload);
        if (data?.success) {
          toast.success('Interview question updated successfully!');
          fetchQuestions();
          handleCloseModal();
        }
      } else {
        const { data } = await api.post('/interviews', payload);
        if (data?.success) {
          toast.success('Interview question created successfully!');
          fetchQuestions();
          handleCloseModal();
        }
      }
    } catch (err) {
      console.error('Error saving question', err);
      toast.error(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, questionTitle) => {
    if (!window.confirm(`Are you sure you want to delete question:\n"${questionTitle}"?`)) {
      return;
    }

    try {
      const { data } = await api.delete(`/interviews/${id}`);
      if (data?.success) {
        toast.success('Question deleted successfully!');
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete question', err);
      toast.error(err.response?.data?.message || 'Failed to delete question.');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase()) ||
      (q.tags && q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory =
      categoryFilter === 'All' || q.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesDifficulty =
      difficultyFilter === 'All' || q.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
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
            <HiOutlineAcademicCap style={{ color: '#06B6D4' }} /> Interview Questions Studio
          </h1>
          <p className="page-description">
            Add, edit, manage, and publish tech interview questions for frontend visitors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={fetchQuestions} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HiOutlineRefresh /> Refresh
          </button>
          <Link
            to="/interview-repos"
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FaGithub /> GitHub Repos
          </Link>
          <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HiOutlinePlus /> Add New Question
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
          <HiOutlineSearch
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search questions, categories, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="All">All Categories</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="form-input"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="All">All Difficulties</option>
            {DIFFICULTY_OPTIONS.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Table / Cards */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px border rgba(255, 255, 255, 0.06)',
          }}
        >
          <HiOutlineQuestionMarkCircle style={{ fontSize: '48px', color: 'var(--text-muted)', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px' }}>No Interview Questions Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            Try clearing your search or add a new interview question.
          </p>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <HiOutlinePlus /> Create First Question
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredQuestions.map((q) => (
            <div
              key={q._id}
              style={{
                background: '#16162a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px 24px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: 'rgba(6, 182, 212, 0.15)',
                        color: '#06B6D4',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                      }}
                    >
                      {q.category}
                    </span>

                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background:
                          q.difficulty === 'Easy'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : q.difficulty === 'Hard'
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                        color:
                          q.difficulty === 'Easy'
                            ? '#10b981'
                            : q.difficulty === 'Hard'
                            ? '#ef4444'
                            : '#f59e0b',
                        border: `1px solid ${
                          q.difficulty === 'Easy'
                            ? 'rgba(16, 185, 129, 0.3)'
                            : q.difficulty === 'Hard'
                            ? 'rgba(239, 68, 68, 0.3)'
                            : 'rgba(245, 158, 11, 0.3)'
                        }`,
                      }}
                    >
                      {q.difficulty}
                    </span>

                    {q.companyTags && q.companyTags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '10px',
                          color: '#a78bfa',
                          background: 'rgba(167, 139, 250, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          border: '1px solid rgba(167, 139, 250, 0.2)',
                        }}
                      >
                        🏢 {tag}
                      </span>
                    ))}
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f0f0f5', lineHeight: '1.4' }}>
                    {q.question}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleOpenModal(q)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '13px' }}
                    title="Edit Question"
                  >
                    <HiOutlinePencilAlt /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q._id, q.question)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title="Delete Question"
                  >
                    <HiOutlineTrash /> Delete
                  </button>
                </div>
              </div>

              {/* Answer Preview */}
              <p
                style={{
                  fontSize: '13px',
                  color: '#94a3b8',
                  lineHeight: '1.5',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {q.answer}
              </p>

              {q.codeSnippet && (
                <div style={{ marginTop: '10px', fontSize: '11px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <HiOutlineCode /> Includes Code Example
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#121324',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineSparkles style={{ color: '#06B6D4' }} />
                {editingId ? 'Edit Interview Question' : 'Add New Interview Question'}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                <HiOutlineX />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                  Question Title *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. What is the Event Loop in Node.js?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                    Category *
                  </label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                    Difficulty Level *
                  </label>
                  <select
                    className="form-input"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    {DIFFICULTY_OPTIONS.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                  Detailed Answer *
                </label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder="Provide a clear, thorough answer to the interview question..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                  Code Snippet (Optional)
                </label>
                <textarea
                  className="form-input font-mono"
                  rows={4}
                  placeholder="// Provide code example if applicable..."
                  value={formData.codeSnippet}
                  onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                  style={{ fontFamily: 'monospace', fontSize: '13px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                  Key Explanation / Takeaways (Optional)
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Additional context, memory hints, or underlying concepts..."
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Async, Event Loop, Libuv"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                    Company Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Amazon, Google, Meta"
                    value={formData.companyTags}
                    onChange={(e) => setFormData({ ...formData, companyTags: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInterviewQuestions;
