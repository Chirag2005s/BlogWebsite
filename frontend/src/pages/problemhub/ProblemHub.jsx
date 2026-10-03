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
        setProblems(data);
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

  const handleRandomProblem = () => {
    if (problems.length === 0) return;
    const randomId = problems[Math.floor(Math.random() * problems.length)]._id;
    navigate(`/problemhub/problem/${randomId}`);
  };

  const myProblemsCount = problems.filter(p => String(p.creator?._id || p.creator) === String(userInfo?._id)).length;
  const realStats = myHubStats || {
    problemsPosted: myProblemsCount,
    problemsSolved: 0,
    acceptedSolutions: 0,
  };

  const filteredProblems = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory || (selectedCategory === 'Debugging' && p.type === 'Debug Challenge');
    const matchDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchMyProblems = !showOnlyMyProblems || (userInfo && String(p.creator?._id || p.creator) === String(userInfo._id));
    return matchSearch && matchCategory && matchDifficulty && matchMyProblems;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1914] to-[#040e0b] border border-[#16805E]/20 p-8 md:p-12 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Code2 size={240} className="text-[#0F6B4F] -rotate-12" />
        </div>

        <div className="relative z-10 max-w-3xl">
          {userInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F6B4F]/25 border border-[#0F6B4F]/40 text-[#4FD1A5] text-xs font-semibold mb-4 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#4FD1A5] animate-pulse"></span>
              <span>Logged in as @{userInfo.name || 'Developer'}</span>
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            Problem<span className="text-[#4FD1A5]">Hub</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-300 mb-6 font-medium"
          >
            Real Problems. Real Developers. Real Solutions.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mb-8 max-w-2xl text-lg"
          >
            Share programming problems, challenge other developers, and learn from community solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/problemhub/create"
              className="flex items-center gap-2 px-6 py-3 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(15,107,79,0.4)] hover:shadow-[0_0_30px_rgba(22,128,94,0.6)] hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Post a Problem
            </Link>
            <button
              onClick={handleRandomProblem}
              className="flex items-center gap-2 px-6 py-3 bg-card hover:bg-soft border border-line text-heading rounded-xl font-semibold transition-all shadow-lg hover:-translate-y-0.5"
            >
              <Dices size={20} className="text-[#F4A62A]" />
              Give Me a Random Problem
            </button>
            <Link
              to="/problemhub/leaderboard"
              className="flex items-center gap-2 px-6 py-3 bg-card hover:bg-soft border border-line text-heading rounded-xl font-semibold transition-all shadow-lg hover:-translate-y-0.5"
            >
              <Zap size={20} className="text-yellow-500" />
              Leaderboard
            </Link>
            <Link
              to="/problemhub/my-problems"
              className="flex items-center gap-2 px-6 py-3 bg-card hover:bg-soft border border-line text-heading rounded-xl font-semibold transition-all shadow-lg hover:-translate-y-0.5"
            >
              <User size={20} className="text-[#4FD1A5]" />
              My Hub
            </Link>
          </motion.div>

          {/* My Hub Real Activity Strip */}
          {/* {userInfo && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-8 pt-6 border-t border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User size={15} className="text-[#4FD1A5]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">My Hub Activity</span>
                </div>
                <Link
                  to="/problemhub/my-problems"
                  className="text-xs font-semibold text-[#4FD1A5] hover:text-white flex items-center gap-1 transition-colors group"
                >
                  <span>Go to My Hub</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Link
                  to="/problemhub/my-problems"
                  className="bg-black/35 hover:bg-black/55 backdrop-blur-md border border-[#16805E]/30 hover:border-[#4FD1A5]/50 rounded-2xl p-3.5 text-center transition-all group"
                  title="View your posted problems"
                >
                  <div className="text-xl md:text-2xl font-black text-white font-mono group-hover:text-[#4FD1A5] transition-colors">
                    {realStats.problemsPosted}
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold tracking-wide">Problems Posted</div>
                </Link>

                <Link
                  to="/problemhub/my-solutions"
                  className="bg-black/35 hover:bg-black/55 backdrop-blur-md border border-[#16805E]/30 hover:border-[#4FD1A5]/50 rounded-2xl p-3.5 text-center transition-all group"
                  title="View problems you've solved"
                >
                  <div className="text-xl md:text-2xl font-black text-emerald-400 font-mono group-hover:scale-105 transition-transform">
                    {realStats.problemsSolved}
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold tracking-wide">Problems Solved</div>
                </Link>

                <Link
                  to="/problemhub/my-solutions"
                  className="bg-black/35 hover:bg-black/55 backdrop-blur-md border border-[#16805E]/30 hover:border-[#4FD1A5]/50 rounded-2xl p-3.5 text-center transition-all group"
                  title="View your accepted solutions"
                >
                  <div className="text-xl md:text-2xl font-black text-yellow-400 font-mono group-hover:scale-105 transition-transform">
                    {realStats.acceptedSolutions}
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold tracking-wide">Accepted Solutions</div>
                </Link>
              </div>
            </motion.div>
          )} */}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-10 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search programming problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-line rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#0F6B4F] text-heading transition-colors"
            />
          </div>

          <div className="flex w-full md:w-auto gap-3 items-center overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {userInfo && (
              <button
                onClick={() => setShowOnlyMyProblems(!showOnlyMyProblems)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all border flex items-center gap-1.5 shrink-0 ${showOnlyMyProblems
                  ? 'bg-[#0F6B4F] text-white border-[#0F6B4F] shadow-sm shadow-[#0F6B4F]/30'
                  : 'bg-card border-line text-muted hover:text-heading hover:border-slate-500'
                  }`}
                title="Filter to show only problems you posted"
              >
                <User size={13} className={showOnlyMyProblems ? 'text-white' : 'text-[#4FD1A5]'} />
                <span>My Problems</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-mono font-bold ${showOnlyMyProblems ? 'bg-black/25 text-white' : 'bg-soft text-heading'
                  }`}>
                  {realStats.problemsPosted}
                </span>
              </button>
            )}

            <div className="flex items-center gap-2 bg-card border border-line rounded-xl p-1 shrink-0">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedDifficulty === diff
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

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${selectedCategory === cat
                ? 'bg-[#0F6B4F]/10 border-[#0F6B4F] text-[#0F6B4F]'
                : 'bg-card border-line text-muted hover:border-slate-500 hover:text-heading'
                }`}
            >
              {cat === 'Debugging' && <Bug size={12} className="inline mr-1.5 -mt-0.5" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-[#0F6B4F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={problem._id}
                className="group flex flex-col bg-card border border-line rounded-2xl p-6 hover:shadow-xl hover:shadow-[#0F6B4F]/5 hover:border-[#0F6B4F]/30 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => navigate(`/problemhub/problem/${problem._id}`)}
              >
                {/* Type Badge */}
                {problem.type === 'Debug Challenge' && (
                  <div className="absolute top-0 right-0 bg-red-500/10 border-b border-l border-red-500/20 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-wider">
                    <Bug size={12} /> Debug Challenge
                  </div>
                )}

                {problem.isSolved && (
                  <div className="absolute top-0 right-0 bg-green-500/10 border-b border-l border-green-500/20 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-green-500 flex items-center gap-1 uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Solved
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-muted font-medium px-2 py-0.5 rounded-full bg-soft">
                      {problem.language}
                    </span>
                    <span className="text-xs text-muted font-medium px-2 py-0.5 rounded-full bg-soft">
                      {problem.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-heading mb-2 group-hover:text-[#0F6B4F] transition-colors line-clamp-1">
                    {problem.title}
                  </h3>

                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {problem.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {problem.tags.map(tag => (
                      <span key={tag} className="text-[11px] text-muted border border-line rounded px-1.5 py-0.5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-line/60">
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <div className="flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0F6B4F] to-[#4FD1A5] flex items-center justify-center text-white font-bold text-[10px]">
                        {problem.creator?.name ? problem.creator.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                      <span className="font-medium hover:text-heading">@{problem.creator?.name || 'User'}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Solutions">
                      <Code2 size={14} /> {problem.solutionsCount}
                    </div>
                    <div className="flex items-center gap-1.5" title="Comments">
                      <MessageSquare size={14} /> {problem.commentsCount}
                    </div>
                    <div className="flex items-center gap-1.5" title="Likes">
                      <ThumbsUp size={14} /> {problem.likes}
                    </div>
                  </div>

                  <button className="px-4 py-1.5 bg-[#0F6B4F]/10 hover:bg-[#0F6B4F]/20 text-[#0F6B4F] rounded-lg text-sm font-semibold transition-colors opacity-0 group-hover:opacity-100">
                    Solve
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-1 lg:col-span-2 text-center py-20 bg-card border border-line rounded-3xl">
              <div className="w-20 h-20 bg-soft rounded-full flex items-center justify-center mx-auto mb-4 text-muted">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">No problems found</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                We couldn't find any challenges matching your filters. Be the first developer to challenge the community!
              </p>
              <Link
                to="/problemhub/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-semibold transition-all"
              >
                <Plus size={20} />
                Post a Problem
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
