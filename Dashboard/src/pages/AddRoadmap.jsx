import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineMap,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineCollection,
  HiOutlineArrowLeft,
  HiOutlineSave,
  HiOutlineDocumentText,
} from 'react-icons/hi';
import api from '../services/api';

const AddRoadmap = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form Metadata
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
      title: 'Phase 1: Foundations & Core Mechanics',
      description: 'Master core concepts, tooling, and baseline syntax.',
      nodes: [
        {
          id: `node-${Date.now()}-1`,
          title: 'Core Fundamentals',
          tag: 'Must Learn',
          description: 'Key principles, runtime environment, and core syntax.',
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
        description: 'Deep dive into advanced architectural patterns.',
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
          description: 'Description of module competencies and learning goals.',
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

    if (!title.trim() || !description.trim()) {
      toast.error('Please enter a Roadmap Title and Description.');
      return;
    }

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
        toast.success('Programmer Roadmap published successfully via Dashboard!');
        setTimeout(() => {
          navigate('/content');
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to publish roadmap from Dashboard', err);
      toast.error(
        err.response?.data?.message || 'Failed to publish roadmap. Check server permissions.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineMap style={{ color: 'var(--accent-purple)' }} /> Create Programmer Roadmap
          </h1>
          <p className="page-description">
            Publish structured developer learning paths directly from the Admin Dashboard.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <HiOutlineArrowLeft /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Basic Roadmap Info */}
        <div className="card" style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineCollection style={{ color: 'var(--accent-cyan)' }} /> Basic Roadmap Settings
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Roadmap Title *</label>
              <input
                type="text"
                required
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI & Machine Learning Engineer"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Description *</label>
            <textarea
              rows={3}
              required
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive summary of engineering competencies, concepts, and goals..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Estimated Time</label>
              <input
                type="text"
                className="form-input"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="e.g. 6-8 Months"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Level</label>
              <input
                type="text"
                className="form-input"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g. Beginner to Advanced"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Icon Category</label>
              <select
                className="form-select"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
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

        {/* Phase & Module Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HiOutlineDocumentText style={{ color: 'var(--accent-purple)' }} /> Learning Phases & Modules
            </h3>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddPhase}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
            >
              <HiOutlinePlus /> Add Phase
            </button>
          </div>

          {phases.map((phase, pIdx) => (
            <div key={pIdx} className="card" style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
                  <div className="form-group">
                    <label className="form-label">Phase {pIdx + 1} Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={phase.title}
                      onChange={(e) => handlePhaseChange(pIdx, 'title', e.target.value)}
                      placeholder="Phase Title"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phase Summary</label>
                    <input
                      type="text"
                      className="form-input"
                      value={phase.description}
                      onChange={(e) => handlePhaseChange(pIdx, 'description', e.target.value)}
                      placeholder="Summary of phase"
                    />
                  </div>
                </div>

                {phases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePhase(pIdx)}
                    style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '8px', fontSize: '18px' }}
                    title="Remove Phase"
                  >
                    <HiOutlineTrash />
                  </button>
                )}
              </div>

              {/* Modules list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '12px', borderLeft: '2px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Modules inside Phase {pIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddNode(pIdx)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <HiOutlinePlus /> Add Module
                  </button>
                </div>

                {phase.nodes.map((node, nIdx) => (
                  <div key={node.id || nIdx} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ flex: 2 }}
                        value={node.title}
                        onChange={(e) => handleNodeChange(pIdx, nIdx, 'title', e.target.value)}
                        placeholder="Module Title (e.g. Docker Fundamentals)"
                      />
                      <input
                        type="text"
                        className="form-input"
                        style={{ flex: 1 }}
                        value={node.tag}
                        onChange={(e) => handleNodeChange(pIdx, nIdx, 'tag', e.target.value)}
                        placeholder="Tag (e.g. Core Skill)"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNode(pIdx, nIdx)}
                        style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px', fontSize: '16px' }}
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={node.description}
                      onChange={(e) => handleNodeChange(pIdx, nIdx, 'description', e.target.value)}
                      placeholder="Module description..."
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={node.keyTopicsInput}
                        onChange={(e) => handleNodeChange(pIdx, nIdx, 'keyTopicsInput', e.target.value)}
                        placeholder="Topics (comma separated)"
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={node.articleSlug}
                        onChange={(e) => handleNodeChange(pIdx, nIdx, 'articleSlug', e.target.value)}
                        placeholder="Optional Article Slug"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/content')}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <HiOutlineSave /> {loading ? 'Publishing...' : 'Publish Roadmap'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoadmap;
