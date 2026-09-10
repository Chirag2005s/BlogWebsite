import { Newspaper, Clock, ExternalLink } from 'lucide-react';

const TechNews = () => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="relative py-8 sm:py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">📰 News</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Tech News
          </h1>
          <p className="text-text-secondary mt-3 text-lg max-w-xl leading-relaxed">
            Latest updates from the technology world. Stay informed with curated tech news.
          </p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-5">
          <Newspaper size={28} className="text-primary-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
        <p className="text-text-secondary text-sm max-w-sm mx-auto">
          Curated technology news, updates, and discoveries will be available here soon. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default TechNews;
