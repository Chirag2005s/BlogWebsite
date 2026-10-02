import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Code2, ThumbsUp, ThumbsDown, Terminal, Bug, CheckCircle2, Send, Info, X, Loader2 } from 'lucide-react';
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
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [probRes, solRes, comRes] = await Promise.all([
          api.get(`/problems/${id}`),
          api.get(`/problems/${id}/solutions`),
          api.get(`/problems/${id}/comments`)
        ]);
        setProblem(probRes.data);
        setSolutionLanguage(probRes.data.language);
        setSolutions(solRes.data);
        setComments(comRes.data);
      } catch (error) {
        console.error('Failed to fetch problem details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  const handleSolutionVote = (id, type) => {
    setSolutions(solutions.map(sol => {
      if (sol.id === id) {
        return {
          ...sol,
          likes: type === 'like' ? sol.likes + 1 : sol.likes,
          dislikes: type === 'dislike' ? sol.dislikes + 1 : sol.dislikes
        };
      }
      return sol;
    }));
  };

  const handleCommentVote = (id, type) => {
    setComments(comments.map(c => {
      if (c.id === id) {
        return {
          ...c,
          likes: type === 'like' ? c.likes + 1 : c.likes,
          dislikes: type === 'dislike' ? c.dislikes + 1 : c.dislikes
        };
      }
      return c;
    }));
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#0F6B4F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-muted">
        <h2 className="text-2xl font-bold mb-2">Problem not found</h2>
        <Link to="/problemhub" className="text-[#0F6B4F] hover:underline">Return to Problem Hub</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to="/problemhub" className="inline-flex items-center gap-2 text-sm text-muted hover:text-[#0F6B4F] mb-6 transition-colors font-medium">
        <ChevronLeft size={16} /> Back to ProblemHub
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Problem Details */}
        <div className="flex-1 space-y-6">
          <div className="bg-card border border-line rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {problem.type === 'Debug Challenge' && (
                <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1">
                  <Bug size={12} /> Debug Challenge
                </span>
              )}
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-slate-300 font-medium px-2 py-1 rounded bg-soft border border-line">
                {problem.language}
              </span>
              <span className="text-xs text-slate-300 font-medium px-2 py-1 rounded bg-soft border border-line">
                {problem.category}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-heading mb-4">{problem.title}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted">Created by</span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-soft border border-line">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#0F6B4F] to-[#4FD1A5] flex items-center justify-center text-white text-[8px] font-bold">
                  {problem.creator?.name ? problem.creator.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-heading">@{problem.creator?.name || 'User'}</span>
              </div>
            </div>

            {/* TABS */}
            <div className="flex gap-1 border-b border-line mb-6 overflow-x-auto scrollbar-hide">
              {['problem', 'solutions', 'discussion', 'hints'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab 
                      ? 'border-[#0F6B4F] text-[#0F6B4F]' 
                      : 'border-transparent text-muted hover:text-heading hover:border-line'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <>
              {activeTab === 'problem' && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="space-y-8 text-slate-300 text-sm leading-relaxed select-none"
                    onContextMenu={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                  >
                    <div>
                      <h3 className="text-lg font-bold text-heading mb-2">Description</h3>
                      <p>{problem.description}</p>
                    </div>

                    {problem.type === 'Debug Challenge' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                          <h4 className="text-green-500 font-bold mb-2 flex items-center gap-2">
                            <CheckCircle2 size={16} /> Expected Behavior
                          </h4>
                          <p className="text-xs">{problem.expectedBehavior}</p>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                          <h4 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                            <Bug size={16} /> Current Behavior
                          </h4>
                          <p className="text-xs">{problem.currentBehavior}</p>
                        </div>
                      </div>
                    )}

                    {problem.exampleInput || problem.exampleOutput ? (
                      <div>
                        <h3 className="text-lg font-bold text-heading mb-3">Example</h3>
                        <div className="bg-[#111827] border border-line rounded-xl p-4 mb-4 font-mono text-xs shadow-inner">
                          {problem.exampleInput && <div className="mb-2"><span className="text-slate-500">Input:</span> <span className="text-green-400">{problem.exampleInput}</span></div>}
                          {problem.exampleOutput && <div><span className="text-slate-500">Output:</span> <span className="text-yellow-400">{problem.exampleOutput}</span></div>}
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <h3 className="text-lg font-bold text-heading mb-3">Starter Code</h3>
                      <div className="rounded-xl overflow-hidden border border-line shadow-sm">
                        <div className="bg-[#1e293b] px-4 py-2 text-xs font-mono text-slate-400 border-b border-line flex justify-between">
                          <span>{problem.language}</span>
                        </div>
                        <pre className="bg-[#0a0a0a] p-4 text-xs font-mono text-[#a9b1d6] overflow-x-auto">
                          {problem.starterCode || '// No starter code provided.'}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'solutions' && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="space-y-6 select-none"
                    onContextMenu={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                  >
                    {solutions.map(sol => (
                      <div key={sol._id} className={`bg-card border rounded-2xl p-6 shadow-sm ${sol.isAccepted ? 'border-[#0F6B4F] shadow-[#0F6B4F]/5' : 'border-line'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-soft flex items-center justify-center font-bold text-heading text-sm">
                              {sol.user?.name ? sol.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-heading">@{sol.user?.name || 'User'}</div>
                              <div className="text-xs text-muted">{sol.language} Solution</div>
                            </div>
                          </div>
                          {sol.isAccepted && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0F6B4F]/10 text-[#0F6B4F] rounded-full text-xs font-bold border border-[#0F6B4F]/20">
                              <CheckCircle2 size={14} /> Accepted Solution
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-300 mb-4">{sol.explanation}</p>
                        <div className="rounded-xl overflow-hidden border border-line mb-4 shadow-sm">
                          <pre className="bg-[#0a0a0a] p-4 text-xs font-mono text-[#a9b1d6] overflow-x-auto">
                            {sol.code}
                          </pre>
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-line text-xs font-medium text-muted">
                          <button 
                            onClick={() => handleSolutionVote(sol.id, 'like')}
                            className="flex items-center gap-1.5 hover:text-[#0F6B4F] transition-colors"
                          >
                            <ThumbsUp size={16} /> <span className="font-semibold">{sol.likes || 0}</span>
                          </button>
                          <button 
                            onClick={() => handleSolutionVote(sol._id, 'dislike')}
                            className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                          >
                            <ThumbsDown size={16} /> <span className="font-semibold">{sol.dislikes || 0}</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-heading transition-colors ml-4">
                            <MessageSquare size={16} /> <span className="font-semibold">{sol.comments || 0} Comments</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'discussion' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    {/* Post Comment Form */}
                    <div className="bg-soft border border-line rounded-2xl p-4 shadow-sm">
                      <form onSubmit={handlePostComment}>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Ask a question or share your thoughts..."
                          rows="3"
                          className="w-full bg-card border border-line rounded-xl p-4 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-y mb-3"
                        />
                        <div className="flex justify-end">
                          <button 
                            type="submit"
                            disabled={!newComment.trim() || isPostingComment}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] disabled:bg-[#0F6B4F]/50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all text-sm"
                          >
                            {isPostingComment ? <Loader2 size={16} className="animate-spin" /> : <>Post Comment <Send size={16} /></>}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.length === 0 ? (
                        <div className="text-center py-8 text-muted">
                          <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                          <p>No comments yet. Start the discussion!</p>
                        </div>
                      ) : (
                        comments.map(c => (
                          <div key={c._id} className="bg-card border border-line rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F6B4F] to-[#16805E] flex items-center justify-center font-bold text-white text-xs">
                                  {c.user?.name ? c.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="font-bold text-heading text-sm">@{c.user?.name || 'User'}</span>
                              </div>
                              <span className="text-xs text-muted">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-300 mb-4 pl-10">{c.text}</p>
                            
                            <div className="flex items-center gap-4 pl-10 text-xs text-muted">
                              <button 
                                onClick={() => handleCommentVote(c._id, 'like')}
                                className="flex items-center gap-1 hover:text-[#0F6B4F] transition-colors"
                              >
                                <ThumbsUp size={14} /> <span className="font-medium">{c.likes || 0}</span>
                              </button>
                              <button 
                                onClick={() => handleCommentVote(c._id, 'dislike')}
                                className="flex items-center gap-1 hover:text-red-500 transition-colors"
                              >
                                <ThumbsDown size={14} /> <span className="font-medium">{c.dislikes || 0}</span>
                              </button>
                              <button className="flex items-center gap-1 hover:text-heading transition-colors ml-2 font-medium">
                                Reply
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'hints' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center text-muted">
                    <p>Think about how strings are split. What happens if you take index 0?</p>
                  </motion.div>
                )}
              </>

            {/* INLINE SOLUTION EDITOR SECTION */}
            <AnimatePresence>
              {showEditor && (
                <motion.div 
                  ref={editorRef}
                  initial={{ opacity: 0, height: 0, y: 20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-line mt-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-heading">Submit Your Solution</h2>
                        <p className="text-sm text-muted">Provide your code and explain your thought process to the community.</p>
                      </div>
                      <button 
                        onClick={() => setShowEditor(false)}
                        className="p-2 rounded-xl bg-soft text-muted hover:text-heading hover:bg-line transition-colors"
                        title="Close Editor"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmitSolution} className="space-y-6">
                      <div className="w-full md:w-1/3">
                        <label className="block text-sm font-semibold text-heading mb-2">Language</label>
                        <select
                          value={solutionLanguage}
                          onChange={(e) => setSolutionLanguage(e.target.value)}
                          className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading appearance-none"
                        >
                          <option>JavaScript</option>
                          <option>Node.js</option>
                          <option>Python</option>
                          <option>React</option>
                          <option>Java</option>
                          <option>C++</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-heading mb-2">
                          <Code2 size={18} className="text-[#0F6B4F]" />
                          Solution Code
                        </label>
                        <textarea
                          value={solutionCode}
                          onChange={(e) => setSolutionCode(e.target.value)}
                          placeholder="// Paste or write your solution code here..."
                          rows="15"
                          className="w-full bg-[#0a0a0a] border border-line rounded-xl p-4 text-sm font-mono text-[#a9b1d6] focus:outline-none focus:border-[#0F6B4F] resize-y"
                          required
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-heading mb-2">
                          <Info size={18} className="text-[#F4A62A]" />
                          Explanation (Optional)
                        </label>
                        <textarea
                          value={solutionExplanation}
                          onChange={(e) => setSolutionExplanation(e.target.value)}
                          placeholder="Explain how your solution works, the time/space complexity, or any trade-offs..."
                          rows="4"
                          className="w-full bg-soft border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading resize-y"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button 
                          type="submit"
                          disabled={isSubmittingCode}
                          className="flex items-center gap-2 px-8 py-3 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(15,107,79,0.3)] hover:shadow-[0_0_30px_rgba(22,128,94,0.5)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmittingCode ? <Loader2 size={18} className="animate-spin" /> : <>Publish Solution <Send size={18} /></>}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Right Column: Sticky CTA */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-4">
            <button 
              onClick={openEditor}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(15,107,79,0.3)] hover:shadow-[0_0_30px_rgba(22,128,94,0.5)] hover:-translate-y-0.5"
            >
              <Terminal size={20} />
              {showEditor ? 'Editor Opened' : 'Submit Solution'}
            </button>

            <div className="bg-card border border-line rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-heading mb-4">Problem Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Solutions</span>
                  <span className="font-mono font-medium text-heading">12</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Acceptance Rate</span>
                  <span className="font-mono font-medium text-[#4FD1A5]">68%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Likes</span>
                  <span className="font-mono font-medium text-heading">45</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-line rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-heading mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                {problem.tags && problem.tags.length > 0 ? (
                  problem.tags.map(tag => (
                    <span key={tag} className="text-xs bg-soft border border-line px-2 py-1 rounded-lg text-slate-300">
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted">No tags</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
