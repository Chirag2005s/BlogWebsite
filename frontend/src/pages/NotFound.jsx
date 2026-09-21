import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="relative max-w-xl w-full text-center space-y-6">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* 404 Cyber Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-mono font-semibold text-[#EF4444]">
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
          <span>HTTP 404: ROUTE_NOT_FOUND</span>
        </div>

        {/* Huge 404 Graphic */}
        <div className="text-7xl sm:text-9xl font-extrabold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 select-none drop-shadow-[0_10px_35px_rgba(6,182,212,0.3)]">
          404
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
            Looks like you've taken a wrong turn on your TechJourney.
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-md mx-auto leading-relaxed">
            The coordinates or technical document you were searching for have moved, evolved, or vanished into the digital void.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all active:scale-95"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-[#F8FAFC] font-semibold text-sm hover:bg-[#334155] transition-all"
          >
            <Compass size={16} className="text-[#06B6D4]" />
            <span>Explore Articles</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
