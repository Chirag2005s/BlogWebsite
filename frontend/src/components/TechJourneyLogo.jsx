import React from 'react';

/**
 * TechJourneyLogo
 * Unique brand mark combining:
 * - The letter 'T'
 * - A journey / dynamic curved path
 * - Code brackets { } / < >
 * - Digital tech glowing circuit nodes
 */
export default function TechJourneyLogo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-xl p-1.5 transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-purple-600 opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-300" />
        
        {/* SVG Graphic */}
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]"
        >
          <defs>
            <linearGradient id="tjGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="0.5" stopColor="#06B6D4" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            
            <linearGradient id="tjPath" x1="10" y1="52" x2="54" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.9" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Rounded Shield */}
          <rect x="2" y="2" width="60" height="60" rx="16" fill="#111827" stroke="#334155" strokeWidth="2" />

          {/* Left Code Bracket { */}
          <path 
            d="M14 20 C10 20, 9 24, 9 28 C9 31, 7 32, 5 32 C7 32, 9 33, 9 36 C9 40, 10 44, 14 44" 
            stroke="#06B6D4" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity="0.85"
          />

          {/* Right Code Bracket } */}
          <path 
            d="M50 20 C54 20, 55 24, 55 28 C55 31, 57 32, 59 32 C57 32, 55 33, 55 36 C55 40, 54 44, 50 44" 
            stroke="#8B5CF6" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity="0.85"
          />

          {/* Dynamic Journey Trajectory Path (Curved Ribbon) */}
          <path 
            d="M18 48 C 24 48, 22 36, 32 32 C 42 28, 44 18, 48 16" 
            stroke="url(#tjPath)" 
            strokeWidth="3" 
            strokeLinecap="round"
            strokeDasharray="1 0"
          />

          {/* Futuristic 'T' Crossbar and Stem */}
          <path 
            d="M20 18 H44" 
            stroke="url(#tjGrad)" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          <path 
            d="M32 18 V46" 
            stroke="url(#tjGrad)" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />

          {/* Journey Waypoint Pulse Nodes */}
          <circle cx="32" cy="18" r="3" fill="#FFFFFF" filter="url(#glow)" />
          <circle cx="32" cy="32" r="3.5" fill="#06B6D4" />
          <circle cx="32" cy="46" r="4" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="48" cy="16" r="2.5" fill="#3B82F6" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-xl font-extrabold tracking-tight text-white leading-none">
            Tech<span className="tech-gradient-text">Journey</span>
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#94A3B8] font-semibold mt-0.5">
            Dev Platform
          </span>
        </div>
      )}
    </div>
  );
}
