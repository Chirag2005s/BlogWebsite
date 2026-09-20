import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  ArrowLeft,
  Save,
  BookOpen
} from 'lucide-react';
import api from '../../services/api';

export default function AddRoadmap() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('6-8 Months');
  const [level, setLevel] = useState('Beginner to Advanced');
  const [icon, setIcon] = useState('Compass');
  const [color, setColor] = useState('from-blue-600 to-cyan-500');

  // Phases State
  const [phases, setPhases] = useState([
    {
      phaseNumber: 1,
      title: 'Phase 1: Foundations & Core Concepts',
      description: 'Master core syntax, browser mechanics, and foundational tools.',
      nodes: [
        {
          id: `node-${Date.now()}-1`,
          title: 'Core Fundamentals',
          tag: 'Must Learn',
          description: 'Key principles, language fundamentals, and environment setup.',
          keyTopicsInput: 'Syntax, Environment Setup, Data Types, Control Flow',
          articleSlug: '',
        },
      ],
    },
  ]);

  // Phase Actions
  const handleAddPhase = () => {
    setPhases((prev) => [
      ...prev,
      {
        phaseNumber: prev.length + 1,
        title: `Phase ${prev.length + 1}: Advanced Topics`,
        description: 'Deep dive into advanced patterns and frameworks.',
        nodes: [],
      },
    ]);
  };

  const handleRemovePhase = (index) => {
    setPhases((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePhaseChange = (index, field, value) => {
    setPhases((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Node Actions
  const handleAddNode = (phaseIndex) => {
    setPhases((prev) => {
      const next = [...prev];
      const newNodes = [
        ...next[phaseIndex].nodes,
        {
          id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: 'New Module',
          tag: 'Core Skill',
          description: 'Description of module competencies and goals.',
          keyTopicsInput: 'Topic 1, Topic 2, Topic 3',
          articleSlug: '',
        },
      ];
      next[phaseIndex] = { ...next[phaseIndex], nodes: newNodes };
      return next;
    });
  };

  const handleRemoveNode = (phaseIndex, nodeIndex) => {
    setPhases((prev) => {
      const next = [...prev];
      const newNodes = next[phaseIndex].nodes.filter((_, i) => i !== nodeIndex);
      next[phaseIndex] = { ...next[phaseIndex], nodes: newNodes };
      return next;
    });
  };

  const handleNodeChange = (phaseIndex, nodeIndex, field, value) => {
    setPhases((prev) => {
      const next = [...prev];
      const updatedNodes = [...next[phaseIndex].nodes];
      updatedNodes[nodeIndex] = { ...updatedNodes[nodeIndex], [field]: value };
      next[phaseIndex] = { ...next[phaseIndex], nodes: updatedNodes };
      return next;
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!title.trim() || !description.trim()) {
      setError('Please provide a Roadmap Title and Description.');
      return;
    }

    // Format payload
    const formattedPhases = phases.map((phase, pIdx) => ({
      phaseNumber: pIdx + 1,
      title: phase.title,
      description: phase.description,
      nodes: phase.nodes.map((node, nIdx) => ({
        id: node.id || `node-${pIdx + 1}-${nIdx + 1}`,
        title: node.title,
        tag: node.tag || 'Core Skill',
        description: node.description,
        keyTopics: node.keyTopicsInput
          ? node.keyTopicsInput.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        articleSlug: node.articleSlug ? node.articleSlug.trim() : '',
      })),
    }));

    const payload = {
      title,
      category,
      description,
      estimatedTime,
      level,
      icon,
      color,
      phases: formattedPhases,
    };

    try {
      setLoading(true);
      const { data } = await api.post('/roadmaps', payload);
      if (data?.success) {
        setSuccessMsg('Roadmap created successfully via Admin Dashboard!');
        setTimeout(() => {
          navigate('/roadmaps');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to create roadmap', err);
      setError(
        err.response?.data?.message || 'Failed to create roadmap. Please check admin permissions.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-400 uppercase tracking-wider mb-1">
            <Compass size={14} />
            Admin Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Create Programmer Roadmap
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">
            Build and publish structured learning paths exclusively through the Admin Dashboard.
          </p>
        </div>

        <button
          onClick={() => navigate('/roadmaps')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass hover:bg-white/10 text-text-secondary hover:text-white text-xs font-medium transition-all"
        >
          <ArrowLeft size={14} />
          View All Roadmaps
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-error/15 border border-error/30 text-error text-xs flex items-center gap-3">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs flex items-center gap-3">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ═══ Basic Settings Card ═══ */}
        <div className="glass-card rounded-2xl p-6 border border-white/8 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-primary-400" />
            Basic Roadmap Metadata
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Roadmap Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Cyber Security Engineer Roadmap"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-white/8 text-white placeholder-text-muted text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-white/8 text-white text-xs focus:outline-none focus:border-primary-500"
              >
                <option value="Web Development">Web Development</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Systems Programming">Systems Programming</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of skills, goals, and technical focus..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-white/8 text-white placeholder-text-muted text-xs focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Estimated Time
              </label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="e.g., 6-8 Months"
                className="w-full px-4 py-2 rounded-xl bg-surface-900 border border-white/8 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Target Level
              </label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g., Beginner to Advanced"
                className="w-full px-4 py-2 rounded-xl bg-surface-900 border border-white/8 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Icon Component
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface-900 border border-white/8 text-white text-xs"
              >
                <option value="Compass">Compass</option>
                <option value="Layout">Layout (Frontend)</option>
                <option value="Server">Server (Backend)</option>
                <option value="Layers">Layers (Fullstack)</option>
                <option value="BrainCircuit">BrainCircuit (AI)</option>
                <option value="Cpu">Cpu (DevOps / Systems)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ═══ Phase & Node Builder ═══ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-purple-400" />
              Roadmap Phases & Modules
            </h3>

            <button
              type="button"
              onClick={handleAddPhase}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-600/20 text-primary-300 hover:bg-primary-600/30 border border-primary-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus size={14} /> Add Phase
            </button>
          </div>

          {phases.map((phase, pIdx) => (
            <div key={pIdx} className="glass-card rounded-2xl p-5 border border-white/8 space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-text-muted mb-1">
                      Phase {pIdx + 1} Title
                    </label>
                    <input
                      type="text"
                      value={phase.title}
                      onChange={(e) => handlePhaseChange(pIdx, 'title', e.target.value)}
                      placeholder="Phase Title"
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-900 border border-white/8 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-text-muted mb-1">
                      Phase Summary
                    </label>
                    <input
                      type="text"
                      value={phase.description}
                      onChange={(e) => handlePhaseChange(pIdx, 'description', e.target.value)}
                      placeholder="Brief overview of phase"
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-900 border border-white/8 text-white text-xs"
                    />
                  </div>
                </div>

                {phases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePhase(pIdx)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-error/10 transition-colors cursor-pointer"
                    title="Delete Phase"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Modules / Nodes inside Phase */}
              <div className="space-y-3 pl-2 sm:pl-4">
                <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
                  <span>Modules inside Phase {pIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleAddNode(pIdx)}
                    className="text-primary-400 hover:text-primary-300 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} /> Add Module
                  </button>
                </div>

                {phase.nodes.map((node, nIdx) => (
                  <div key={node.id || nIdx} className="p-4 rounded-xl bg-surface-900/80 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <input
                          type="text"
                          value={node.title}
                          onChange={(e) => handleNodeChange(pIdx, nIdx, 'title', e.target.value)}
                          placeholder="Module Title (e.g. JWT Auth)"
                          className="px-3 py-1.5 rounded-lg bg-surface-800 border border-white/5 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={node.tag}
                          onChange={(e) => handleNodeChange(pIdx, nIdx, 'tag', e.target.value)}
                          placeholder="Tag (e.g. Core Skill, Essential)"
                          className="px-3 py-1.5 rounded-lg bg-surface-800 border border-white/5 text-white text-xs"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveNode(pIdx, nIdx)}
                        className="p-1 text-text-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={node.description}
                      onChange={(e) => handleNodeChange(pIdx, nIdx, 'description', e.target.value)}
                      placeholder="Module description and skill goals..."
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-800 border border-white/5 text-white text-xs"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={node.keyTopicsInput}
                        onChange={(e) => handleNodeChange(pIdx, nIdx, 'keyTopicsInput', e.target.value)}
                        placeholder="Topics (comma separated e.g. JWT, Refresh Tokens, Bcrypt)"
                        className="px-3 py-1.5 rounded-lg bg-surface-800 border border-white/5 text-white text-xs"
                      />
                      <input
                        type="text"
                        value={node.articleSlug}
                        onChange={(e) => handleNodeChange(pIdx, nIdx, 'articleSlug', e.target.value)}
                        placeholder="Optional Article Slug for Deep Dive"
                        className="px-3 py-1.5 rounded-lg bg-surface-800 border border-white/5 text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-white/8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/roadmaps')}
            className="px-5 py-2.5 rounded-xl glass hover:bg-white/10 text-text-secondary text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-lg shadow-primary-600/20 transition-all cursor-pointer disabled:opacity-60"
          >
            <Save size={14} />
            {loading ? 'Publishing...' : 'Publish Roadmap (Admin Only)'}
          </button>
        </div>
      </form>
    </div>
  );
}
