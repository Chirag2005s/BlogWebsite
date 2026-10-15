import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 overflow-hidden">
      <motion.div 
        className="relative max-w-xl w-full text-center space-y-6"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow background */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />

        {/* 404 Cyber Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full surface-card border border-line text-xs font-mono font-semibold text-[#EF4444]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
          <span>HTTP 404: ROUTE_NOT_FOUND</span>
        </motion.div>

        {/* Huge 404 Graphic with floating motion */}
        <motion.div 
          className="text-7xl sm:text-9xl font-extrabold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 select-none drop-shadow-[0_10px_35px_rgba(6,182,212,0.3)]"
          animate={{ y: [-6, 6, -6], rotateZ: [-1, 1, -1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          404
        </motion.div>

        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-heading">
            Looks like you've taken a wrong turn on your TechJourney.
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-md mx-auto leading-relaxed">
            The coordinates or technical document you were searching for have moved, evolved, or vanished into the digital void.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div 
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0F6B4F] to-[#16805E] text-white font-bold text-sm shadow-lg shadow-[#0F6B4F]/15 hover:opacity-95 transition-all"
            >
              <Home size={16} />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl surface-card border border-line text-heading font-semibold text-sm hover:bg-[#334155] transition-all"
            >
              <Compass size={16} className="text-[#06B6D4]" />
              <span>Explore Articles</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
