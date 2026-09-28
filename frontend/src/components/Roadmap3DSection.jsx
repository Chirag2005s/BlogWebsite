import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ArrowRight, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Roadmap3DSection() {
  const [activeNode, setActiveNode] = useState(null);

  // Roadmap Nodes layout structure matching NeetCode flow
  const nodes = [
    // Level 1
    { id: 'arrays', label: 'Arrays & Hashing', level: 1, x: 75, y: 30, color: '#3B82F6', topics: '12 Problems • Easy/Med' },
    
    // Level 2
    { id: 'two-pointers', label: 'Two Pointers', level: 2, x: 50, y: 120, color: '#6366F1', topics: '8 Problems • Easy/Med' },
    { id: 'stack', label: 'Stack', level: 2, x: 80, y: 120, color: '#8B5CF6', topics: '7 Problems • Medium' },
    
    // Level 3
    { id: 'linked-list', label: 'Linked List', level: 3, x: 25, y: 210, color: '#3B82F6', topics: '11 Problems • Med/Hard' },
    { id: 'sliding-window', label: 'Sliding Window', level: 3, x: 55, y: 210, color: '#06B6D4', topics: '6 Problems • Medium' },
    { id: 'binary-search', label: 'Binary Search', level: 3, x: 85, y: 210, color: '#6366F1', topics: '7 Problems • Easy/Med' },
    
    // Level 4 (Converging)
    { id: 'trees', label: 'Trees & BST', level: 4, x: 55, y: 300, color: '#8B5CF6', topics: '15 Problems • Med/Hard' },
    
    // Level 5 (Branching)
    { id: 'tries', label: 'Tries', level: 5, x: 25, y: 390, color: '#3B82F6', topics: '3 Problems • Medium' },
    { id: 'heap', label: 'Heap / Priority Queue', level: 5, x: 55, y: 390, color: '#06B6D4', topics: '7 Problems • Hard' },
    { id: 'backtracking', label: 'Backtracking', level: 5, x: 85, y: 390, color: '#8B5CF6', topics: '9 Problems • Hard' },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#0D0E15] text-[#F8FAFC] border-y border-[#1E202E] overflow-hidden">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">

          {/* ═══════════════════════════════════════════
              LEFT COLUMN: INTERACTIVE ROADMAP TREE GRAPH ("IMAGE")
              ═══════════════════════════════════════════ */}
          <div className="lg:col-span-6 relative flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-lg bg-[#12131C]/90 rounded-3xl border border-[#26283B] p-6 sm:p-8 shadow-2xl shadow-black/80 relative">
              
              {/* Header Badge inside graph card */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#26283B]">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold">
                  <Sparkles size={14} />
                  <span>Interactive Flowchart Graph</span>
                </div>
                <span className="text-[11px] font-mono text-muted">
                  Hover Node to Inspect
                </span>
              </div>

              {/* SVG Connecting Curved Lines Layer */}
              <div className="relative w-full h-[440px]">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 440" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Connection: Arrays & Hashing -> Two Pointers */}
                  <path d="M 75 45 C 75 80, 50 80, 50 110" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeDasharray="4 2" />
                  
                  {/* Connection: Arrays & Hashing -> Stack */}
                  <path d="M 75 45 C 75 80, 80 80, 80 110" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />

                  {/* Connection: Two Pointers -> Linked List */}
                  <path d="M 50 135 C 50 170, 25 170, 25 200" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />

                  {/* Connection: Two Pointers -> Sliding Window */}
                  <path d="M 50 135 C 50 170, 55 170, 55 200" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />

                  {/* Connection: Two Pointers / Stack -> Binary Search */}
                  <path d="M 80 135 C 80 170, 85 170, 85 200" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />

                  {/* Connection: Linked List -> Trees */}
                  <path d="M 25 225 C 25 260, 55 260, 55 290" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />

                  {/* Connection: Sliding Window -> Trees */}
                  <path d="M 55 225 C 55 260, 55 260, 55 290" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />

                  {/* Connection: Binary Search -> Trees */}
                  <path d="M 85 225 C 85 260, 55 260, 55 290" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />

                  {/* Connection: Trees -> Tries */}
                  <path d="M 55 315 C 55 350, 25 350, 25 380" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />

                  {/* Connection: Trees -> Heap / Priority Queue */}
                  <path d="M 55 315 C 55 350, 55 350, 55 380" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />

                  {/* Connection: Trees -> Backtracking */}
                  <path d="M 55 315 C 55 350, 85 350, 85 380" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />
                </svg>

                {/* HTML Nodes Layer */}
                {nodes.map((node) => {
                  const isActive = activeNode === node.id;
                  return (
                    <div
                      key={node.id}
                      onMouseEnter={() => setActiveNode(node.id)}
                      onMouseLeave={() => setActiveNode(null)}
                      style={{
                        left: `${node.x}%`,
                        top: `${node.y}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className={`absolute cursor-pointer transition-all duration-300 z-10 ${
                        isActive ? 'scale-110 z-30' : 'hover:scale-105'
                      }`}
                    >
                      <div
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border shadow-xl flex flex-col items-center gap-1 transition-all ${
                          isActive
                            ? 'bg-[#3B82F6] text-white border-white shadow-blue-500/50'
                            : 'bg-[#2563EB] text-white border-blue-400/40 hover:bg-[#3B82F6]'
                        }`}
                      >
                        <span>{node.label}</span>
                        {/* Sub-bar line representing progress */}
                        <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
                          <div className="bg-white h-full w-3/4 rounded-full" />
                        </div>
                      </div>

                      {/* Hover Tooltip Popup */}
                      {isActive && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg bg-[#1E202E] border border-blue-500/40 text-[10px] text-blue-200 whitespace-nowrap shadow-2xl animate-fade-in pointer-events-none">
                          {node.topics}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-4 border-t border-[#26283B] flex items-center justify-between text-xs text-muted">
                <span>Complete Algorithm Trajectory</span>
                <Link
                  to="/roadmaps"
                  className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                >
                  View Full Graph <ArrowRight size={13} />
                </Link>
              </div>

            </div>
          </div>
          
          {/* ═══════════════════════════════════════════
              RIGHT COLUMN: HERO TEXT & CTA (PERFECT SPACING & PADDING)
              ═══════════════════════════════════════════ */}
          <div className="lg:col-span-6 lg:pl-10 xl:pl-14 space-y-7 text-left order-1 lg:order-2 flex flex-col justify-center">
            {/* Brand Title & Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 font-mono tracking-tight">
                <span>TechJourney</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                A Better Way <br />
                <span className="text-white">to Prepare</span>
              </h2>
            </div>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-muted leading-relaxed max-w-lg">
              Tech interview roadmaps trusted by engineers at Google, Meta, OpenAI, and other top tech companies.
            </p>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-4 flex-wrap pt-1">
              <Link
                to="/roadmaps"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-95 group"
              >
                <span>Explore Roadmaps</span>
                <span className="text-lg">🚀</span>
              </Link>

              <Link
                to="/interview-questions"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#1A1C28] hover:bg-[#232636] border border-[#2E3248] text-[#E2E8F0] font-semibold text-sm sm:text-base transition-all duration-300 shadow-md hover:border-purple-500/40"
              >
                <span>Start Practice</span>
              </Link>
            </div>

            {/* Bottom Metrics with Perfect Spacing & Vertical Divider */}
            <div className="pt-6 mt-2 flex items-center gap-8 sm:gap-10 border-t border-[#1E202E]">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  100K+
                </div>
                <div className="text-xs sm:text-sm text-muted mt-1 font-medium">
                  Engineers prepared
                </div>
              </div>

              {/* Vertical Separator Line */}
              <div className="h-12 w-[1px] bg-[#2E3248]" />

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  1,000+
                </div>
                <div className="text-xs sm:text-sm text-muted mt-1 font-medium">
                  Practice problems &amp; Video Explanations
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
