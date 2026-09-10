const StatsCard = ({ icon: Icon, label, value, trend, trendDirection, accentColor }) => {
  const colorMap = {
    cyan: { bg: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff', gradient: 'linear-gradient(135deg, #00d4ff, #0891b2)' },
    purple: { bg: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)' },
    green: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
    rose: { bg: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
    blue: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  };

  const accent = colorMap[accentColor] || colorMap.cyan;

  return (
    <div
      className="stat-card"
      style={{ '--card-accent': accent.gradient, '--icon-bg': accent.bg, '--icon-color': accent.color }}
    >
      <div className="stat-card-header">
        <div className="stat-card-icon">
          {Icon && <Icon />}
        </div>
        {trend && (
          <span className={`stat-card-trend ${trendDirection || 'up'}`}>
            {trendDirection === 'down' ? '↓' : '↑'} {trend}
          </span>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
};

export default StatsCard;
