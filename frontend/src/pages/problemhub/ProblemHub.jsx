import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Dices, MessageSquare, ThumbsUp, Code2, Bug, Zap, CheckCircle2, User, ChevronRight } from 'lucide-react';

import api from '../../services/api';

const CATEGORIES = ['All', 'DSA', 'JavaScript', 'Node.js', 'Python', 'React', 'MongoDB', 'SQL', 'Backend', 'Debugging', 'Algorithms'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function ProblemHub() {
  const navigate = useNavigate();
  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const [problems, setProblems] = useState([]);
  const [myHubStats, setMyHubStats] = useState(null);
  const [showOnlyMyProblems, setShowOnlyMyProblems] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await api.get('/problems');
        setProblems(Array.isArray(data) ? data : (data?.problems || []));
      } catch (error) {
        console.error('Failed to fetch problems', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();

    if (userInfo) {
      api.get('/problems/my-hub')
        .then(({ data }) => {
          if (data?.stats) {
            setMyHubStats(data.stats);
          }
        })
        .catch(err => {
          console.warn('Could not fetch user hub stats for ProblemHub header:', err);
        });
    }
  }, []);

  const safeProblems = Array.isArray(problems) ? problems : [];

  const handleRandomProblem = () => {
    if (safeProblems.length === 0) return;
    const randomId = safeProblems[Math.floor(Math.random() * safeProblems.length)]._id;
    navigate(`/problemhub/problem/${randomId}`);
  };

  const myProblemsCount = safeProblems.filter(p => String(p?.creator?._id || p?.creator) === String(userInfo?._id)).length;
  const realStats = myHubStats || {
    problemsPosted: myProblemsCount,
    problemsSolved: 0,
    acceptedSolutions: 0,
  };

  const filteredProblems = safeProblems.filter(p => {
    if (!p) return false;
    const title = (p.title || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const search = searchTerm.trim().toLowerCase();
    const matchSearch = !search || title.includes(search) || desc.includes(search);
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory || (selectedCategory === 'Debugging' && p.type === 'Debug Challenge');
    const matchDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchMyProblems = !showOnlyMyProblems || (userInfo && String(p.creator?._id || p.creator) === String(userInfo._id));
    return matchSearch && matchCategory && matchDifficulty && matchMyProblems;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c2019] via-[#081712] to-[#040e0b] border border-[#16805E]/30 p-8 md:p-12 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-15 pointer-events-none">
          <Code2 size={240} className="text-[#0F6B4F] -rotate-12" />
        </div>

        <div className="relative z-10 max-w-3xl">
          {userInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F6B4F]/25 border border-[#0F6B4F]/40 text-[#4FD1A5] text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#4FD1A5] animate-pulse"></span>
              <span>Logged in as @{userInfo.name || 'Developer'}</span>
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-sm"
          >
            Problem<span className="text-[#4FD1A5]">Hub</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-200 mb-4 font-semibold"
          >
            Real Problems. Real Developers. Real Solutions.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 mb-8 max-w-2xl text-base md:text-lg leading-relaxed"
          >
            Share programming problems, challenge other developers, and sharpen your coding skills with community solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/problemhub/create"
              className="flex items-center gap-2 px-6 py-3.5 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(15,107,79,0.4)] hover:shadow-[0_0_30px_rgba(22,128,94,0.6)] hover:-translate-y-0.5 text-sm"
            >
              <Plus size={18} />
              Post a Problem
            </Link>
            <button
              onClick={handleRandomProblem}
              className="flex items-center gap-2 px-5 py-3.5 bg-card hover:bg-soft border border-line text-heading rounded-xl font-semibold transition-all shadow-md hover:-translate-y-0.5 text-sm"
            >
              <Dices size={18} className="text-[#F4A62A]" />
              Random Problem
            </button>
            <Link
              to="/problemhub/leaderboard"
              className="flex items-center gap-2 px-5 py-3.5 bg-card hover:bg-soft border border-line text-heading rounded-xl font-semibold transition-all shadow-md hover:-translate-y-0.5 text-sm"
            >
              <Zap size={18} className="text-yellow-500" />
              Leaderboard
            </Link>
            {/* <Link
              to="/problemhub/my-problems"
              className="flex items-center gap-2 px-5 py-3.5 bg-card hover:bg-soft border border-line text-heading rounded-xl font-semibold transition-all shadow-md hover:-translate-y-0.5 text-sm"
            >
              <User size={18} className="text-[#4FD1A5]" />
              My Hub
            </Link> */}
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search problems by title, keywords or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-line rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] focus:ring-1 focus:ring-[#0F6B4F] text-heading placeholder:text-muted transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-heading px-1.5 py-0.5 rounded bg-soft"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex w-full md:w-auto gap-3 items-center overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {userInfo && (
              <button
                onClick={() => setShowOnlyMyProblems(!showOnlyMyProblems)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border flex items-center gap-2 shrink-0 ${showOnlyMyProblems
                  ? 'bg-[#0F6B4F] text-white border-[#0F6B4F] shadow-sm shadow-[#0F6B4F]/30'
                  : 'bg-card border-line text-muted hover:text-heading hover:border-slate-500'
                  }`}
                title="Filter to show only problems you posted"
              >
                <User size={14} className={showOnlyMyProblems ? 'text-white' : 'text-[#0F6B4F] dark:text-[#4FD1A5]'} />
                <span>My Problems</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${showOnlyMyProblems ? 'bg-black/25 text-white' : 'bg-soft text-heading'
                  }`}>
                  {realStats.problemsPosted}
                </span>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-card border border-line rounded-xl p-1 shrink-0 shadow-sm">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-colors whitespace-nowrap ${selectedDifficulty === diff
                    ? 'bg-soft text-heading shadow-sm'
                    : 'text-muted hover:text-heading'
                    }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${selectedCategory === cat
                ? 'bg-[#0F6B4F]/15 border-[#0F6B4F] text-[#0F6B4F] dark:text-[#4FD1A5] shadow-sm'
                : 'bg-card border-line text-muted hover:border-slate-500 hover:text-heading'
                }`}
            >
              {cat === 'Debugging' && <Bug size={13} className="inline mr-1 -mt-0.5" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-3">
          <div className="w-10 h-10 border-4 border-[#0F6B4F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-muted">Loading problems...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, idx) => {
              const diffClass =
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                  : problem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25';

              const tags = Array.isArray(problem.tags) ? problem.tags : [];
              const isCreator = Boolean(userInfo && String(problem.creator?._id || problem.creator) === String(userInfo._id));
              const cardCreatorName = problem.creator?.name || (isCreator ? userInfo.name : 'Developer');

              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  key={problem._id}
                  className="group flex flex-col justify-between bg-card border border-line rounded-2xl p-6 hover:border-[#0F6B4F] dark:hover:border-[#2BAF85] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg dark:hover:shadow-[#0F6B4F]/10 relative overflow-hidden"
                  onClick={() => navigate(`/problemhub/problem/${problem._id}`)}
                >
                  <div>
                    {/* Top Row Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${diffClass}`}>
                          {problem.difficulty || 'Medium'}
                        </span>
                        {problem.language && (
                          <span className="text-xs text-heading font-semibold px-2.5 py-0.5 rounded-lg bg-soft border border-line">
                            {problem.language}
                          </span>
                        )}
                        {problem.category && (
                          <span className="text-xs text-muted font-medium px-2 py-0.5 rounded-lg bg-soft border border-line">
                            {problem.category}
                          </span>
                        )}
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-1.5">
                        {problem.type === 'Debug Challenge' && (
                          <span className="bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 uppercase tracking-wider">
                            <Bug size={12} /> Debug
                          </span>
                        )}
                        {problem.isSolved && (
                          <span className="bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                            <CheckCircle2 size={12} /> Solved
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-heading mb-2 group-hover:text-[#0F6B4F] dark:group-hover:text-[#4FD1A5] transition-colors line-clamp-2 leading-snug">
                      {problem.title || 'Untitled Problem'}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                      {problem.description || 'No description provided.'}
                    </p>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tags.map(tag => (
                          <span key={tag} className="text-[11px] font-medium text-muted bg-soft border border-line rounded-md px-2 py-0.5">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Meta & Action */}
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-line">
                    <div className="flex items-center gap-3.5 text-xs text-muted flex-wrap">
                      <div className="flex items-center gap-1.5" title={`Created by @${cardCreatorName}`}>
                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0F6B4F] to-[#4FD1A5] flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                          {cardCreatorName.charAt(0).toUpperCase()}
                        </span>
                        <span className="font-semibold text-heading max-w-[100px] truncate">
                          @{cardCreatorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1" title="Solutions">
                        <Code2 size={14} className="text-[#0F6B4F] dark:text-[#4FD1A5]" />
                        <span className="font-semibold text-heading">{problem.solutionsCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Comments">
                        <MessageSquare size={14} className="text-[#F4A62A]" />
                        <span className="font-semibold text-heading">{problem.commentsCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Likes">
                        <ThumbsUp size={14} className="text-blue-500" />
                        <span className="font-semibold text-heading">{problem.likes || 0}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/problemhub/problem/${problem._id}`);
                      }}
                      className="px-3.5 py-1.5 bg-[#0F6B4F]/10 hover:bg-[#0F6B4F] text-[#0F6B4F] hover:text-white border border-[#0F6B4F]/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm shrink-0"
                    >
                      Solve <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-1 lg:col-span-2 text-center py-20 bg-card border border-line rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-soft rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">No problems found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
                We couldn't find any challenges matching your current filters. Try changing your search keywords or post a new problem!
              </p>
              <Link
                to="/problemhub/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-bold transition-all shadow-md text-sm"
              >
                <Plus size={18} />
                Post a Problem
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
