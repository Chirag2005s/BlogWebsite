import React from 'react';

/**
 * TechJourneyLogo
 * Unique brand mark combining:
 * - The letter 'T'
 * - A journey / dynamic curved path
 * - Code brackets { } / < >
 * - Digital tech glowing circuit nodes
 */
export default function TechJourneyLogo({ size = 36, showText = true, className = '', inverted = false }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-xl p-1.5 transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#0F6B4F] via-[#16805E] to-[#F4A62A] opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
        
        {/* SVG Graphic */}
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-[0_2px_8px_rgba(15,107,79,0.3)]"
        >
          <defs>
            <linearGradient id="tjGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F6B4F" />
              <stop offset="0.5" stopColor="#16805E" />
              <stop offset="1" stopColor="#F4A62A" />
            </linearGradient>
            
            <linearGradient id="tjPath" x1="10" y1="52" x2="54" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#16805E" stopOpacity="0.8" />
              <stop offset="1" stopColor="#F4A62A" stopOpacity="0.9" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Rounded Shield */}
          <rect x="2" y="2" width="60" height="60" rx="16" fill="#E8F5EF" stroke="#D9E2DE" strokeWidth="2" />

          {/* Left Code Bracket { */}
          <path 
            d="M14 20 C10 20, 9 24, 9 28 C9 31, 7 32, 5 32 C7 32, 9 33, 9 36 C9 40, 10 44, 14 44" 
            stroke="#16805E" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity="0.85"
          />

          {/* Right Code Bracket } */}
          <path 
            d="M50 20 C54 20, 55 24, 55 28 C55 31, 57 32, 59 32 C57 32, 55 33, 55 36 C55 40, 54 44, 50 44" 
            stroke="#F4A62A" 
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
          <circle cx="32" cy="32" r="3.5" fill="#16805E" />
          <circle cx="32" cy="46" r="4" fill="#F4A62A" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="48" cy="16" r="2.5" fill="#0F6B4F" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`text-xl font-extrabold tracking-tight leading-none ${inverted ? 'text-white' : 'text-heading'}`}>
            Tech<span className="tech-gradient-text">Journey</span>
          </span>
          <span className={`text-[10px] uppercase font-mono tracking-widest font-semibold mt-0.5 ${inverted ? 'text-slate-400' : 'text-muted'}`}>
            Dev Platform
          </span>
        </div>
      )}
    </div>
  );
}
