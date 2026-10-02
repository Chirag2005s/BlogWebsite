import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Target, Trophy, Flame, Search, ChevronRight } from 'lucide-react';

export default function MyProblemHub({ activeTab = 'problems' }) {
  const [tab, setTab] = useState(activeTab);

  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : { name: 'Developer', email: 'dev@techjourney.com' };
    } catch {
      return { name: 'Developer', email: 'dev@techjourney.com' };
    }
  })();

  const stats = [
    { label: 'Problems Posted', value: '4', icon: <Code2 size={18} className="text-blue-400" />, bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Problems Solved', value: '27', icon: <Target size={18} className="text-green-400" />, bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: 'Accepted Solutions', value: '12', icon: <Trophy size={18} className="text-yellow-400" />, bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { label: 'Current Streak', value: '5 Days', icon: <Flame size={18} className="text-orange-400" />, bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-card border border-line rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0F6B4F] to-[#4FD1A5] flex items-center justify-center text-4xl font-bold text-white shadow-lg shrink-0">
          {userInfo.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-heading mb-1">{userInfo.name}</h1>
          <p className="text-slate-400 mb-4">TechJourney Developer</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-soft border border-line rounded-lg text-xs font-medium text-slate-300">
              Reputation: <span className="text-[#0F6B4F] font-bold">1,250</span>
            </span>
            <span className="px-3 py-1 bg-soft border border-line rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1">
              Top Skills: Node.js, React
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${stat.border} ${stat.bg} flex flex-col items-center justify-center text-center`}>
            <div className="mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-heading mb-1">{stat.value}</div>
            <div className="text-xs text-muted uppercase tracking-wider font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-card border border-line rounded-3xl overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-line overflow-x-auto scrollbar-hide">
          {['problems', 'solutions', 'saved', 'activity'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 px-6 py-4 text-sm font-semibold capitalize whitespace-nowrap transition-all border-b-2 ${
                tab === t 
                  ? 'border-[#0F6B4F] text-[#0F6B4F] bg-[#0F6B4F]/5' 
                  : 'border-transparent text-muted hover:text-heading hover:bg-soft/50'
              }`}
            >
              My {t}
            </button>
          ))}
        </div>

        {/* Tab Content Placeholder */}
        <div className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-soft rounded-full flex items-center justify-center mx-auto mb-4 text-muted">
            <Search size={24} />
          </div>
          <h3 className="text-xl font-bold text-heading mb-2 capitalize">No {tab} found</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            You haven't added any {tab} yet. Start exploring ProblemHub to build your profile.
          </p>
          <Link 
            to="/problemhub"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F6B4F] hover:bg-[#16805E] text-white rounded-xl font-semibold transition-all"
          >
            Explore ProblemHub <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
