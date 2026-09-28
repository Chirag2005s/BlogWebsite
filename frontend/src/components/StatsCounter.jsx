import React, { useState, useEffect, useRef } from 'react';
import { Layers, FileText, Compass, Code2 } from 'lucide-react';
import { PLATFORM_STATS } from '../data/mockData';

const STAT_ICONS = [
  <Layers key="cat" className="text-[#0F6B4F]" size={28} />,
  <FileText key="art" className="text-[#16805E]" size={28} />,
  <Compass key="road" className="text-[#F4A62A]" size={28} />,
  <Code2 key="top" className="text-[#0F6B4F]" size={28} />,
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

          const duration = 1800;
          const startTime = performance.now();

          const updateCounts = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
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
          className="relative group p-6 sm:p-7 rounded-2xl surface-card surface-card-hover overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-bl from-[#0F6B4F]/10 via-[#F4A62A]/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-soft border border-line flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {STAT_ICONS[i]}
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-semibold">
              Live Stat
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-heading tracking-tight font-mono">
              <span>{counts[i]}</span>
              <span className="tech-gradient-text">{stat.suffix}</span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-heading">
              {stat.label}
            </h4>

            <p className="text-xs text-muted">
              {stat.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
