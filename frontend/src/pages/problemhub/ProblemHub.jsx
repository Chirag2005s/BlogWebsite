import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Dices, MessageSquare, ThumbsUp, Code2, Bug, Zap, CheckCircle2 } from 'lucide-react';

import api from '../../services/api';

const CATEGORIES = ['All', 'DSA', 'JavaScript', 'Node.js', 'Python', 'React', 'MongoDB', 'SQL', 'Backend', 'Debugging', 'Algorithms'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function ProblemHub() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
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
  }, []);

  const handleRandomProblem = () => {
    if (problems.length === 0) return;
    const randomId = problems[Math.floor(Math.random() * problems.length)]._id;
    navigate(`/problemhub/problem/${randomId}`);
  };

  const filteredProblems = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory || (selectedCategory === 'Debugging' && p.type === 'Debug Challenge');
    const matchDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchSearch && matchCategory && matchDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1914] to-[#040e0b] border border-[#16805E]/20 p-8 md:p-12 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Code2 size={240} className="text-[#0F6B4F] -rotate-12" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
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
          </motion.div>
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
          
          <div className="flex w-full md:w-auto gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex items-center gap-2 bg-card border border-line rounded-xl p-1 shrink-0">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedDifficulty === diff 
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
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                selectedCategory === cat
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
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
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
