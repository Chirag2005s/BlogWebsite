import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send, BellRing } from 'lucide-react';

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
    }, 800);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-line bg-page shadow-2xl group transition-all duration-500 hover:border-[#0F6B4F]/30 hover:shadow-[#0F6B4F]/10">
      {/* Dynamic Animated Background Blobs */}
      <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[30rem] h-[30rem] bg-gradient-to-bl from-[#0F6B4F]/20 via-[#16805E]/5 to-transparent rounded-full blur-[80px] opacity-60 group-hover:opacity-100 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000 ease-out pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-[25rem] h-[25rem] bg-gradient-to-tr from-[#F4A62A]/20 via-orange-500/5 to-transparent rounded-full blur-[80px] opacity-50 group-hover:opacity-90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 ease-out pointer-events-none delay-150" />
      
      {/* Subtle Dot/Grid Background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-page/50 to-page pointer-events-none" />

      {/* Glossy top border highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#0F6B4F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        <div className="eyebrow-badge mx-auto bg-page/80 backdrop-blur-md shadow-sm border-line/60">
          <Sparkles size={14} className="text-[#F4A62A] animate-pulse" />
          <span className="bg-gradient-to-r from-[#0F6B4F] to-[#16805E] bg-clip-text text-transparent font-bold">
            Weekly Engineering Intelligence
          </span>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-heading tracking-tight leading-[1.1]">
            Stay Ahead in <span className="tech-gradient-text relative inline-block">
              Technology
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#F4A62A]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 15 100 5" fill="transparent" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Get the latest programming tutorials, developer roadmaps, system design breakdowns, and exclusive tech news delivered straight to your inbox.
          </p>
        </div>

        <div className="max-w-xl mx-auto pt-2">
          {subscribed ? (
            <div className="p-6 rounded-2xl bg-soft/80 backdrop-blur-md border border-[#0F6B4F]/30 flex flex-col items-center justify-center gap-3 text-heading font-semibold shadow-lg animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-[#0F6B4F]/10 flex items-center justify-center text-[#0F6B4F] mb-1">
                <CheckCircle2 size={28} />
              </div>
              <p className="text-lg">Welcome aboard!</p>
              <p className="text-sm text-muted font-normal text-center">
                You're officially subscribed to the TechJourney dispatch. Keep an eye on your inbox for your first issue.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 relative animate-fade-in group/form">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within/form:text-[#0F6B4F] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your developer email..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-page/90 backdrop-blur-sm border-2 border-line hover:border-[#0F6B4F]/30 focus:border-[#0F6B4F] focus:ring-4 focus:ring-[#0F6B4F]/10 outline-none text-heading placeholder:text-muted/70 transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-4 shrink-0 active:scale-95 disabled:opacity-50 group/btn rounded-xl shadow-lg hover:shadow-[#0F6B4F]/25 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 font-bold text-white tracking-wide">
                  {loading ? 'Subscribing...' : 'Subscribe Now'}
                </span>
                <Send size={18} className={`relative z-10 ml-2 ${loading ? 'animate-pulse' : 'group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform'}`} />
              </button>
            </form>
          )}

          {!subscribed && (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted font-medium pt-5 opacity-80">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#0F6B4F]" /> No spam ever</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#0F6B4F]" /> Unsubscribe anytime</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#0F6B4F]" /> Curated by developers</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
