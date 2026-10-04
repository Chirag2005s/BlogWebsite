import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MessageSquare, Code2, ThumbsUp, ThumbsDown, Terminal, 
  Bug, CheckCircle2, Send, Info, X, Loader2, Copy, Check, Eye, 
  Calendar, AlertCircle, Share2, Sparkles, FileText, User, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

export default function ProblemDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('problem');
  const [loading, setLoading] = useState(true);
  
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // Solution Editor State
  const [showEditor, setShowEditor] = useState(false);
  const [solutionCode, setSolutionCode] = useState('');
  const [solutionExplanation, setSolutionExplanation] = useState('');
  const [solutionLanguage, setSolutionLanguage] = useState('');
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [acceptingSolId, setAcceptingSolId] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const editorRef = useRef(null);

  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const isAuthor = Boolean(userInfo && problem && (String(problem.creator?._id || problem.creator) === String(userInfo._id)));
  const creatorName = problem?.creator?.name || (isAuthor ? userInfo.name : 'Developer');
  const navigate = useNavigate();
  const [isDeletingProblem, setIsDeletingProblem] = useState(false);

  const handleDeleteProblem = async () => {
    if (!problem?._id || !isAuthor) return;
    if (!window.confirm(`Are you sure you want to delete "${problem.title}"? This cannot be undone and will permanently remove this problem, its solutions, and comments.`)) {
      return;
    }
    setIsDeletingProblem(true);
    try {
      await api.delete(`/problems/${id}`);
      navigate('/problemhub');
    } catch (err) {
      console.error('Failed to delete problem:', err);
      alert(err.response?.data?.message || 'Failed to delete problem. Only the author has access to delete this problem.');
    } finally {
      setIsDeletingProblem(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [probRes, solRes, comRes] = await Promise.all([
          api.get(`/problems/${id}`),
          api.get(`/problems/${id}/solutions`).catch(() => ({ data: [] })),
          api.get(`/problems/${id}/comments`).catch(() => ({ data: [] }))
        ]);
        setProblem(probRes.data);
        setSolutionLanguage(probRes.data.language || 'JavaScript');
        setSolutions(Array.isArray(solRes.data) ? solRes.data : []);
        setComments(Array.isArray(comRes.data) ? comRes.data : []);
      } catch (error) {
        console.error('Failed to fetch problem details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsPostingComment(true);
    try {
      const { data } = await api.post(`/problems/${id}/comments`, { text: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment', error);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleSolutionVote = (solId, type) => {
    setSolutions(solutions.map(sol => {
      if (sol._id === solId || sol.id === solId) {
        return {
          ...sol,
          likes: type === 'like' ? (sol.likes || 0) + 1 : sol.likes,
          dislikes: type === 'dislike' ? (sol.dislikes || 0) + 1 : sol.dislikes
        };
      }
      return sol;
    }));
  };

  const handleCommentVote = (commentId, type) => {
    setComments(comments.map(c => {
      if (c._id === commentId || c.id === commentId) {
        return {
          ...c,
          likes: type === 'like' ? (c.likes || 0) + 1 : c.likes,
          dislikes: type === 'dislike' ? (c.dislikes || 0) + 1 : c.dislikes
        };
      }
      return c;
    }));
  };

  const handleToggleAcceptSolution = async (solutionId) => {
    try {
      setAcceptingSolId(solutionId);
      const { data } = await api.patch(`/problems/${id}/solutions/${solutionId}/accept`);
      setSolutions(solutions.map(s => {
        if (s._id === solutionId) {
          return { ...s, isAccepted: data.solution.isAccepted };
        }
        return { ...s, isAccepted: false };
      }));
      setProblem(prev => ({ ...prev, isSolved: data.problem.isSolved }));
    } catch (error) {
      console.error('Failed to toggle accept solution', error);
      alert(error.response?.data?.message || 'Failed to update accepted status');
    } finally {
      setAcceptingSolId(null);
    }
  };

  const openEditor = () => {
    setShowEditor(true);
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!solutionCode.trim()) return;
    setIsSubmittingCode(true);
    
    try {
      const { data } = await api.post(`/problems/${id}/solutions`, {
        language: solutionLanguage,
        code: solutionCode,
        explanation: solutionExplanation
      });
      setSolutions([data, ...solutions]);
      setActiveTab('solutions');
      setShowEditor(false);
      setSolutionCode('');
      setSolutionExplanation('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to submit solution', error);
      alert('Failed to submit solution');
    } finally {
      setIsSubmittingCode(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col justify-center items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#0F6B4F] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-muted">Loading challenge details...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 bg-soft rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-heading mb-2">Problem Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
          The requested problem may have been removed or does not exist.
        </p>
        <Link 
          to="/problemhub" 
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-bold transition-all text-sm shadow-md"
        >
          <ChevronLeft size={16} /> Return to Problem Hub
        </Link>
      </div>
    );
  }

  const diffClass =
    problem.difficulty === 'Easy'
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
      : problem.difficulty === 'Medium'
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25';

  const tags = Array.isArray(problem.tags) ? problem.tags : [];
  const createdDate = problem.createdAt 
    ? new Date(problem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in overflow-x-hidden">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link 
          to="/problemhub" 
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-[#0F6B4F] dark:hover:text-[#4FD1A5] transition-colors font-semibold"
        >
          <ChevronLeft size={18} /> Back to Problem Hub
        </Link>

        <button
          onClick={() => handleCopy(window.location.href, 'share-link')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-line hover:border-slate-500 text-muted hover:text-heading rounded-xl text-xs font-semibold transition-all shadow-sm"
          title="Copy link to problem"
        >
          {copiedKey === 'share-link' ? (
            <>
              <Check size={14} className="text-[#0F6B4F] dark:text-[#4FD1A5]" />
              <span className="text-[#0F6B4F] dark:text-[#4FD1A5]">Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={14} />
              <span>Share Problem</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start w-full min-w-0">
        {/* Left Column: Problem Details & Tabs */}
        <div className="w-full lg:flex-1 min-w-0 space-y-6">
          <div className="bg-card border border-line rounded-3xl p-5 md:p-8 shadow-sm min-w-0 overflow-hidden">
            {/* Header Badges */}
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${diffClass}`}>
                {problem.difficulty || 'Medium'}
              </span>

              {problem.language && (
                <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-soft border border-line text-heading flex items-center gap-1.5">
                  <Code2 size={13} className="text-[#0F6B4F] dark:text-[#4FD1A5]" />
                  {problem.language}
                </span>
              )}

              {problem.category && (
                <span className="text-xs font-medium px-3 py-1 rounded-xl bg-soft border border-line text-muted">
                  {problem.category}
                </span>
              )}

              {problem.type === 'Debug Challenge' && (
                <span className="bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <Bug size={13} /> Debug Challenge
                </span>
              )}

              {problem.isSolved && (
                <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Solved
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-heading mb-4 leading-tight tracking-tight">
              {problem.title}
            </h1>
            
            {/* Author & Meta bar */}
            <div className="flex items-center justify-between gap-4 text-xs text-muted mb-6 pb-6 border-b border-line flex-wrap">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0F6B4F] to-[#4FD1A5] flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
                    {creatorName.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-semibold text-heading">@{creatorName}</span>
                </div>

                {createdDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>Posted {createdDate}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Eye size={13} />
                  <span>{problem.views || 0} views</span>
                </div>
              </div>

              {/* Author-only Delete Problem Access */}
              {isAuthor && (
                <button
                  onClick={handleDeleteProblem}
                  disabled={isDeletingProblem}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/15 border border-red-500/25 transition-all shadow-sm"
                  title="Delete this problem (Author only)"
                >
                  {isDeletingProblem ? (
                    <Loader2 size={13} className="animate-spin text-red-500" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  <span>Delete Problem</span>
                </button>
              )}
            </div>

            {/* TABS */}
            <div className="flex gap-2 border-b border-line mb-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('problem')}
                className={`px-5 py-3 text-sm font-bold capitalize whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'problem' 
                    ? 'border-[#0F6B4F] text-[#0F6B4F] dark:text-[#4FD1A5]' 
                    : 'border-transparent text-muted hover:text-heading hover:border-line'
                }`}
              >
                <FileText size={16} />
                <span>Problem Statement</span>
              </button>

              <button
                onClick={() => setActiveTab('solutions')}
                className={`px-5 py-3 text-sm font-bold capitalize whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'solutions' 
                    ? 'border-[#0F6B4F] text-[#0F6B4F] dark:text-[#4FD1A5]' 
                    : 'border-transparent text-muted hover:text-heading hover:border-line'
                }`}
              >
                <Code2 size={16} />
                <span>Solutions</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  activeTab === 'solutions' ? 'bg-[#0F6B4F]/20 text-[#0F6B4F] dark:text-[#4FD1A5]' : 'bg-soft text-muted'
                }`}>
                  {solutions.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('discussion')}
                className={`px-5 py-3 text-sm font-bold capitalize whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'discussion' 
                    ? 'border-[#0F6B4F] text-[#0F6B4F] dark:text-[#4FD1A5]' 
                    : 'border-transparent text-muted hover:text-heading hover:border-line'
                }`}
              >
                <MessageSquare size={16} />
                <span>Discussion</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  activeTab === 'discussion' ? 'bg-[#0F6B4F]/20 text-[#0F6B4F] dark:text-[#4FD1A5]' : 'bg-soft text-muted'
                }`}>
                  {comments.length}
                </span>
              </button>
            </div>

            {/* TAB 1: PROBLEM STATEMENT */}
            {activeTab === 'problem' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-8 select-text"
              >
                {/* Description */}
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-[#0F6B4F] dark:text-[#4FD1A5]" />
                    Description
                  </h3>
                  <div className="text-slate-800 dark:text-slate-200 text-base leading-relaxed whitespace-pre-line bg-soft/30 border border-line/60 rounded-2xl p-5 shadow-inner break-words">
                    {problem.description || 'No description provided.'}
                  </div>
                </div>

                {/* Debug Challenge Behavior Boxes */}
                {problem.type === 'Debug Challenge' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-5 min-w-0 break-words">
                      <h4 className="text-emerald-700 dark:text-emerald-400 font-bold mb-2 flex items-center gap-2 text-sm">
                        <CheckCircle2 size={18} /> Expected Behavior
                      </h4>
                      <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        {problem.expectedBehavior || 'Not specified.'}
                      </p>
                    </div>
                    <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-5 min-w-0 break-words">
                      <h4 className="text-rose-700 dark:text-rose-400 font-bold mb-2 flex items-center gap-2 text-sm">
                        <Bug size={18} /> Current Buggy Behavior
                      </h4>
                      <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        {problem.currentBehavior || 'Not specified.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Input & Output Format (Rendered when present) */}
                {(problem.inputFormat || problem.outputFormat) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {problem.inputFormat && (
                      <div className="bg-card border border-line rounded-2xl p-5 min-w-0">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                          <Terminal size={14} className="text-[#0F6B4F] dark:text-[#4FD1A5]" />
                          Input Format
                        </h4>
                        <div className="font-mono text-xs md:text-sm text-slate-800 dark:text-slate-200 bg-soft border border-line/60 rounded-xl p-3 whitespace-pre-line break-words">
                          {problem.inputFormat}
                        </div>
                      </div>
                    )}
                    {problem.outputFormat && (
                      <div className="bg-card border border-line rounded-2xl p-5 min-w-0">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                          <Terminal size={14} className="text-[#F4A62A]" />
                          Output Format
                        </h4>
                        <div className="font-mono text-xs md:text-sm text-slate-800 dark:text-slate-200 bg-soft border border-line/60 rounded-xl p-3 whitespace-pre-line break-words">
                          {problem.outputFormat}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && (
                  <div className="bg-card border border-line rounded-2xl p-5 min-w-0">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
                      <AlertCircle size={15} className="text-amber-500" />
                      Constraints
                    </h3>
                    <div className="font-mono text-xs md:text-sm text-slate-800 dark:text-slate-200 bg-soft border border-line/60 rounded-xl p-3.5 whitespace-pre-line break-words">
                      {problem.constraints}
                    </div>
                  </div>
                )}

                {/* Example Input / Output */}
                {(problem.exampleInput || problem.exampleOutput) && (
                  <div className="min-w-0">
                    <h3 className="text-base font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-500" />
                      Example
                    </h3>
                    <div className="bg-[#0f172a] dark:bg-[#070d18] border border-line rounded-2xl p-5 font-mono text-xs md:text-sm shadow-md space-y-3 min-w-0 overflow-hidden">
                      {problem.exampleInput && (
                        <div className="min-w-0">
                          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Input:</div>
                          <pre className="text-emerald-400 bg-black/40 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap break-all select-text">
                            {problem.exampleInput}
                          </pre>
                        </div>
                      )}
                      {problem.exampleOutput && (
                        <div className="min-w-0">
                          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Output:</div>
                          <pre className="text-amber-300 bg-black/40 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap break-all select-text">
                            {problem.exampleOutput}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Starter Code Section */}
                {problem.starterCode && (
                  <div className="min-w-0">
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <h3 className="text-base font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                        <Code2 size={16} className="text-[#0F6B4F] dark:text-[#4FD1A5]" />
                        Starter Code & Template
                      </h3>
                      <button
                        onClick={() => handleCopy(problem.starterCode, 'starter-code')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-soft hover:bg-line border border-line rounded-xl text-xs font-semibold text-heading transition-all shadow-sm shrink-0"
                        title="Copy starter code to clipboard"
                      >
                        {copiedKey === 'starter-code' ? (
                          <>
                            <Check size={14} className="text-[#0F6B4F] dark:text-[#4FD1A5]" />
                            <span className="text-[#0F6B4F] dark:text-[#4FD1A5]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-line shadow-md min-w-0">
                      <div className="bg-[#1e293b] px-4 py-2.5 text-xs font-mono text-slate-300 border-b border-line flex items-center justify-between">
                        <span className="font-semibold">{problem.language || 'Code'}</span>
                        <span className="text-[11px] text-slate-400">Read-only starter template</span>
                      </div>
                      <pre className="bg-[#0b0f19] p-5 text-xs md:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed select-text whitespace-pre-wrap break-words">
                        {problem.starterCode}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Pseudocode (if present) */}
                {problem.pseudocode && (
                  <div className="min-w-0">
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <h3 className="text-base font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                        <Terminal size={16} className="text-[#F4A62A]" />
                        Pseudocode Guide
                      </h3>
                      <button
                        onClick={() => handleCopy(problem.pseudocode, 'pseudocode')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-soft hover:bg-line border border-line rounded-xl text-xs font-semibold text-heading transition-all shadow-sm shrink-0"
                      >
                        {copiedKey === 'pseudocode' ? (
                          <>
                            <Check size={14} className="text-[#0F6B4F] dark:text-[#4FD1A5]" />
                            <span className="text-[#0F6B4F] dark:text-[#4FD1A5]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy Pseudocode</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-[#0b0f19] border border-line p-5 text-xs md:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed rounded-2xl select-text whitespace-pre-wrap break-words">
                      {problem.pseudocode}
                    </pre>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: SOLUTIONS */}
            {activeTab === 'solutions' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-6 select-text"
              >
                {solutions.length === 0 ? (
                  <div className="text-center py-16 bg-soft/40 border border-line rounded-2xl p-8">
                    <div className="w-14 h-14 bg-card border border-line rounded-2xl flex items-center justify-center mx-auto mb-3 text-muted">
                      <Code2 size={26} />
                    </div>
                    <h3 className="text-lg font-bold text-heading mb-1">No Solutions Yet</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm max-w-sm mx-auto mb-5 leading-relaxed">
                      Be the first developer to crack this problem! Submit your working code and explanation.
                    </p>
                    <button
                      onClick={openEditor}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl text-sm font-bold transition-all shadow-md"
                    >
                      <Terminal size={16} /> Submit Solution
                    </button>
                  </div>
                ) : (
                  solutions.map(sol => (
                    <div 
                      key={sol._id} 
                      className={`bg-card border rounded-2xl p-6 shadow-sm transition-all ${
                        sol.isAccepted ? 'border-[#0F6B4F] ring-1 ring-[#0F6B4F]/40 shadow-[#0F6B4F]/10' : 'border-line'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-soft border border-line flex items-center justify-center font-bold text-heading text-sm shadow-sm">
                            {sol.user?.name ? sol.user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-heading">@{sol.user?.name || 'Developer'}</div>
                            <div className="text-xs text-muted font-medium">{sol.language || 'Code'} Solution</div>
                          </div>
                        </div>

                        {isAuthor ? (
                          <button
                            onClick={() => handleToggleAcceptSolution(sol._id)}
                            disabled={acceptingSolId === sol._id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              sol.isAccepted
                                ? 'bg-[#0F6B4F] text-white border-[#0F6B4F] shadow-sm shadow-[#0F6B4F]/40 hover:bg-[#16805E]'
                                : 'bg-card hover:bg-[#0F6B4F]/10 text-muted hover:text-[#0F6B4F] border-line'
                            }`}
                            title={sol.isAccepted ? 'Click to unaccept this solution' : 'Click to accept this solution as the correct answer'}
                          >
                            {acceptingSolId === sol._id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={13} />
                            )}
                            <span>{sol.isAccepted ? 'Accepted Solution' : 'Accept Solution'}</span>
                          </button>
                        ) : (
                          sol.isAccepted && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
                              <CheckCircle2 size={14} /> Accepted Solution
                            </div>
                          )
                        )}
                      </div>

                      {sol.explanation && (
                        <p className="text-sm text-slate-800 dark:text-slate-200 mb-4 whitespace-pre-line leading-relaxed">
                          {sol.explanation}
                        </p>
                      )}

                      {/* Code block with copy button */}
                      <div className="rounded-xl overflow-hidden border border-line mb-4 shadow-sm">
                        <div className="bg-[#1e293b] px-4 py-2 text-xs font-mono text-slate-300 border-b border-line flex items-center justify-between">
                          <span>{sol.language || 'Code'}</span>
                          <button
                            onClick={() => handleCopy(sol.code, `sol-${sol._id}`)}
                            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                          >
                            {copiedKey === `sol-${sol._id}` ? (
                              <>
                                <Check size={12} className="text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="bg-[#0b0f19] p-4 text-xs md:text-sm font-mono text-[#a9b1d6] overflow-x-auto leading-relaxed select-text">
                          {sol.code}
                        </pre>
                      </div>

                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-line text-xs font-medium text-muted">
                        <button 
                          onClick={() => handleSolutionVote(sol._id, 'like')}
                          className="flex items-center gap-1.5 hover:text-[#0F6B4F] dark:hover:text-[#4FD1A5] transition-colors"
                        >
                          <ThumbsUp size={15} /> <span className="font-semibold">{sol.likes || 0}</span>
                        </button>
                        <button 
                          onClick={() => handleSolutionVote(sol._id, 'dislike')}
                          className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                        >
                          <ThumbsDown size={15} /> <span className="font-semibold">{sol.dislikes || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* TAB 3: DISCUSSION */}
            {activeTab === 'discussion' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 select-text">
                {/* Post Comment Form */}
                <div className="bg-soft/40 border border-line rounded-2xl p-5 shadow-sm">
                  <form onSubmit={handlePostComment}>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ask for clarification, suggest alternative approaches, or share your thoughts..."
                      rows="3"
                      className="w-full bg-card border border-line rounded-xl p-4 text-sm focus:outline-none focus:border-[#0F6B4F] focus:ring-1 focus:ring-[#0F6B4F] text-heading placeholder:text-muted resize-y mb-3 shadow-inner"
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        disabled={!newComment.trim() || isPostingComment}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] disabled:bg-[#0F6B4F]/50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all text-sm shadow-md"
                      >
                        {isPostingComment ? <Loader2 size={16} className="animate-spin" /> : <>Post Comment <Send size={15} /></>}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Comments List */}
                <div className="space-y-3.5">
                  {comments.length === 0 ? (
                    <div className="text-center py-12 text-muted">
                      <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No comments yet. Start the community discussion!</p>
                    </div>
                  ) : (
                    comments.map(c => (
                      <div key={c._id} className="bg-card border border-line rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0F6B4F] to-[#16805E] flex items-center justify-center font-bold text-white text-xs shadow-sm">
                              {c.user?.name ? c.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="font-bold text-heading text-sm">@{c.user?.name || 'Developer'}</span>
                          </div>
                          <span className="text-xs text-muted">
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <p className="text-sm text-slate-800 dark:text-slate-200 mb-3 pl-9 leading-relaxed whitespace-pre-line">
                          {c.text}
                        </p>
                        
                        <div className="flex items-center gap-4 pl-9 text-xs text-muted">
                          <button 
                            onClick={() => handleCommentVote(c._id, 'like')}
                            className="flex items-center gap-1 hover:text-[#0F6B4F] dark:hover:text-[#4FD1A5] transition-colors"
                          >
                            <ThumbsUp size={14} /> <span className="font-semibold">{c.likes || 0}</span>
                          </button>
                          <button 
                            onClick={() => handleCommentVote(c._id, 'dislike')}
                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                          >
                            <ThumbsDown size={14} /> <span className="font-semibold">{c.dislikes || 0}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* INLINE SOLUTION EDITOR DRAWER */}
            <AnimatePresence>
              {showEditor && (
                <motion.div 
                  ref={editorRef}
                  initial={{ opacity: 0, height: 0, y: 20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-8 border-t border-line mt-8">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-heading flex items-center gap-2">
                          <Terminal size={20} className="text-[#0F6B4F] dark:text-[#4FD1A5]" />
                          Submit Your Solution
                        </h2>
                        <p className="text-xs md:text-sm text-muted">Write your code and explain your thought process to the community.</p>
                      </div>
                      <button 
                        onClick={() => setShowEditor(false)}
                        className="p-2 rounded-xl bg-soft text-muted hover:text-heading hover:bg-line transition-colors"
                        title="Close Editor"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmitSolution} className="space-y-5">
                      <div className="w-full md:w-1/3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Language</label>
                        <select
                          value={solutionLanguage}
                          onChange={(e) => setSolutionLanguage(e.target.value)}
                          className="w-full bg-soft border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading font-medium"
                        >
                          <option>JavaScript</option>
                          <option>Node.js</option>
                          <option>Python</option>
                          <option>React</option>
                          <option>Java</option>
                          <option>C++</option>
                          <option>TypeScript</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted mb-2">
                          <Code2 size={16} className="text-[#0F6B4F]" />
                          Solution Code
                        </label>
                        <textarea
                          value={solutionCode}
                          onChange={(e) => setSolutionCode(e.target.value)}
                          placeholder="// Paste or write your complete solution code here..."
                          rows="14"
                          className="w-full bg-[#0b0f19] border border-line rounded-2xl p-4 text-xs md:text-sm font-mono text-emerald-300 focus:outline-none focus:border-[#0F6B4F] focus:ring-1 focus:ring-[#0F6B4F] resize-y"
                          required
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted mb-2">
                          <Info size={16} className="text-[#F4A62A]" />
                          Explanation & Complexity (Optional)
                        </label>
                        <textarea
                          value={solutionExplanation}
                          onChange={(e) => setSolutionExplanation(e.target.value)}
                          placeholder="Explain how your algorithm works, time/space complexity (e.g. O(n) time, O(1) space), or edge cases handled..."
                          rows="4"
                          className="w-full bg-soft/50 border border-line rounded-2xl p-4 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-y"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowEditor(false)}
                          className="px-5 py-2.5 bg-card border border-line hover:bg-soft text-muted hover:text-heading rounded-xl text-sm font-semibold transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          disabled={isSubmittingCode}
                          className="flex items-center gap-2 px-8 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(15,107,79,0.3)] hover:shadow-[0_0_30px_rgba(22,128,94,0.5)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                        >
                          {isSubmittingCode ? <Loader2 size={16} className="animate-spin" /> : <>Publish Solution <Send size={16} /></>}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Right Column: Sticky CTA & Problem Stats */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-5">
          <div className="sticky top-24 space-y-5">
            {/* Primary Action Button */}
            <button 
              onClick={openEditor}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(15,107,79,0.35)] hover:shadow-[0_0_30px_rgba(22,128,94,0.55)] hover:-translate-y-0.5 text-base"
            >
              <Terminal size={20} />
              {showEditor ? 'Editor Opened' : 'Submit Solution'}
            </button>

            {/* Problem Stats Card */}
            <div className="bg-card border border-line rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">Challenge Overview</h4>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Difficulty</span>
                  <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-full border ${diffClass}`}>
                    {problem.difficulty || 'Medium'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Status</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    problem.isSolved 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  }`}>
                    {problem.isSolved ? 'Solved' : 'Open for Solutions'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Solutions</span>
                  <span className="font-mono font-bold text-heading">
                    {solutions.length || problem.solutionsCount || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Views</span>
                  <span className="font-mono font-bold text-heading">
                    {problem.views || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Likes</span>
                  <span className="font-mono font-bold text-heading">
                    {problem.likes || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Category</span>
                  <span className="font-semibold text-heading text-xs px-2 py-0.5 rounded bg-soft border border-line">
                    {problem.category || 'General'}
                  </span>
                </div>
              </div>
            </div>

            {/* Creator Card */}
            <div className="bg-card border border-line rounded-2xl p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Created By</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F6B4F] to-[#4FD1A5] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {creatorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-heading text-sm">@{creatorName}</div>
                  <div className="text-xs text-muted">TechJourney Solver</div>
                </div>
              </div>
            </div>

            {/* Tags Card */}
            {tags.length > 0 && (
              <div className="bg-card border border-line rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs font-medium bg-soft border border-line px-2.5 py-1 rounded-lg text-heading hover:border-[#0F6B4F] transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
