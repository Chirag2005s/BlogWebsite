import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Loader2, HelpCircle } from 'lucide-react';
import api from '../../services/api';

const GithubIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ManageInterviews() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/interviews');
      if (data.success && Array.isArray(data.data)) {
        setQuestions(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch interview questions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      setDeletingId(id);
      await api.delete(`/interviews/${id}`);
      setQuestions(prev => prev.filter(q => q._id !== id));
    } catch (err) {
      console.error('Failed to delete question', err);
      alert('Failed to delete question.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0F6B4F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#0F6B4F]/10 text-[#0F6B4F] rounded-xl">
            <HelpCircle size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-heading">Manage Interview Q&A</h1>
            <p className="text-sm text-muted">Create, update, or remove interview questions</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/interview-repos"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111827] border border-line hover:bg-[#1E293B] text-white text-sm font-semibold rounded-xl transition-all shadow-md"
          >
            <GithubIcon size={18} />
            Manage GitHub Links
          </Link>
          <Link
            to="/admin/add-interview"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F6B4F] hover:bg-[#0C5A42] text-white text-sm font-semibold rounded-xl transition-all shadow-md"
          >
            <Plus size={18} />
            Add New Question
          </Link>
        </div>
      </div>

      <div className="bg-card border border-line rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#111827] border-b border-line text-xs uppercase font-semibold text-muted">
              <tr>
                <th className="px-6 py-4">Question</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50">
              {questions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-muted">
                    No interview questions found. Click "Add New Question" to create one.
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q._id} className="hover:bg-soft/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-heading max-w-[300px] truncate">
                      {q.question}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-page border border-line text-xs font-medium text-muted">
                        {q.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${
                        q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/edit-interview/${q._id}`}
                          className="p-2 rounded-lg bg-page border border-line text-muted hover:text-[#0F6B4F] transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(q._id)}
                          disabled={deletingId === q._id}
                          className="p-2 rounded-lg bg-page border border-line text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === q._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
