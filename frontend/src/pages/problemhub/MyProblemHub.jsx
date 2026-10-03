import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Code2, Target, Trophy, Flame, Search, ChevronRight, ChevronLeft, 
  Plus, CheckCircle2, MessageSquare, ThumbsUp, Eye, Trash2, Calendar, 
  ExternalLink, Loader2, Star, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

export default function MyProblemHub({ activeTab = 'problems' }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(activeTab);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [hubData, setHubData] = useState({
    stats: {
      problemsPosted: 0,
      problemsSolved: 0,
      acceptedSolutions: 0,
      streak: 0,
      reputation: 100,
      topSkills: ['JavaScript', 'Problem Solving']
    },
    problems: [],
    solutions: [],
    activity: []
  });

  useEffect(() => {
    let isMounted = true;

    const fetchHubData = async () => {
      try {
        setLoading(true);
        // Call backend my-hub endpoint
        const { data } = await api.get('/problems/my-hub');
        if (isMounted && data) {
          setHubData({
            stats: {
              problemsPosted: data.stats?.problemsPosted ?? 0,
              problemsSolved: data.stats?.problemsSolved ?? 0,
              acceptedSolutions: data.stats?.acceptedSolutions ?? 0,
              streak: data.stats?.streak ?? 0,
              reputation: data.stats?.reputation ?? 100,
              topSkills: data.stats?.topSkills?.length ? data.stats.topSkills : ['JavaScript', 'Problem Solving']
            },
            problems: data.problems || [],
            solutions: data.solutions || [],
            activity: data.activity || []
          });
        }
      } catch (error) {
        console.warn('Backend /problems/my-hub request failed, attempting fallback calculation:', error);
        // Fallback calculation using public /problems endpoint
        try {
          const { data: allProblems } = await api.get('/problems');
          if (isMounted) {
            const currentUserId = userInfo?._id;
            const userProblems = currentUserId 
              ? allProblems.filter(p => String(p.creator?._id || p.creator) === String(currentUserId))
              : [];
            
            setHubData(prev => ({
              ...prev,
              stats: {
                ...prev.stats,
                problemsPosted: userProblems.length,
                problemsSolved: 0,
                acceptedSolutions: 0
              },
              problems: userProblems
            }));
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (userInfo) {
      fetchHubData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteProblem = async (problemId, problemTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${problemTitle}"? This will also remove any related comments and solutions.`)) {
      return;
    }

    try {
      setDeletingId(problemId);
      await api.delete(`/problems/${problemId}`);
      setHubData(prev => {
        const updatedProblems = prev.problems.filter(p => p._id !== problemId);
        return {
          ...prev,
          stats: {
            ...prev.stats,
            problemsPosted: Math.max(0, prev.stats.problemsPosted - 1)
          },
          problems: updatedProblems
        };
      });
    } catch (error) {
      console.error('Failed to delete problem:', error);
      alert('Failed to delete problem. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const stats = [
    { 
      label: 'Problems Posted', 
      value: hubData.stats.problemsPosted, 
      icon: <Code2 size={20} className="text-blue-400" />, 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/20',
      description: 'Challenges created by you'
    },
    { 
      label: 'Problems Solved', 
      value: hubData.stats.problemsSolved, 
      icon: <Target size={20} className="text-green-400" />, 
      bg: 'bg-green-500/10', 
      border: 'border-green-500/20',
      description: 'Challenges you solved'
    },
    { 
      label: 'Accepted Solutions', 
      value: hubData.stats.acceptedSolutions, 
      icon: <Trophy size={20} className="text-yellow-400" />, 
      bg: 'bg-yellow-500/10', 
      border: 'border-yellow-500/20',
      description: 'Accepted by problem authors'
    },
    { 
      label: 'Current Streak', 
      value: `${hubData.stats.streak} Day${hubData.stats.streak === 1 ? '' : 's'}`, 
      icon: <Flame size={20} className="text-orange-400" />, 
      bg: 'bg-orange-500/10', 
      border: 'border-orange-500/20',
      description: 'Consecutive active days'
    },
  ];

  const userName = userInfo?.name || 'Developer';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back Link */}
      <Link 
        to="/problemhub" 
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-[#0F6B4F] mb-6 transition-colors font-medium"
      >
        <ChevronLeft size={16} /> Back to ProblemHub
      </Link>

      {/* Profile Header */}
      <div className="bg-card border border-line rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0F6B4F] to-[#4FD1A5] flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-[#0F6B4F]/20 shrink-0">
            {userInitial}
          </div>
          
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-heading">{userName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0F6B4F]/15 text-[#4FD1A5] border border-[#0F6B4F]/30">
                My Hub
              </span>
            </div>
            <p className="text-slate-400 mb-4">{userInfo?.email || 'TechJourney Developer'}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-soft border border-line rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Star size={13} className="text-[#F4A62A]" />
                Reputation: <span className="text-[#4FD1A5] font-bold">{hubData.stats.reputation.toLocaleString()}</span>
              </span>
              <span className="px-3 py-1 bg-soft border border-line rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#0F6B4F]" />
                Top Skills: <span className="text-heading font-semibold">{hubData.stats.topSkills.join(', ')}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/problemhub/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(15,107,79,0.3)] hover:-translate-y-0.5"
          >
            <Plus size={16} /> Post Problem
          </Link>
          <Link
            to="/problemhub"
            className="flex items-center gap-2 px-5 py-2.5 bg-soft hover:bg-line border border-line text-heading rounded-xl text-sm font-semibold transition-all"
          >
            Browse Problems
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${stat.border} ${stat.bg} flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02]`}>
            <div className="mb-2 p-2 rounded-xl bg-card/60 backdrop-blur-sm shadow-sm">{stat.icon}</div>
            <div className="text-3xl font-extrabold text-heading mb-1 font-mono tracking-tight">
              {loading ? <Loader2 size={24} className="animate-spin text-muted mx-auto" /> : stat.value}
            </div>
            <div className="text-xs text-muted uppercase tracking-wider font-bold mb-1">{stat.label}</div>
            <div className="text-[11px] text-slate-500 hidden sm:block">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-card border border-line rounded-3xl overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-line overflow-x-auto scrollbar-hide">
          {[
            { id: 'problems', label: 'My Problems', count: hubData.problems.length },
            { id: 'solutions', label: 'My Solutions', count: hubData.solutions.length },
            { id: 'activity', label: 'Activity Feed', count: hubData.activity.length },
            { id: 'saved', label: 'Saved Problems' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center justify-center gap-2 ${
                tab === t.id 
                  ? 'border-[#0F6B4F] text-[#0F6B4F] bg-[#0F6B4F]/5' 
                  : 'border-transparent text-muted hover:text-heading hover:bg-soft/50'
              }`}
            >
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  tab === t.id ? 'bg-[#0F6B4F]/20 text-[#0F6B4F]' : 'bg-soft text-muted'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-[#0F6B4F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* TAB: PROBLEMS */}
              {tab === 'problems' && (
                <motion.div
                  key="problems"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {hubData.problems.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-soft rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted">
                        <Code2 size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-heading mb-2">No problems posted yet</h3>
                      <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
                        Share tricky bugs, coding challenges, or algorithm problems with the developer community.
                      </p>
                      <Link 
                        to="/problemhub/create"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-semibold transition-all shadow-md"
                      >
                        <Plus size={18} /> Post Your First Problem
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hubData.problems.map((prob) => (
                        <div 
                          key={prob._id} 
                          className="bg-card border border-line rounded-2xl p-5 hover:border-[#0F6B4F]/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  prob.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                                  prob.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                  'bg-red-500/10 text-red-500'
                                }`}>
                                  {prob.difficulty}
                                </span>
                                <span className="text-xs text-muted font-medium px-2 py-0.5 rounded-full bg-soft">
                                  {prob.language}
                                </span>
                                <span className="text-xs text-muted font-medium px-2 py-0.5 rounded-full bg-soft">
                                  {prob.category}
                                </span>
                              </div>
                              {prob.isSolved && (
                                <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                                  <CheckCircle2 size={12} /> Solved
                                </span>
                              )}
                            </div>

                            <Link 
                              to={`/problemhub/problem/${prob._id}`}
                              className="text-lg font-bold text-heading group-hover:text-[#0F6B4F] transition-colors line-clamp-1 mb-2 block"
                            >
                              {prob.title}
                            </Link>

                            <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                              {prob.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-line flex items-center justify-between text-xs text-muted">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1" title="Solutions">
                                <Code2 size={14} /> {prob.solutionsCount || 0}
                              </span>
                              <span className="flex items-center gap-1" title="Views">
                                <Eye size={14} /> {prob.views || 0}
                              </span>
                              <span className="flex items-center gap-1" title="Likes">
                                <ThumbsUp size={14} /> {prob.likes || 0}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDeleteProblem(prob._id, prob.title)}
                                disabled={deletingId === prob._id}
                                className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Delete problem"
                              >
                                {deletingId === prob._id ? <Loader2 size={15} className="animate-spin text-red-500" /> : <Trash2 size={15} />}
                              </button>
                              <Link
                                to={`/problemhub/problem/${prob._id}`}
                                className="px-3 py-1 bg-[#0F6B4F]/10 hover:bg-[#0F6B4F]/20 text-[#0F6B4F] rounded-lg font-semibold transition-colors flex items-center gap-1"
                              >
                                View <ChevronRight size={14} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: SOLUTIONS */}
              {tab === 'solutions' && (
                <motion.div
                  key="solutions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {hubData.solutions.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-soft rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted">
                        <Target size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-heading mb-2">No solutions submitted yet</h3>
                      <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
                        Explore challenges in ProblemHub and submit your solutions to build your reputation.
                      </p>
                      <Link 
                        to="/problemhub"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-semibold transition-all shadow-md"
                      >
                        Explore Problems to Solve <ChevronRight size={18} />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hubData.solutions.map((sol) => {
                        const problemId = sol.problemId?._id || sol.problemId;
                        const problemTitle = sol.problemId?.title || 'Coding Problem';
                        const problemCategory = sol.problemId?.category || 'Algorithm';

                        return (
                          <div 
                            key={sol._id} 
                            className={`bg-card border rounded-2xl p-5 shadow-sm transition-all ${
                              sol.isAccepted ? 'border-[#0F6B4F]/40 bg-[#0F6B4F]/[0.02]' : 'border-line'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-soft text-muted">
                                    {sol.language}
                                  </span>
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-soft text-muted">
                                    {problemCategory}
                                  </span>
                                  {sol.isAccepted && (
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#0F6B4F] bg-[#0F6B4F]/10 border border-[#0F6B4F]/20 px-2.5 py-0.5 rounded-full">
                                      <CheckCircle2 size={13} /> Accepted Solution
                                    </span>
                                  )}
                                </div>
                                <Link 
                                  to={`/problemhub/problem/${problemId}`}
                                  className="text-base font-bold text-heading hover:text-[#0F6B4F] transition-colors"
                                >
                                  {problemTitle}
                                </Link>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted flex items-center gap-1">
                                  <Calendar size={13} /> {new Date(sol.createdAt).toLocaleDateString()}
                                </span>
                                <Link
                                  to={`/problemhub/problem/${problemId}`}
                                  className="px-3 py-1 bg-soft hover:bg-line text-heading rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                                >
                                  View Discussion <ExternalLink size={12} />
                                </Link>
                              </div>
                            </div>

                            {sol.explanation && (
                              <p className="text-xs text-slate-300 mb-3 bg-soft/50 p-3 rounded-xl border border-line/60">
                                {sol.explanation}
                              </p>
                            )}

                            <div className="rounded-xl overflow-hidden border border-line bg-[#0a0a0a]">
                              <pre className="p-3 text-xs font-mono text-[#a9b1d6] overflow-x-auto max-h-36">
                                {sol.code}
                              </pre>
                            </div>

                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-line text-xs text-muted">
                              <span className="flex items-center gap-1">
                                <ThumbsUp size={14} className={sol.likes > 0 ? 'text-[#0F6B4F]' : ''} /> {sol.likes || 0} Likes
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare size={14} /> {sol.comments || 0} Comments
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: ACTIVITY */}
              {tab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {hubData.activity.length === 0 ? (
                    <div className="text-center py-16 text-muted">
                      <Calendar size={32} className="mx-auto mb-3 opacity-50" />
                      <h3 className="text-lg font-bold text-heading mb-1">No activity recorded yet</h3>
                      <p className="text-sm text-slate-400">Your recent problems and solutions will appear here.</p>
                    </div>
                  ) : (
                    <div className="relative pl-6 border-l-2 border-line space-y-6">
                      {hubData.activity.map((act, idx) => (
                        <div key={idx} className="relative group">
                          {/* Dot icon */}
                          <div className={`absolute -left-[31px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-card ${
                            act.type === 'problem_posted'
                              ? 'border-blue-500 text-blue-500'
                              : act.isAccepted
                              ? 'border-green-500 text-green-500'
                              : 'border-[#0F6B4F] text-[#0F6B4F]'
                          }`}>
                            {act.type === 'problem_posted' ? <Code2 size={12} /> : <CheckCircle2 size={12} />}
                          </div>

                          <div className="bg-card border border-line rounded-xl p-4 shadow-sm group-hover:border-[#0F6B4F]/30 transition-all">
                            <div className="flex items-center justify-between text-xs text-muted mb-1">
                              <span className="font-semibold uppercase tracking-wider text-[10px]">
                                {act.type === 'problem_posted' ? 'Posted a Problem' : act.isAccepted ? 'Accepted Solution' : 'Submitted Solution'}
                              </span>
                              <span>{new Date(act.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <Link 
                              to={`/problemhub/problem/${act.problemId || act.id}`}
                              className="text-sm font-bold text-heading hover:text-[#0F6B4F] transition-colors block"
                            >
                              {act.title}
                            </Link>

                            <div className="mt-2 flex items-center gap-2">
                              {act.language && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-soft text-muted">
                                  {act.language}
                                </span>
                              )}
                              {act.difficulty && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-soft text-muted">
                                  {act.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: SAVED */}
              {tab === 'saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 bg-soft rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted">
                    <Search size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-2">No saved problems</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
                    Bookmark interesting challenges while browsing ProblemHub to solve them later.
                  </p>
                  <Link 
                    to="/problemhub"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-semibold transition-all shadow-md"
                  >
                    Browse Challenges <ChevronRight size={18} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
