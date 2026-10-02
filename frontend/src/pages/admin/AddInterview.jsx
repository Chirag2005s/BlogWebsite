import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, Code, Hash, Briefcase, HelpCircle, AlignLeft, Tag, BookOpen, Zap, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = ['General', 'Node.js', 'React', 'JavaScript', 'System Design', 'Python', 'Databases', 'DevOps'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const DIFFICULTY_STYLES = {
  Easy: 'bg-green-500/10 text-green-400 border-green-500/30 ring-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 ring-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-400 border-red-500/30 ring-red-500/20',
};

const CATEGORY_COLORS = {
  General: '#6366f1',
  'Node.js': '#22c55e',
  React: '#38bdf8',
  JavaScript: '#facc15',
  'System Design': '#a78bfa',
  Python: '#3b82f6',
  Databases: '#f97316',
  DevOps: '#ec4899',
};

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-card border border-line rounded-2xl overflow-hidden shadow-sm hover:border-[#0F6B4F]/30 transition-colors">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-line bg-[#111827]/60">
        <div className="p-2 bg-[#0F6B4F]/10 rounded-lg">
          <Icon size={16} className="text-[#10b981]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-heading">{title}</h2>
          {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">
        {children}
      </div>
    </div>
  );
}

function FormField({ label, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label} {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-muted italic">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default function AddInterview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    difficulty: 'Medium',
    codeSnippet: '',
    explanation: '',
    tags: '',
    companyTags: ''
  });

  useEffect(() => {
    if (isEditMode) fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/interviews/${id}`);
      if (data.success) {
        const q = data.data;
        setFormData({
          question: q.question || '',
          answer: q.answer || '',
          category: q.category || 'General',
          difficulty: q.difficulty || 'Medium',
          codeSnippet: q.codeSnippet || '',
          explanation: q.explanation || '',
          tags: q.tags ? q.tags.join(', ') : '',
          companyTags: q.companyTags ? q.companyTags.join(', ') : ''
        });
      }
    } catch (err) {
      setError('Failed to load question details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError('Question and Answer fields are required.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        companyTags: formData.companyTags.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (isEditMode) {
        await api.put(`/interviews/${id}`, payload);
      } else {
        await api.post('/interviews', payload);
      }
      navigate('/admin/interviews');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 h-12 bg-page border border-line rounded-xl text-sm focus:outline-none focus:border-[#0F6B4F] focus:ring-2 focus:ring-[#0F6B4F]/10 transition-all text-heading placeholder:text-muted/50";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0F6B4F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/interviews')}
          className="p-2.5 rounded-xl bg-card border border-line text-muted hover:text-white hover:border-[#0F6B4F]/40 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#0F6B4F]/20 to-[#0F6B4F]/5 border border-[#0F6B4F]/20 rounded-xl">
            <HelpCircle size={22} className="text-[#10b981]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-heading">
              {isEditMode ? 'Edit Interview Question' : 'Add New Question'}
            </h1>
            <p className="text-sm text-muted mt-0.5">
              {isEditMode ? 'Update the details of this interview question' : 'Create a detailed Q&A entry for interview preparation'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Section 1: Core Q&A */}
        <SectionCard icon={HelpCircle} title="Core Question & Answer" description="The primary content users will study">
          <FormField label="Question Title" required>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="e.g. What is the Event Loop in Node.js?"
              className={inputClass}
              required
            />
          </FormField>
          <FormField label="Detailed Answer" required hint="Markdown supported">
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Write a comprehensive, well-structured answer here..."
              className="w-full h-48 px-4 py-3 bg-page border border-line rounded-xl text-sm focus:outline-none focus:border-[#0F6B4F] focus:ring-2 focus:ring-[#0F6B4F]/10 transition-all text-heading placeholder:text-muted/50 font-mono resize-y"
              required
            />
          </FormField>
        </SectionCard>

        {/* Section 2: Classification */}
        <SectionCard icon={Tag} title="Classification" description="Categorize for easier filtering">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Category">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {/* Category preview */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted">Preview:</span>
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold border"
                  style={{
                    color: CATEGORY_COLORS[formData.category] || '#6366f1',
                    borderColor: `${CATEGORY_COLORS[formData.category] || '#6366f1'}30`,
                    background: `${CATEGORY_COLORS[formData.category] || '#6366f1'}10`,
                  }}
                >
                  {formData.category}
                </span>
              </div>
            </FormField>

            <FormField label="Difficulty Level">
              <div className="flex gap-3">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: d }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      formData.difficulty === d
                        ? `${DIFFICULTY_STYLES[d]} ring-2 scale-[1.02]`
                        : 'bg-page border-line text-muted hover:border-white/20'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">Currently selected: <span className="font-semibold text-heading">{formData.difficulty}</span></p>
            </FormField>
          </div>
        </SectionCard>

        {/* Section 3: Code & Explanation */}
        <SectionCard icon={Code} title="Code & Explanation" description="Optional supporting content">
          <FormField label="Code Snippet" hint="Optional">
            <textarea
              name="codeSnippet"
              value={formData.codeSnippet}
              onChange={handleChange}
              placeholder="// Paste a relevant code example here..."
              className="w-full h-36 px-4 py-3 bg-[#0a0f1a] border border-line rounded-xl text-xs focus:outline-none focus:border-[#0F6B4F] focus:ring-2 focus:ring-[#0F6B4F]/10 transition-all text-[#a9b1d6] font-mono resize-y"
            />
          </FormField>
          <FormField label="Key Takeaway / Explanation" hint="Optional">
            <input
              type="text"
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              placeholder="A one-liner summary or key insight to remember..."
              className={inputClass}
            />
          </FormField>
        </SectionCard>

        {/* Section 4: Tags */}
        <SectionCard icon={Zap} title="Tags & Company Links" description="Help users discover and filter questions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="General Tags" hint="Comma separated">
              <div className="relative">
                <div className="absolute left-3 top-3.5 pointer-events-none">
                  <Hash size={15} className="text-muted" />
                </div>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. async, promises, callbacks"
                  className={`${inputClass} pl-9`}
                />
              </div>
              {formData.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.tags.split(',').map(t => t.trim()).filter(Boolean).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-[#0F6B4F]/10 text-[#10b981] text-xs border border-[#0F6B4F]/20">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </FormField>

            <FormField label="Company Tags" hint="Comma separated">
              <div className="relative">
                <div className="absolute left-3 top-3.5 pointer-events-none">
                  <Briefcase size={15} className="text-muted" />
                </div>
                <input
                  type="text"
                  name="companyTags"
                  value={formData.companyTags}
                  onChange={handleChange}
                  placeholder="e.g. Google, Amazon, Meta"
                  className={`${inputClass} pl-9`}
                />
              </div>
              {formData.companyTags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.companyTags.split(',').map(t => t.trim()).filter(Boolean).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </FormField>
          </div>
        </SectionCard>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/interviews')}
            className="px-6 py-3 bg-card border border-line text-muted hover:text-white hover:border-white/20 text-sm font-semibold rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#0F6B4F] to-[#16805E] hover:from-[#0C5A42] hover:to-[#0F6B4F] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? 'Saving...' : (isEditMode ? 'Update Question' : 'Publish Question')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
