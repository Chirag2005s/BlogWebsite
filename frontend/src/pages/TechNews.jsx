import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative py-8 sm:py-12 border-b border-line overflow-hidden"
      >
        <div className="relative max-w-3xl space-y-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full surface-card border border-line text-xs font-mono text-[#EF4444]"
          >
            <Flame size={14} className="animate-pulse" />
            <span>Real-Time Developer Dispatch</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-heading tracking-tight"
          >
            What's Happening in <span className="tech-gradient-text">Tech?</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-muted text-base sm:text-lg leading-relaxed"
          >
            Curated, high-signal technology intelligence spanning autonomous AI agents, cloud architectures, browser runtimes, security disclosures, and silicon fabrication.
          </motion.p>
        </div>
      </motion.div>

      {/* ═══ BREAKING NEWS HERO ═══ */}
      {breakingNews && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#111827] to-purple-950/40 border border-line shadow-2xl shadow-black/60 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
            <Newspaper size={180} />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Featured Story
              </span>
              <span className="text-xs text-muted font-mono">{breakingNews.date}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {breakingNews.title}
            </h2>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              {breakingNews.description}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedStory(breakingNews)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F6B4F] hover:bg-[#0C5A42] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Read Full Coverage</span>
                <ArrowRight size={14} />
              </motion.button>
              <span className="text-xs text-muted font-mono">{breakingNews.source} • {breakingNews.readTime}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ CONTROLS & CATEGORIES ═══ */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news and breakthroughs..."
              className="w-full pl-10 pr-4 py-3 input-field text-heading placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#0F6B4F]"
            />
          </div>

          <div className="text-xs text-muted font-mono">
            Showing {filteredNews.length} verified news bulletins
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {NEWS_CATEGORIES.map((cat) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white border-transparent shadow-md shadow-blue-500/20'
                  : 'bg-[#111827] text-muted border-line hover:text-heading hover:border-[#0F6B4F]/35'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ═══ HORIZONTAL NEWS CARDS GRID ═══ */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item, idx) => (
          <motion.div
            layout
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
            whileHover={{ y: -4, borderColor: 'rgba(15, 107, 79, 0.45)' }}
            key={item.id}
            className="p-5 sm:p-6 rounded-2xl surface-card border border-line transition-all duration-300 flex flex-col sm:flex-row gap-5 sm:items-center group shadow-xl shadow-black/30"
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
                <span className="text-[11px] text-muted font-mono">
                  {item.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-heading group-hover:text-[#0F6B4F] transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted font-mono">{item.source}</span>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStory(item)}
                  className="px-3 py-1 rounded-lg bg-[#111827] hover:bg-blue-600/20 text-[#06B6D4] hover:text-white border border-line font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Bulletin</span>
                  <ArrowRight size={12} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ READ NEWS MODAL ═══ */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl rounded-2xl bg-page border border-line p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-[#1E293B] text-muted hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${selectedStory.badgeColor}`}>
                  {selectedStory.category}
                </span>
                <span className="text-xs text-muted font-mono">{selectedStory.date}</span>
              </div>

              <h3 className="text-2xl font-bold text-heading">
                {selectedStory.title}
              </h3>

              <div className="rounded-xl overflow-hidden aspect-video border border-line">
                <img src={selectedStory.image} alt={selectedStory.title} className="w-full h-full object-cover" />
              </div>

              <p className="text-sm text-muted leading-relaxed">
                {selectedStory.description}
              </p>

              <div className="p-4 rounded-xl surface-card border border-line text-xs text-muted flex items-center justify-between">
                <div>
                  <span>Source: </span>
                  <strong className="text-white">{selectedStory.source}</strong>
                </div>
                <span>Estimated: {selectedStory.readTime}</span>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedStory(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#0F6B4F] hover:bg-[#0C5A42] text-white font-semibold text-xs cursor-pointer"
                >
                  Close Dispatch
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
