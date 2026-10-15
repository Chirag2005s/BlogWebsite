import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  Circle,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  Zap,
  Layers,
  Layout,
  Server,
  BrainCircuit,
  Cpu,
  ChevronRight,
  Clock,
  Award,
  BookMarked,
  X,
  Share2,
  Check,
  Filter,
  Code2,
  ShieldCheck,
  Globe
} from 'lucide-react';
import api from '../services/api';

const ICON_MAP = {
  Layout: Layout,
  Server: Server,
  Layers: Layers,
  BrainCircuit: BrainCircuit,
  Cpu: Cpu,
  Compass: Compass,
};

const CATEGORY_FILTERS = [
  { id: 'All', label: 'All Tracks', icon: Compass },
  { id: 'Web Development', label: 'Web Dev', icon: Globe },
  { id: 'Frontend', label: 'Frontend', icon: Layout },
  { id: 'Backend', label: 'Backend', icon: Server },
  { id: 'Full Stack', label: 'Full Stack', icon: Layers },
  { id: 'AI & Data Science', label: 'AI & ML', icon: BrainCircuit },
  { id: 'DevOps & Cloud', label: 'DevOps', icon: Cpu },
];

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRoadmapId, setActiveRoadmapId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTopics, setCompletedTopics] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Load completed topics from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('programmer_roadmap_progress');
      if (saved) {
        setCompletedTopics(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load roadmap progress', e);
    }
  }, []);

  // Save completed topics to LocalStorage
  const toggleTopic = (topicId) => {
    setCompletedTopics((prev) => {
      const next = { ...prev, [topicId]: !prev[topicId] };
      try {
        localStorage.setItem('programmer_roadmap_progress', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save progress', e);
      }
      return next;
    });
  };

  // Fetch Roadmaps from Backend
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/roadmaps');
        if (data?.success && Array.isArray(data.data)) {
          setRoadmaps(data.data);
          if (data.data.length > 0) {
            setActiveRoadmapId(data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch roadmaps from backend', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  // Frontend Category Filter
  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((map) => {
      if (selectedCategory === 'All') return true;
      const cat = (map.category || '').toLowerCase();
      const title = (map.title || '').toLowerCase();
      const id = (map.id || '').toLowerCase();
      const targetCat = selectedCategory.toLowerCase();

      if (targetCat === 'frontend') {
        return cat.includes('frontend') || title.includes('frontend') || id.includes('frontend');
      }
      if (targetCat === 'backend') {
        return cat.includes('backend') || title.includes('backend') || id.includes('backend');
      }
      if (targetCat === 'full stack') {
        return cat.includes('full stack') || cat.includes('fullstack') || title.includes('full-stack') || title.includes('fullstack') || id.includes('fullstack');
      }
      if (targetCat === 'ai & data science') {
        return cat.includes('ai') || cat.includes('data') || title.includes('ai') || title.includes('machine learning');
      }
      if (targetCat === 'devops & cloud') {
        return cat.includes('devops') || cat.includes('cloud') || title.includes('devops');
      }
      if (targetCat === 'web development') {
        return cat.includes('web') || title.includes('frontend') || title.includes('backend') || title.includes('full-stack');
      }
      return cat.includes(targetCat) || title.includes(targetCat);
    });
  }, [roadmaps, selectedCategory]);

  // Keep activeRoadmapId valid when category filter changes
  useEffect(() => {
    if (filteredRoadmaps.length > 0) {
      const exists = filteredRoadmaps.some((r) => r.id === activeRoadmapId);
      if (!exists) {
        setActiveRoadmapId(filteredRoadmaps[0].id);
      }
    }
  }, [filteredRoadmaps, activeRoadmapId]);

  // Current Active Roadmap
  const currentRoadmap = useMemo(() => {
    return filteredRoadmaps.find((r) => r.id === activeRoadmapId) || filteredRoadmaps[0] || roadmaps[0];
  }, [filteredRoadmaps, roadmaps, activeRoadmapId]);

  // Calculate Progress Stats
  const progressStats = useMemo(() => {
    if (!currentRoadmap) return { completed: 0, total: 0, percentage: 0 };
    let total = 0;
    let completed = 0;
    currentRoadmap.phases?.forEach((phase) => {
      phase.nodes?.forEach((node) => {
        total++;
        if (completedTopics[node.id]) completed++;
      });
    });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [currentRoadmap, completedTopics]);

  // Filtered Nodes based on Search Query
  const matchesSearch = (node) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      node.title.toLowerCase().includes(q) ||
      node.description.toLowerCase().includes(q) ||
      node.keyTopics?.some((t) => t.toLowerCase().includes(q))
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* ═══ Header ═══ */}
      <div className="relative py-8 sm:py-12 border-b border-line overflow-hidden">
        <div className="relative max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full surface-card border border-line text-xs font-mono text-[#06B6D4]">
              <Compass size={14} />
              <span>Developer Career Paths</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Sparkles size={12} />
              <span>Interactive Skill Blueprints</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-heading tracking-tight">
            Developer <span className="tech-gradient-text">Roadmaps</span>
          </h1>

          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Step-by-step technical blueprints for modern software engineers. Filter by domain (Web, Backend, Frontend, Full Stack, AI, DevOps), track progress, and master core engineering competencies.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, frameworks, or skills..."
                className="w-full pl-10 pr-4 py-2.5 input-field text-white placeholder-text-muted text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#1E293B]/80 text-muted hover:text-white text-xs font-medium border border-line transition-all cursor-pointer"
            >
              {copiedShare ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
              <span>{copiedShare ? 'Link Copied!' : 'Share Roadmap'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Category Filters (Frontend Only Filter Bar) ═══ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
          <Filter size={14} className="text-primary-400" />
          Filter Track Domain:
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_FILTERS.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-500 shadow-md shadow-primary-600/30'
                    : 'bg-surface-800/80 text-text-secondary hover:text-white hover:bg-surface-700/90 border-white/6'
                }`}
              >
                <IconComp size={14} />
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ═══ Loading State ═══ */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted text-sm">Fetching programmer roadmaps from backend...</p>
        </div>
      ) : filteredRoadmaps.length === 0 ? (
        <div className="py-16 text-center glass-card rounded-2xl p-8 border border-white/5">
          <Compass size={40} className="mx-auto text-text-muted mb-3" />
          <h3 className="text-lg font-bold text-white">No Roadmaps Matching Filter</h3>
          <p className="text-text-secondary text-sm mt-1">Try selecting "All Tracks" or clearing your search query.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* ═══ Roadmap Selection Tabs ═══ */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/6">
            {filteredRoadmaps.map((map) => {
              const IconComp = ICON_MAP[map.icon] || Compass;
              const isActive = activeRoadmapId === map.id;
              return (
                <motion.button
                  key={map.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveRoadmapId(map.id)}
                  className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2.5 cursor-pointer border ${
                    isActive
                      ? `bg-gradient-to-r ${map.color} text-white border-transparent shadow-lg shadow-primary-500/20`
                      : 'bg-surface-800/60 text-text-secondary hover:text-white hover:bg-surface-700/80 border-white/6'
                  }`}
                >
                  <IconComp size={16} />
                  <span>{map.title.replace(' Roadmap', '')}</span>
                </motion.button>
              );
            })}
          </div>

          {currentRoadmap && (
            <div className="space-y-8">
              {/* ═══ Active Roadmap Overview Card ═══ */}
              <div className={`glass-card rounded-2xl p-6 sm:p-8 border ${currentRoadmap.borderColor} relative overflow-hidden`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-primary-500/15 text-primary-300 border border-primary-500/20">
                        {currentRoadmap.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-text-muted">
                        <Clock size={12} /> {currentRoadmap.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-text-muted">
                        <Award size={12} /> {currentRoadmap.level}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {currentRoadmap.title}
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {currentRoadmap.description}
                    </p>
                  </div>

                  {/* Progress Meter */}
                  <div className="glass bg-surface-900/80 rounded-2xl p-5 border border-white/8 min-w-[220px] flex flex-col justify-center space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted font-medium">Your Mastery Progress</span>
                      <span className="text-primary-400 font-bold font-mono">{progressStats.percentage}%</span>
                    </div>

                    <div className="w-full bg-surface-700 h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressStats.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-primary-500 to-purple-500 h-full rounded-full"
                      />
                    </div>

                    <div className="text-[11px] text-text-muted text-right">
                      {progressStats.completed} of {progressStats.total} modules completed
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══ Visual Learning Path (Phases & Nodes) ═══ */}
              <div className="space-y-10 relative">
                {/* Vertical timeline line */}
                <div className="hidden lg:block absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary-500/40 via-purple-500/20 to-transparent pointer-events-none" />

                {currentRoadmap.phases?.map((phase) => {
                  const matchingNodes = phase.nodes?.filter(matchesSearch) || [];
                  if (matchingNodes.length === 0 && searchQuery) return null;

                  return (
                    <div key={phase.phaseNumber} className="relative space-y-6">
                      {/* Phase Banner */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-extrabold text-sm flex items-center justify-center shadow-lg shadow-primary-500/20 z-10">
                          P{phase.phaseNumber}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                          <p className="text-xs text-text-muted">{phase.description}</p>
                        </div>
                      </motion.div>

                      {/* Phase Nodes Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pl-0 lg:pl-12">
                        {matchingNodes.map((node, idx) => {
                          const isDone = !!completedTopics[node.id];
                          return (
                            <motion.div
                              key={node.id}
                              initial={{ opacity: 0, y: 16 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.35, delay: idx * 0.04 }}
                              whileHover={{ y: -4, scale: 1.01 }}
                              className={`glass-card rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between group ${
                                isDone
                                  ? 'border-green-500/40 bg-green-500/5'
                                  : 'border-white/8 hover:border-primary-500/30'
                              }`}
                            >
                              <div className="space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2">
                                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-surface-700 text-primary-300 border border-white/5">
                                    {node.tag}
                                  </span>
                                  <motion.button
                                    whileTap={{ scale: 0.82 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTopic(node.id);
                                    }}
                                    className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-text-muted hover:text-white"
                                    title={isDone ? 'Mark incomplete' : 'Mark complete'}
                                  >
                                    {isDone ? (
                                      <CheckCircle2 size={20} className="text-green-400 fill-green-500/20" />
                                    ) : (
                                      <Circle size={20} className="text-text-muted hover:text-white" />
                                    )}
                                  </motion.button>
                                </div>

                                {/* Title & Description */}
                                <h4
                                  onClick={() => setSelectedNode(node)}
                                  className="text-base font-bold text-white group-hover:text-primary-300 transition-colors cursor-pointer"
                                >
                                  {node.title}
                                </h4>
                                <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                                  {node.description}
                                </p>

                                {/* Key Topics */}
                                {node.keyTopics && node.keyTopics.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pt-2">
                                    {node.keyTopics.map((topic, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-0.5 rounded text-[10px] bg-surface-900/80 text-text-muted border border-white/5"
                                      >
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Footer Actions */}
                              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                                <button
                                  onClick={() => setSelectedNode(node)}
                                  className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  View Modules <ChevronRight size={13} />
                                </button>

                                {node.articleSlug && (
                                  <Link
                                    to={`/article/${node.articleSlug}`}
                                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
                                  >
                                    <BookOpen size={11} /> Article Guide
                                  </Link>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══ Module Detail Modal ═══ */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNode(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card bg-surface-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-white/10 space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                  {selectedNode.tag}
                </span>
                <h3 className="text-xl font-bold text-white">{selectedNode.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{selectedNode.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Core Skills & Concepts</h4>
                <div className="space-y-2">
                  {selectedNode.keyTopics?.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-800/80 border border-white/5 text-xs text-text-primary">
                      <Zap size={13} className="text-primary-400 flex-shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/8 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    toggleTopic(selectedNode.id);
                    setSelectedNode(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    completedTopics[selectedNode.id]
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20'
                  }`}
                >
                  <CheckCircle2 size={15} />
                  {completedTopics[selectedNode.id] ? 'Completed ✓' : 'Mark as Completed'}
                </button>

                {selectedNode.articleSlug && (
                  <Link
                    to={`/article/${selectedNode.articleSlug}`}
                    onClick={() => setSelectedNode(null)}
                    className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-purple-300 text-xs font-semibold border border-purple-500/30 flex items-center gap-1.5"
                  >
                    <BookOpen size={14} /> Read Guide
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
