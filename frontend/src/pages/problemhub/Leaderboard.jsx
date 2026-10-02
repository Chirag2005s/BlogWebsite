import React, { useState } from 'react';
import { Trophy, Medal, Star, Flame, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_LEADERBOARD = [
  { rank: 1, user: 'code_ninja', solved: 432, accepted: 215, rep: 9850, streak: 45 },
  { rank: 2, user: 'algo_master', solved: 389, accepted: 180, rep: 8200, streak: 12 },
  { rank: 3, user: 'sarah_codes', solved: 350, accepted: 150, rep: 7100, streak: 8 },
  { rank: 4, user: 'bug_squasher', solved: 310, accepted: 120, rep: 6400, streak: 21 },
  { rank: 5, user: 'dev_alex', solved: 295, accepted: 95, rep: 5900, streak: 5 },
  { rank: 6, user: 'frontend_wizard', solved: 250, accepted: 80, rep: 4800, streak: 2 },
  { rank: 7, user: 'backend_guru', solved: 220, accepted: 75, rep: 4200, streak: 0 },
];

export default function Leaderboard() {
  const [period, setPeriod] = useState('All Time');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-yellow-500/10 rounded-full mb-4">
          <Trophy size={48} className="text-yellow-500" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-heading mb-4 tracking-tight">Hall of Fame</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          The most active and helpful developers in the TechJourney community. Earn reputation by posting, solving, and helping others.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-card border border-line rounded-xl p-1">
          {['Weekly', 'Monthly', 'All Time'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                period === p 
                  ? 'bg-soft text-heading shadow-sm' 
                  : 'text-muted hover:text-heading'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium (Desktop only) */}
      <div className="hidden md:flex justify-center items-end gap-6 mb-16 h-64">
        {/* Rank 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-48 flex flex-col items-center"
        >
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-heading">@{MOCK_LEADERBOARD[1].user}</div>
            <div className="text-xs text-muted flex items-center justify-center gap-1">
              <Star size={12} className="text-[#0F6B4F]" /> {MOCK_LEADERBOARD[1].rep} Rep
            </div>
          </div>
          <div className="w-full h-32 bg-gradient-to-t from-slate-300/20 to-slate-300/5 border-t-2 border-slate-300 rounded-t-2xl flex justify-center pt-4 relative">
            <Medal size={32} className="text-slate-300" />
            <div className="absolute bottom-4 text-4xl font-black text-slate-300/30">2</div>
          </div>
        </motion.div>

        {/* Rank 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-56 flex flex-col items-center"
        >
          <div className="text-center mb-4 relative">
            <Crown size={32} className="text-yellow-500 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div className="text-xl font-bold text-heading">@{MOCK_LEADERBOARD[0].user}</div>
            <div className="text-sm text-muted flex items-center justify-center gap-1 font-medium">
              <Star size={14} className="text-[#0F6B4F]" /> {MOCK_LEADERBOARD[0].rep} Rep
            </div>
          </div>
          <div className="w-full h-40 bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 border-t-2 border-yellow-500 rounded-t-2xl flex justify-center pt-4 relative">
            <Trophy size={40} className="text-yellow-500 drop-shadow-md" />
            <div className="absolute bottom-4 text-5xl font-black text-yellow-500/30">1</div>
          </div>
        </motion.div>

        {/* Rank 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-48 flex flex-col items-center"
        >
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-heading">@{MOCK_LEADERBOARD[2].user}</div>
            <div className="text-xs text-muted flex items-center justify-center gap-1">
              <Star size={12} className="text-[#0F6B4F]" /> {MOCK_LEADERBOARD[2].rep} Rep
            </div>
          </div>
          <div className="w-full h-28 bg-gradient-to-t from-orange-400/20 to-orange-400/5 border-t-2 border-orange-400 rounded-t-2xl flex justify-center pt-4 relative">
            <Medal size={32} className="text-orange-400" />
            <div className="absolute bottom-4 text-4xl font-black text-orange-400/30">3</div>
          </div>
        </motion.div>
      </div>

      {/* List */}
      <div className="bg-card border border-line rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-soft/50 border-b border-line text-xs uppercase tracking-wider text-muted">
                <th className="p-4 font-semibold text-center w-16">Rank</th>
                <th className="p-4 font-semibold">Developer</th>
                <th className="p-4 font-semibold text-right">Problems Solved</th>
                <th className="p-4 font-semibold text-right">Accepted Solutions</th>
                <th className="p-4 font-semibold text-right">Streak</th>
                <th className="p-4 font-semibold text-right text-[#0F6B4F]">Reputation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {MOCK_LEADERBOARD.map((user, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={user.rank} 
                  className="hover:bg-soft/30 transition-colors group"
                >
                  <td className="p-4 text-center font-bold text-slate-400 group-hover:text-heading">
                    {user.rank}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F6B4F] to-[#16805E] flex items-center justify-center text-white font-bold text-xs">
                        {user.user.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-heading">@{user.user}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-slate-300">{user.solved}</td>
                  <td className="p-4 text-right font-mono text-slate-300">{user.accepted}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1 font-mono text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
                      <Flame size={12} /> {user.streak}
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold text-[#4FD1A5]">
                    {user.rep.toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
