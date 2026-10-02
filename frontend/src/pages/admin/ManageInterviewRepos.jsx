import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Loader2, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const GithubIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ManageInterviewRepos() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [githubRepos, setGithubRepos] = useState([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/settings/github_interview_repos');
      if (data.success && data.data) {
        setGithubRepos(JSON.parse(data.data));
      }
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');
      
      const filteredRepos = githubRepos.filter(r => r.url.trim() !== '');

      await api.post('/settings', {
        key: 'github_interview_repos',
        value: JSON.stringify(filteredRepos)
      });
      
      setMessage('Repositories saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings', error);
      setMessage('Failed to save repositories. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addRepo = () => {
    setGithubRepos([...githubRepos, { title: '', url: '' }]);
  };

  const removeRepo = (index) => {
    setGithubRepos(githubRepos.filter((_, i) => i !== index));
  };

  const updateRepo = (index, field, value) => {
    const newRepos = [...githubRepos];
    newRepos[index][field] = value;
    setGithubRepos(newRepos);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0F6B4F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/admin/interviews"
          className="p-2 rounded-xl bg-card border border-line text-muted hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#0F6B4F]/10 text-[#0F6B4F] rounded-xl">
            <GithubIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-heading">Manage GitHub Links</h1>
            <p className="text-sm text-muted">Configure the repository links shown on the Interview Questions page</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-card border border-line rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
        {message && (
          <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium ${
            message.includes('success') 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <h2 className="text-lg font-semibold text-heading">Repository Links</h2>
            <p className="text-xs text-muted mt-1">Users will see these links in a beautifully designed popup menu.</p>
          </div>
          <button
            type="button"
            onClick={addRepo}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F6B4F]/10 hover:bg-[#0F6B4F]/20 text-[#10b981] text-sm font-semibold rounded-xl transition-all border border-[#0F6B4F]/20"
          >
            <Plus size={16} />
            Add New Link
          </button>
        </div>
        
        <div className="space-y-4">
          {githubRepos.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-line bg-page/50">
              <GithubIcon size={48} className="mx-auto text-muted mb-3 opacity-50" />
              <p className="text-heading font-medium">No Repositories Configured</p>
              <p className="text-sm text-muted mt-1">Click "Add New Link" above to start adding GitHub repositories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {githubRepos.map((repo, index) => (
                <div key={index} className="group relative bg-page border border-line rounded-2xl p-4 sm:p-5 transition-all hover:border-[#0F6B4F]/40 hover:shadow-[0_0_15px_rgba(15,107,79,0.1)]">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    
                    <div className="w-full sm:w-1/3">
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 ml-1">Title</label>
                      <input
                        type="text"
                        value={repo.title}
                        onChange={(e) => updateRepo(index, 'title', e.target.value)}
                        placeholder="e.g. Node.js Master Repo"
                        className="w-full px-4 py-2.5 bg-card border border-line rounded-xl text-sm focus:outline-none focus:border-[#0F6B4F] transition-colors text-heading"
                      />
                    </div>

                    <div className="w-full flex-1">
                      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 ml-1">GitHub URL</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon size={16} className="text-muted" />
                        </div>
                        <input
                          type="url"
                          value={repo.url}
                          onChange={(e) => updateRepo(index, 'url', e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full pl-10 pr-10 py-2.5 bg-card border border-line rounded-xl text-sm focus:outline-none focus:border-[#0F6B4F] transition-colors text-heading font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeRepo(index)}
                      className="mt-6 p-2.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all self-end sm:self-auto border border-transparent hover:border-red-500/20"
                      title="Remove Repository"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-line flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#0F6B4F] to-[#16805E] hover:from-[#0C5A42] hover:to-[#0F6B4F] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? 'Saving Links...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
