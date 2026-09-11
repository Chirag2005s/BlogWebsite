import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Code2, FileCode, ChevronRight, Send, AlertCircle,
  Layers, Terminal, Cpu, BookOpen, ArrowLeft
} from 'lucide-react';
import api from '../services/api';

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Rust', 'Go',
  'C++', 'C', 'Java', 'Kotlin', 'Swift', 'PHP', 'Ruby',
  'Dart', 'R', 'Scala', 'Shell / Bash', 'Other',
];

const AddProgrammingPost = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    language: 'JavaScript',
    difficulty: 'Beginner',
    coverImage: '',
    category: '',
  });

  // Check auth via localStorage (same pattern as the rest of the frontend)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('userInfo');
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) setCategories(data.data || []);
      } catch {
        // ignore
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.excerpt || !form.content) {
      setError('Title, excerpt, and content are required.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/articles', {
        ...form,
        type: 'programming',
        status: 'Draft', // goes to admin review first
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.authCard}>
          <div style={styles.authIcon}><Code2 size={40} /></div>
          <h2 style={styles.authTitle}>Sign in to Post</h2>
          <p style={styles.authText}>
            You need to be logged in to share programming content with the community.
          </p>
          <Link
            to="/login"
            state={{ returnTo: '/programming/submit' }}
            style={styles.loginBtn}
          >
            Log In to Continue <ChevronRight size={16} />
          </Link>
          <Link to="/programming" style={styles.backLink}>
            <ArrowLeft size={14} /> Back to Programming
          </Link>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (success) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.authCard}>
          <div style={{ ...styles.authIcon, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>✅</div>
          <h2 style={styles.authTitle}>Post Submitted!</h2>
          <p style={styles.authText}>
            Your programming post has been submitted for review. It will appear publicly after admin approval.
          </p>
          <button onClick={() => navigate('/programming')} style={styles.loginBtn}>
            Back to Programming <ChevronRight size={16} />
          </button>
          <button onClick={() => { setSuccess(false); setForm({ title: '', excerpt: '', content: '', language: 'JavaScript', difficulty: 'Beginner', coverImage: '', category: '' }); }} style={styles.backLink}>
            Submit Another Post
          </button>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div style={styles.wrapper}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>
          <Code2 size={14} />
          Community Submission
        </div>
        <h1 style={styles.heroTitle}>Share Your Programming Knowledge</h1>
        <p style={styles.heroSubtitle}>
          Post tutorials, code snippets, tips, and insights for the developer community.
          All submissions are reviewed before going live.
        </p>
        <Link to="/programming" style={styles.backLink}>
          <ArrowLeft size={14} /> Back to Programming
        </Link>
      </div>

      {/* Form Card */}
      <div style={styles.formCard}>
        {error && (
          <div style={styles.errorBanner}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Title */}
          <div style={styles.group}>
            <label style={styles.label}>Title *</label>
            <input
              style={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. How to implement a Binary Search Tree in Python"
              required
            />
          </div>

          {/* Excerpt */}
          <div style={styles.group}>
            <label style={styles.label}>Short Description *</label>
            <input
              style={styles.input}
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="One sentence that summarises your post..."
              required
            />
          </div>

          {/* Content */}
          <div style={styles.group}>
            <label style={styles.label}>Content * <span style={styles.hint}>(HTML or plain text supported)</span></label>
            <textarea
              style={styles.textarea}
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder={`Write your tutorial, explanation, or code walkthrough here...\n\nYou can include code blocks like:\n<pre><code>const x = 42;</code></pre>`}
              required
            />
          </div>

          {/* Row: Language + Difficulty */}
          <div style={styles.row}>
            <div style={{ ...styles.group, flex: 1 }}>
              <label style={styles.label}>Programming Language</label>
              <select style={styles.select} name="language" value={form.language} onChange={handleChange}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ ...styles.group, flex: 1 }}>
              <label style={styles.label}>Difficulty</label>
              <select style={styles.select} name="difficulty" value={form.difficulty} onChange={handleChange}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Row: Category + Cover Image */}
          <div style={styles.row}>
            {categories.length > 0 && (
              <div style={{ ...styles.group, flex: 1 }}>
                <label style={styles.label}>Category</label>
                <select style={styles.select} name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            )}
            <div style={{ ...styles.group, flex: 1 }}>
              <label style={styles.label}>Cover Image URL <span style={styles.hint}>(optional)</span></label>
              <input
                style={styles.input}
                type="url"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>

          {/* Preview */}
          {form.coverImage && (
            <div style={styles.group}>
              <label style={styles.label}>Cover Preview</label>
              <img src={form.coverImage} alt="preview" style={styles.preview} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} style={loading ? { ...styles.submitBtn, opacity: 0.6 } : styles.submitBtn}>
            {loading ? 'Submitting…' : <><Send size={16} /> Submit for Review</>}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ── Inline Styles ── */
const styles = {
  wrapper: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '40px 20px 80px',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  hero: {
    marginBottom: 32,
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(0,212,255,0.1)',
    color: '#00d4ff',
    border: '1px solid rgba(0,212,255,0.25)',
    borderRadius: 20,
    padding: '4px 14px',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 'clamp(24px, 4vw, 36px)',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: 12,
    lineHeight: 1.2,
  },
  heroSubtitle: {
    color: '#8b8ba3',
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 16,
  },
  authCard: {
    background: 'rgba(22,22,42,0.7)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: '48px 40px',
    textAlign: 'center',
    backdropFilter: 'blur(12px)',
  },
  authIcon: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(0,212,255,0.1)',
    color: '#00d4ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    margin: '0 auto 20px',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#f0f0f5',
    marginBottom: 10,
  },
  authText: {
    color: '#8b8ba3',
    fontSize: 15,
    lineHeight: 1.6,
    marginBottom: 28,
  },
  loginBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    marginBottom: 16,
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
    color: '#5a5a72',
    fontSize: 13,
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginTop: 4,
  },
  formCard: {
    background: 'rgba(22,22,42,0.7)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: '32px 36px',
    backdropFilter: 'blur(12px)',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(244,63,94,0.1)',
    border: '1px solid rgba(244,63,94,0.3)',
    color: '#f43f5e',
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: 14,
    marginBottom: 24,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  row: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#8b8ba3',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  hint: {
    fontSize: 11,
    fontWeight: 400,
    textTransform: 'none',
    color: '#5a5a72',
  },
  input: {
    background: 'rgba(20,20,40,0.8)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
    color: '#f0f0f5',
    fontSize: 14,
    padding: '12px 14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  textarea: {
    background: 'rgba(20,20,40,0.8)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
    color: '#f0f0f5',
    fontSize: 14,
    padding: '12px 14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: 240,
    lineHeight: 1.7,
    fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
  },
  select: {
    background: 'rgba(20,20,40,0.8)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
    color: '#f0f0f5',
    fontSize: 14,
    padding: '12px 14px',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  preview: {
    width: '100%',
    maxHeight: 200,
    objectFit: 'cover',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '14px 28px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
    transition: 'opacity 0.2s',
    fontFamily: 'inherit',
  },
};

export default AddProgrammingPost;
