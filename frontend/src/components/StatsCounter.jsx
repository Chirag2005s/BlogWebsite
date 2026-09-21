import React, { useState, useEffect, useRef } from 'react';
import { Layers, FileText, Compass, Code2 } from 'lucide-react';
import { PLATFORM_STATS } from '../data/mockData';

const STAT_ICONS = [
  <Layers key="cat" className="text-[#3B82F6]" size={28} />,
  <FileText key="art" className="text-[#06B6D4]" size={28} />,
  <Compass key="road" className="text-[#8B5CF6]" size={28} />,
  <Code2 key="top" className="text-[#22C55E]" size={28} />,
];

export default function StatsCounter() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState(PLATFORM_STATS.map(() => 0));
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1800; // ms
          const startTime = performance.now();

          const updateCounts = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCounts(
              PLATFORM_STATS.map((stat) => Math.floor(easeOut * stat.value))
            );

            if (progress < 1) {
              requestAnimationFrame(updateCounts);
            } else {
              setCounts(PLATFORM_STATS.map((s) => s.value));
            }
          };

          requestAnimationFrame(updateCounts);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {PLATFORM_STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="relative group p-6 sm:p-7 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-black/40 overflow-hidden"
        >
          {/* Subtle gradient corner glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-bl from-blue-500/10 via-cyan-500/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#111827] border border-[#334155] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
              {STAT_ICONS[i]}
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] font-semibold">
              Live Stat
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight font-mono">
              <span>{counts[i]}</span>
              <span className="tech-gradient-text">{stat.suffix}</span>
            </div>
            
            <h4 className="text-sm sm:text-base font-bold text-[#F8FAFC]">
              {stat.label}
            </h4>

            <p className="text-xs text-[#94A3B8]">
              {stat.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
