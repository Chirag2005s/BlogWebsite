import React, { useState, useMemo } from 'react';
import { 
  Newspaper, Clock, ExternalLink, Search, Filter, Sparkles, 
  ArrowRight, Flame, ShieldAlert, Cpu, Globe, Terminal, X 
} from 'lucide-react';
import { TECH_NEWS } from '../data/mockData';

const NEWS_CATEGORIES = [
  'All',
  'AI',
  'Cloud Computing',
  'Web Development',
  'Cybersecurity',
  'Developer Tools',
  'Open Source',
  'Hardware'
];

export default function TechNews() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);

  const filteredNews = useMemo(() => {
    return TECH_NEWS.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'All' || 
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const breakingNews = TECH_NEWS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* ═══ HEADER ═══ */}
      <div className="relative py-8 sm:py-12 border-b border-[#334155]/60 overflow-hidden">
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-mono text-[#EF4444]">
            <Flame size={14} />
            <span>Real-Time Developer Dispatch</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F8FAFC] tracking-tight">
            What's Happening in <span className="tech-gradient-text">Tech?</span>
          </h1>

          <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed">
            Curated, high-signal technology intelligence spanning autonomous AI agents, cloud architectures, browser runtimes, security disclosures, and silicon fabrication.
          </p>
        </div>
      </div>

      {/* ═══ BREAKING NEWS HERO ═══ */}
      {breakingNews && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#111827] to-purple-950/40 border border-[#334155] shadow-2xl shadow-black/60 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Newspaper size={180} />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Featured Story
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">{breakingNews.date}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {breakingNews.title}
            </h2>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              {breakingNews.description}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => setSelectedStory(breakingNews)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Read Full Coverage</span>
                <ArrowRight size={14} />
              </button>
              <span className="text-xs text-[#64748B] font-mono">{breakingNews.source} • {breakingNews.readTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONTROLS & CATEGORIES ═══ */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news and breakthroughs..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#111827] border border-[#334155] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#06B6D4]"
            />
          </div>

          <div className="text-xs text-[#94A3B8] font-mono">
            Showing {filteredNews.length} verified news bulletins
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow-md shadow-blue-500/20'
                  : 'bg-[#111827] text-[#94A3B8] border-[#334155] hover:text-[#F8FAFC] hover:border-blue-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ HORIZONTAL NEWS CARDS GRID ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-blue-500/40 transition-all duration-300 flex flex-col sm:flex-row gap-5 sm:items-center group shadow-xl shadow-black/30"
          >
            {/* Image */}
            <div className="w-full sm:w-44 h-32 shrink-0 rounded-xl overflow-hidden bg-[#0B1120] relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="space-y-2 flex-grow">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${item.badgeColor}`}>
                  {item.category}
                </span>
                <span className="text-[11px] text-[#64748B] font-mono">
                  {item.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#64748B] font-mono">{item.source}</span>
                <button
                  onClick={() => setSelectedStory(item)}
                  className="px-3 py-1 rounded-lg bg-[#111827] hover:bg-blue-600/20 text-[#06B6D4] hover:text-white border border-[#334155] font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Bulletin</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ READ NEWS MODAL ═══ */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#111827] border border-[#334155] p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-[#1E293B] text-[#94A3B8] hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${selectedStory.badgeColor}`}>
                {selectedStory.category}
              </span>
              <span className="text-xs text-[#64748B] font-mono">{selectedStory.date}</span>
            </div>

            <h3 className="text-2xl font-bold text-[#F8FAFC]">
              {selectedStory.title}
            </h3>

            <div className="rounded-xl overflow-hidden aspect-video border border-[#334155]">
              <img src={selectedStory.image} alt={selectedStory.title} className="w-full h-full object-cover" />
            </div>

            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {selectedStory.description}
            </p>

            <div className="p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-[#94A3B8] flex items-center justify-between">
              <div>
                <span>Source: </span>
                <strong className="text-white">{selectedStory.source}</strong>
              </div>
              <span>Estimated: {selectedStory.readTime}</span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedStory(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
              >
                Close Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
