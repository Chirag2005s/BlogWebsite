import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Compass, Code2, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { ARTICLES, ROADMAPS, PROGRAMMING_LANGUAGES } from '../data/mockData';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered from parent or global handler
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Filter articles
  const matchedArticles = ARTICLES.filter((art) => {
    if (!normalizedQuery) return true;
    return (
      art.title.toLowerCase().includes(normalizedQuery) ||
      art.excerpt.toLowerCase().includes(normalizedQuery) ||
      art.category.name.toLowerCase().includes(normalizedQuery)
    );
  });

  // Filter roadmaps
  const matchedRoadmaps = ROADMAPS.filter((rm) => {
    if (!normalizedQuery) return true;
    return (
      rm.title.toLowerCase().includes(normalizedQuery) ||
      rm.description.toLowerCase().includes(normalizedQuery) ||
      rm.nodes.some((n) => n.name.toLowerCase().includes(normalizedQuery))
    );
  });

  // Filter programming languages
  const matchedLanguages = PROGRAMMING_LANGUAGES.filter((pl) => {
    if (!normalizedQuery) return true;
    return (
      pl.name.toLowerCase().includes(normalizedQuery) ||
      pl.description.toLowerCase().includes(normalizedQuery)
    );
  });

  const totalResults = matchedArticles.length + matchedRoadmaps.length + matchedLanguages.length;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-3xl bg-white border border-line rounded-2xl shadow-2xl shadow-[#172B2A]/10 overflow-hidden z-10 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-line gap-3 bg-page">
          <Search className="text-[#0F6B4F] shrink-0" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programming, tutorials, roadmaps..."
            className="w-full bg-transparent text-heading placeholder-[#94A3B8] text-base sm:text-lg focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-muted hover:text-heading hover:bg-soft"
            >
              <X size={18} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-muted bg-white border border-line rounded">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-line bg-white text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeTab === 'all'
                ? 'pill-active shadow-sm'
                : 'pill-inactive hover:text-heading hover:bg-soft'
            }`}
          >
            All Results ({totalResults})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeTab === 'articles'
                ? 'pill-active shadow-sm'
                : 'pill-inactive hover:text-heading hover:bg-soft'
            }`}
          >
            Articles ({matchedArticles.length})
          </button>
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeTab === 'roadmaps'
                ? 'pill-active shadow-sm'
                : 'pill-inactive hover:text-heading hover:bg-soft'
            }`}
          >
            Roadmaps ({matchedRoadmaps.length})
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
              activeTab === 'languages'
                ? 'pill-active shadow-sm'
                : 'pill-inactive hover:text-heading hover:bg-soft'
            }`}
          >
            Languages ({matchedLanguages.length})
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4">
          {totalResults === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-page flex items-center justify-center mx-auto mb-3 text-muted">
                <Search size={22} />
              </div>
              <h4 className="text-base font-semibold text-heading mb-1">No matching results found</h4>
              <p className="text-sm text-muted max-w-sm mx-auto">
                We couldn't find anything matching "{query}". Try checking your spelling or searching for a broader term.
              </p>
            </div>
          ) : (
            <>
              {/* Articles Section */}
              {(activeTab === 'all' || activeTab === 'articles') && matchedArticles.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#06B6D4] px-2 flex items-center gap-1.5">
                    <BookOpen size={14} />
                    <span>Technical Articles</span>
                  </div>
                  <div className="grid gap-2">
                    {matchedArticles.map((art) => (
                      <div
                        key={art._id}
                        onClick={() => handleSelect(art.type === 'article' ? `/article/${art.slug}` : `/blog/${art.slug}`)}
                        className="p-3.5 rounded-xl bg-page/70 hover:bg-page border border-line hover:border-[#0F6B4F]/35 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-semibold text-[#06B6D4] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                            {art.category.name}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted">
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {art.readingTime} min
                            </span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-medium text-[10px] border border-blue-500/20">
                              {art.difficulty}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-sm sm:text-base font-semibold text-heading group-hover:text-[#0F6B4F] transition-colors line-clamp-1">
                          {art.title}
                        </h4>
                        <p className="text-xs text-muted line-clamp-2 mt-1">
                          {art.excerpt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmaps Section */}
              {(activeTab === 'all' || activeTab === 'roadmaps') && matchedRoadmaps.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#8B5CF6] px-2 flex items-center gap-1.5">
                    <Compass size={14} />
                    <span>Developer Roadmaps</span>
                  </div>
                  <div className="grid gap-2">
                    {matchedRoadmaps.map((rm) => (
                      <div
                        key={rm.id}
                        onClick={() => handleSelect('/roadmaps')}
                        className="p-3.5 rounded-xl bg-page/70 hover:bg-page border border-line hover:border-purple-500/40 transition-all cursor-pointer group flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm sm:text-base font-semibold text-heading group-hover:text-purple-300 transition-colors">
                              {rm.title}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                              {rm.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-muted line-clamp-1 max-w-xl">
                            {rm.description}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-muted group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Section */}
              {(activeTab === 'all' || activeTab === 'languages') && matchedLanguages.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#0F6B4F] px-2 flex items-center gap-1.5">
                    <Code2 size={14} />
                    <span>Languages & Tools</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedLanguages.map((lang) => (
                      <div
                        key={lang.slug}
                        onClick={() => handleSelect('/programming')}
                        className="p-3 rounded-xl bg-page/70 hover:bg-page border border-line hover:border-[#0F6B4F]/35 transition-all cursor-pointer group flex items-center gap-3"
                      >
                        <span className="text-2xl p-1.5 rounded-lg bg-[#0B1120] border border-line">
                          {lang.icon}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-heading group-hover:text-[#0F6B4F] transition-colors">
                            {lang.name}
                          </h4>
                          <span className="text-[11px] text-muted">
                            {lang.tutorialCount} Tutorials • {lang.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 sm:px-6 py-3 bg-[#0B1120] border-t border-line flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 bg-page border border-line rounded text-[10px]">Enter</kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#06B6D4]" />
            <span>TechJourney Quick Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
