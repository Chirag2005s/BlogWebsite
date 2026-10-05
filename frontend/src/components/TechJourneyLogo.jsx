import React from 'react';

/**
 * TechJourneyLogo
 * Brand Logo & Icon Mark:
 * - Rounded gradient-border dark squircle
 * - Neon Cyan left bracket `{` and Amber Yellow right bracket `}`
 * - S-shaped journey roadmap path with Cyan -> Emerald -> Yellow gradient
 * - Waypoint nodes (start ring, intermediate node) and upward destination arrow
 * - Modern typography: "Tech" + gradient "Journey" + tracked "DEV PLATFORM"
 */
export default function TechJourneyLogo({ 
  size = 36, 
  showText = true, 
  className = '', 
  inverted = false 
}) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* ═══ BRAND ICON MARK ═══ */}
      <div 
        className="relative flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Ambient Glow Backdrop */}
        <div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#00E5FF] via-[#10B981] to-[#F59E0B] opacity-25 blur-md group-hover:opacity-45 transition-opacity duration-300 pointer-events-none" 
        />
        
        {/* Vector SVG Graphic */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-[0_2px_10px_rgba(0,229,255,0.2)]"
        >
          <defs>
            {/* Squircle Border Gradient */}
            <linearGradient id="tjBorderGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="35%" stopColor="#00DF89" />
              <stop offset="70%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* S-Trajectory Ribbon Gradient */}
            <linearGradient id="tjPathGrad" x1="25" y1="75" x2="65" y2="25" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00DF89" />
              <stop offset="30%" stopColor="#00D492" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="85%" stopColor="#84CC16" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="tjIconGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Dark Rounded Squircle Shield */}
          <rect 
            x="5" 
            y="5" 
            width="90" 
            height="90" 
            rx="24" 
            fill="#080D1A" 
            stroke="url(#tjBorderGrad)" 
            strokeWidth="3.2" 
          />

          {/* 2. Left Code Bracket { in Neon Cyan */}
          <path 
            d="M 23 33 C 17 33 15 37 15 42 C 15 47 12 48 9.5 50 C 12 52 15 53 15 58 C 15 63 17 67 23 67" 
            stroke="#00E5FF" 
            strokeWidth="3.6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* 3. Right Code Bracket } in Amber Gold */}
          <path 
            d="M 77 33 C 83 33 85 37 85 42 C 85 47 88 48 90.5 50 C 88 52 85 53 85 58 C 85 63 83 67 77 67" 
            stroke="#FBBF24" 
            strokeWidth="3.6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* 4. S-Curved Journey Trajectory Ribbon */}
          <path 
            d="M 27 72 C 38 72 50 67 63 58 C 72 50 62 41 46 41 C 28 41 30 25 50 25 L 64 25" 
            stroke="url(#tjPathGrad)" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* 5. Start Waypoint: Crisp White Ring with dark center */}
          <circle 
            cx="27" 
            cy="72" 
            r="5" 
            fill="#080D1A" 
            stroke="#FFFFFF" 
            strokeWidth="3" 
          />

          {/* 6. Intermediate Waypoint Node: Amber Circle with dark dot */}
          <circle 
            cx="63" 
            cy="58" 
            r="6" 
            fill="#F59E0B" 
            stroke="#FBBF24" 
            strokeWidth="0.8" 
          />
          <circle 
            cx="63" 
            cy="58" 
            r="2.2" 
            fill="#080D1A" 
          />

          {/* 7. Destination Terminal: Upward/NE Golden Arrowhead */}
          <polygon 
            points="64,12 73,25 55,25" 
            fill="#F59E0B" 
          />
        </svg>
      </div>

      {/* ═══ BRAND TYPOGRAPHY ═══ */}
      {showText && (
        <div className="flex flex-col text-left justify-center">
          {/* Main Title: Tech + Gradient Journey */}
          <div className="flex items-baseline tracking-tight font-extrabold leading-none text-xl sm:text-[22px]">
            <span className={inverted ? 'text-white' : 'text-heading'}>
              Tech
            </span>
            <span 
              className="bg-gradient-to-r from-[#00DF89] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent ml-[1px]"
            >
              Journey
            </span>
          </div>

          {/* Subtitle: DEV PLATFORM */}
          <span 
            className="text-[9.5px] uppercase font-sans font-bold tracking-[0.32em] leading-tight mt-1 text-slate-400"
          >
            Dev Platform
          </span>
        </div>
      )}
    </div>
  );
}

