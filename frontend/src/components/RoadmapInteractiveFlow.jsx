import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle2, Circle, Sparkles, ChevronRight, 
  ExternalLink, Layers, Terminal, BookOpen 
} from 'lucide-react';
import { ROADMAPS } from '../data/mockData';

export default function RoadmapInteractiveFlow() {
  const [selectedRoadmapIndex, setSelectedRoadmapIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);

  const activeRoadmap = ROADMAPS[selectedRoadmapIndex] || ROADMAPS[0];
  const currentNode = selectedNode || activeRoadmap.nodes[2]; // default active step

  return (
    <div className="space-y-6">
      {/* Roadmap Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ROADMAPS.map((roadmap, index) => (
          <button
            key={roadmap.id}
            onClick={() => {
              setSelectedRoadmapIndex(index);
              setSelectedNode(roadmap.nodes[2] || roadmap.nodes[0]);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border ${
              selectedRoadmapIndex === index
                ? 'bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white border-transparent shadow-lg shadow-[#0F6B4F]/15'
                : 'bg-[#1E293B] text-muted border-line hover:text-[#F8FAFC] hover:border-[#0F6B4F]/35'
            }`}
          >
            {roadmap.title}
          </button>
        ))}
      </div>

      {/* Main Interactive Flow Box */}
      <div className="rounded-2xl bg-[#111827] border border-line p-6 sm:p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
        {/* Background glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-cyan-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#06B6D4] font-semibold">
                Interactive Track
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${activeRoadmap.badgeColor}`}>
                {activeRoadmap.difficulty}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#F8FAFC]">
              {activeRoadmap.title} Journey
            </h3>
            <p className="text-sm text-muted max-w-xl mt-1">
              {activeRoadmap.description}
            </p>
          </div>

          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-sm font-semibold transition-all self-start sm:self-auto shrink-0 group"
          >
            <span>Full Roadmaps Hub</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Visual Connected Nodes Flow (Desktop / Tablet horizontal, Mobile wrapped) */}
        <div className="relative py-4">
          <div className="flex items-center justify-between overflow-x-auto pb-6 gap-2 sm:gap-3">
            {activeRoadmap.nodes.map((node, i) => {
              const isSelected = currentNode?.id === node.id;
              const isLast = i === activeRoadmap.nodes.length - 1;

              return (
                <React.Fragment key={node.id}>
                  {/* Node Button Card */}
                  <button
                    onClick={() => setSelectedNode(node)}
                    className={`relative flex flex-col items-center min-w-[110px] sm:min-w-[130px] p-3 sm:p-4 rounded-xl transition-all duration-300 text-center border group ${
                      isSelected
                        ? 'bg-[#1E293B] border-[#06B6D4] shadow-lg shadow-[#0F6B4F]/15 scale-105 z-10'
                        : node.status === 'completed'
                        ? 'bg-[#1E293B]/60 border-blue-500/30 hover:border-blue-400'
                        : 'bg-[#1E293B]/40 border-line hover:border-purple-500/40'
                    }`}
                  >
                    {/* Status indicator pin */}
                    <div className="mb-2">
                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-cyan-500/40 animate-pulse">
                          {i + 1}
                        </div>
                      ) : node.status === 'completed' ? (
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 text-xs font-semibold">
                          <CheckCircle2 size={16} className="text-blue-400" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#0B1120] border border-line flex items-center justify-center text-muted text-xs font-mono">
                          {i + 1}
                        </div>
                      )}
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-[#F8FAFC] group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {node.name}
                    </span>

                    <span className="text-[10px] font-mono text-muted mt-1">
                      {node.category}
                    </span>
                  </button>

                  {/* Connected Glowing Arrow Line */}
                  {!isLast && (
                    <div className="flex items-center justify-center px-1 shrink-0">
                      <div className="w-4 sm:w-6 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 opacity-60" />
                      <ChevronRight size={14} className="text-[#06B6D4] -ml-1.5 opacity-80" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Drawer / Card */}
        {currentNode && (
          <div className="mt-6 p-5 sm:p-6 rounded-xl bg-[#1E293B] border border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#06B6D4] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 font-semibold">
                  Stage {currentNode.id} of {activeRoadmap.nodes.length}
                </span>
                <span className="text-xs text-muted">
                  Domain: <strong className="text-[#F8FAFC]">{currentNode.category}</strong>
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#F8FAFC]">
                {currentNode.name}
              </h4>
              <p className="text-sm text-muted leading-relaxed max-w-2xl">
                {currentNode.desc}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
              <Link
                to="/roadmaps"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs sm:text-sm hover:opacity-95 shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Explore Guide</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
