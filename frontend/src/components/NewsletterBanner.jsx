import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send } from 'lucide-react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
    }, 600);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-[#334155] shadow-2xl shadow-black/80 bg-[#111827]">
      {/* Background Gradient Mesh */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.4))'
        }}
      />

      {/* Futuristic glow elements */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-semibold text-[#06B6D4] shadow-sm">
          <Sparkles size={14} />
          <span>Weekly Engineering Intelligence</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
          Stay Ahead in <span className="tech-gradient-text">Technology</span>
        </h2>

        <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Get the latest programming tutorials, developer roadmaps, technology articles, and tech news directly in your inbox.
        </p>

        {subscribed ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2.5 text-emerald-400 font-semibold text-sm animate-scale-in">
            <CheckCircle2 size={20} />
            <span>Welcome aboard! You're now subscribed to TechJourney dispatch.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <div className="relative flex-grow">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your developer email..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#0B1120] border border-[#334155] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all shrink-0 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
              <Send size={15} />
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-6 text-xs text-[#94A3B8] pt-2">
          <span>✓ No spam ever</span>
          <span>✓ Unsubscribe anytime</span>
          <span>✓ Curated by developers</span>
        </div>
      </div>
    </div>
  );
}
