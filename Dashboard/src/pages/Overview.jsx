import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlinePencilAlt,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineTag,
  HiOutlineEye,
  HiOutlineThumbUp,
  HiOutlinePlus,
  HiOutlineArrowRight,
  HiOutlineMap,
  HiOutlineTrendingUp,
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineGlobeAlt,
  HiOutlineChartPie,
  HiOutlineCube,
  HiOutlineStar,
} from 'react-icons/hi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import StatsCard from '../components/StatsCard';
import api from '../services/api';

const COLORS = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'rgba(15, 15, 30, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 700, color: '#00d4ff', letterSpacing: '0.5px' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0', fontSize: '12px', color: '#e0e0e0' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color || entry.fill }} />
            <span style={{ color: 'var(--text-muted)' }}>{entry.name}:</span>
            <span style={{ fontWeight: 700, color: '#fff' }}>{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Overview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = async (isManualRefresh = false) => {
    let projectList = [];
    try {
      const projRes = await api.get('/projects');
      projectList = Array.isArray(projRes.data) ? projRes.data : (projRes.data?.data || []);
    } catch (e) {
      projectList = [];
    }

    const featuredProjectsCount = projectList.filter((p) => p.isFeatured).length;
    const contributorProjectsCount = projectList.filter((p) => p.lookingForContributors).length;

    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const { data } = await api.get('/admin/stats');
      if (data.success) {
        setStats({
          ...data.data,
          totalProjects: projectList.length || data.data.totalProjects || 0,
          featuredProjectsCount,
          contributorProjectsCount,
          recentProjects: projectList.slice(0, 5),
        });
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
      // Fallback for non-admin users or network delay
      try {
        const { data: articleData } = await api.get('/articles');
        const articles = articleData.data || [];
        const blogs = articles.filter((a) => !a.type || a.type === 'blog' || a.type === 'programming');
        const standardArticles = articles.filter((a) => a.type === 'article');
        const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
        const totalLikes = articles.reduce((sum, a) => sum + (a.likes || 0), 0);

        let userList = [];
        let totalUserCount = 0;
        try {
          const { data: userData } = await api.get('/admin/users');
          if (userData?.success && Array.isArray(userData.data)) {
            userList = userData.data;
            totalUserCount = userList.length;
          }
        } catch (e) {
          // Non-admin user fallback
        }

        setStats({
          totalBlogs: blogs.length,
          totalArticles: standardArticles.length,
          totalProjects: projectList.length,
          featuredProjectsCount,
          contributorProjectsCount,
          recentProjects: projectList.slice(0, 5),
          totalUsers: totalUserCount || 1,
          totalCategories: 7,
          totalRoadmaps: 5,
          totalViews,
          totalLikes,
          publishedCount: articles.filter(a => a.status === 'Published').length,
          draftCount: articles.filter(a => a.status === 'Draft').length,
          archivedCount: articles.filter(a => a.status === 'Archived').length,
          recentContent: articles.slice(0, 10),
          recentUsers: userList.slice(0, 5),
          contentByCategory: [],
          monthlyData: [],
        });
        setLastUpdated(new Date());
      } catch (fallbackErr) {
        setError('Failed to load dashboard telemetry data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <div className="empty-state-text">{error}</div>
        <button className="btn btn-primary" onClick={() => fetchStats()}>
          Retry Telemetry Connection
        </button>
      </div>
    );
  }

  // 1. Monthly Publication & Traffic Data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyPublicationData = (stats?.monthlyData || []).map((item) => {
    const monthLabel = item._id ? `${monthNames[item._id.month - 1]} ${item._id.year}` : 'Recent';
    return {
      name: monthLabel,
      Blogs: item.blogs || 0,
      Articles: item.articles || 0,
      Views: item.views || 0,
      Likes: item.likes || 0,
    };
  });

  const defaultTrendData = monthlyPublicationData.length > 0
    ? monthlyPublicationData
    : [
      { name: 'May', Blogs: 4, Articles: 2, Views: 240, Likes: 45 },
      { name: 'Jun', Blogs: 7, Articles: 3, Views: 580, Likes: 92 },
      { name: 'Jul', Blogs: 12, Articles: 5, Views: 890, Likes: 140 },
      { name: 'Aug', Blogs: 15, Articles: 8, Views: 1200, Likes: 210 },
      { name: 'Sep', Blogs: 18, Articles: 10, Views: 1650, Likes: 310 },
    ];

  // 2. Category Donut Data
  const categoryChartData = (stats?.contentByCategory || [])
    .filter(item => item._id)
    .map((item) => ({
      name: item._id,
      value: item.count,
    }));

  const defaultCategoryData = categoryChartData.length > 0
    ? categoryChartData
    : [
      { name: 'Web Development', value: 12 },
      { name: 'Frontend & React', value: 9 },
      { name: 'Backend Node.js', value: 8 },
      { name: 'DevOps & Cloud', value: 5 },
      { name: 'AI & Data Science', value: 4 },
    ];

  // 3. Platform Health Radar Data
  const radarData = [
    { subject: 'Content Velocity', A: Math.min(100, (stats?.totalBlogs || 5) * 8), fullMark: 100 },
    { subject: 'Engagement Rate', A: Math.min(100, Math.round(((stats?.totalLikes || 10) / Math.max(stats?.totalViews || 1, 100)) * 500)), fullMark: 100 },
    { subject: 'User Growth', A: Math.min(100, (stats?.totalUsers || 1) * 20 + 40), fullMark: 100 },
    { subject: 'Category Depth', A: Math.min(100, (stats?.totalCategories || 5) * 14), fullMark: 100 },
    { subject: 'Roadmap Progress', A: Math.min(100, (stats?.totalRoadmaps || 5) * 18), fullMark: 100 },
    { subject: 'SEO Score', A: 92, fullMark: 100 },
  ];

  // 4. Content Status Radial/Bar Data
  const statusData = [
    { name: 'Published', count: stats?.publishedCount || 0, fill: '#10b981' },
    { name: 'Draft', count: stats?.draftCount || 0, fill: '#f59e0b' },
    { name: 'Archived', count: stats?.archivedCount || 0, fill: '#8b8ba3' },
  ];

  const totalContentCount = (stats?.totalBlogs || 0) + (stats?.totalArticles || 0);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ═════════ 1. Executive Banner & Telemetry Hub ═════════ */}
      <div
        className="card"
        style={{
          padding: '28px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(20, 20, 45, 0.9) 0%, rgba(10, 10, 25, 0.95) 100%)',
          border: '1px solid rgba(0, 212, 255, 0.15)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              <span className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              Live System Active
            </span>

            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <h1 className="page-title" style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            Dashboard Overview & Analytics Control
          </h1>
          <p className="page-description" style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
            Real-time multi-dimensional view of platform performance, reader traffic, user signups, and content velocity.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Refresh statistics and sync live data"
          >
            <HiOutlineRefresh className={refreshing ? 'spin' : ''} style={{ fontSize: '16px' }} />
            {refreshing ? 'Syncing...' : 'Refresh'}
          </button>

          <button className="btn btn-secondary" onClick={() => navigate('/add-blog')} style={{ fontSize: '13px' }}>
            <HiOutlinePlus /> New Blog
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/add-article')} style={{ fontSize: '13px' }}>
            <HiOutlinePlus /> New Article
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/projects')} style={{ fontSize: '13px' }}>
            <HiOutlineCube /> Manage Projects
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/add-roadmap')} style={{ fontSize: '13px' }}>
            <HiOutlinePlus /> Add Roadmap
          </button>
        </div>
      </div>

      {/* ═════════ 2. KPI Metrics Row (7 Glass Cards) ═════════ */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '18px' }}>
        <StatsCard
          icon={HiOutlinePencilAlt}
          label="Total Blogs"
          value={stats?.totalBlogs || 0}
          trend="+12% this mo"
          accentColor="cyan"
        />
        <StatsCard
          icon={HiOutlineDocumentText}
          label="Total Articles"
          value={stats?.totalArticles || 0}
          trend="+8% this mo"
          accentColor="purple"
        />
        <StatsCard
          icon={HiOutlineCube}
          label="Total Projects"
          value={stats?.totalProjects || 0}
          trend={`${stats?.featuredProjectsCount || 0} Featured`}
          accentColor="green"
        />
        <StatsCard
          icon={HiOutlineMap}
          label="Active Roadmaps"
          value={stats?.totalRoadmaps || 5}
          trend="Live Stack"
          accentColor="amber"
        />
        <StatsCard
          icon={HiOutlineUsers}
          label="Registered Users"
          value={stats?.totalUsers || 0}
          trend="+15% growth"
          accentColor="blue"
        />
        <StatsCard
          icon={HiOutlineEye}
          label="Total Readers Views"
          value={(stats?.totalViews || 0).toLocaleString()}
          trend="+24% reads"
          accentColor="green"
        />
        <StatsCard
          icon={HiOutlineThumbUp}
          label="Total Appreciations"
          value={(stats?.totalLikes || 0).toLocaleString()}
          trend="High Likes"
          accentColor="rose"
        />
      </div>

      {/* ═════════ 3. Primary Graphs Grid (2 Columns) ═════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>

        {/* Graph 1: Reader Traffic & Engagement Trajectory */}
        <div className="chart-card" style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineTrendingUp style={{ color: 'var(--accent-cyan)', fontSize: '20px' }} />
                Reader Traffic & Engagement Trajectory
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Monthly view volume versus total reader likes.
              </p>
            </div>
            <span className="badge badge-blog" style={{ fontSize: '11px', padding: '4px 10px' }}>Area Stream</span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={defaultTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#5a5a72" fontSize={11} tickLine={false} />
              <YAxis stroke="#5a5a72" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#8b8ba3', fontSize: '12px', paddingTop: '12px' }} />
              <Area type="monotone" dataKey="Views" stroke="#00d4ff" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="Likes" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorLikes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 2: Publication Activity Stacked Bar */}
        <div className="chart-card" style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineChartBar style={{ color: 'var(--accent-purple)', fontSize: '20px' }} />
                Monthly Publishing Velocity
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Comparison of tech blogs created vs in-depth articles.
              </p>
            </div>
            <span className="badge badge-article" style={{ fontSize: '11px', padding: '4px 10px' }}>Bar Chart</span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={defaultTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#5a5a72" fontSize={11} tickLine={false} />
              <YAxis stroke="#5a5a72" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#8b8ba3', fontSize: '12px', paddingTop: '12px' }} />
              <Bar dataKey="Blogs" fill="#00d4ff" radius={[6, 6, 0, 0]} barSize={18} />
              <Bar dataKey="Articles" fill="#7c3aed" radius={[6, 6, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ═════════ 4. Secondary Graphs Grid (3 Columns) ═════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

        {/* Graph 3: Category Share Donut */}
        <div className="chart-card" style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineChartPie style={{ color: 'var(--accent-cyan)', fontSize: '18px' }} />
                Category Share
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Distribution across technical topics.
              </p>
            </div>
            <span className="badge badge-published" style={{ fontSize: '10px' }}>Donut</span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={defaultCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {defaultCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#8b8ba3', fontSize: '11px', paddingTop: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 4: Platform Performance Spider Radar */}
        <div className="chart-card" style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineSparkles style={{ color: '#f59e0b', fontSize: '18px' }} />
                Platform Health Radar
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Quality & operational index ratings.
              </p>
            </div>
            <span className="badge badge-blog" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '10px' }}>Radar</span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <RadarChart cx="50%" cy="50%" outerRadius={75} data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" stroke="#8b8ba3" fontSize={10} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#5a5a72" fontSize={9} />
              <Radar name="Performance Index" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 5: Content Status Breakdown Gauge */}
        <div className="chart-card" style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HiOutlineGlobeAlt style={{ color: '#10b981', fontSize: '18px' }} />
                  Content Status Distribution
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  State of written items in database.
                </p>
              </div>
              <span className="badge badge-published" style={{ fontSize: '10px' }}>Status</span>
            </div>

            {/* Visual Status Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '14px' }}>
              {statusData.map((st) => {
                const percentage = totalContentCount > 0 ? Math.round((st.count / totalContentCount) * 100) : 0;
                return (
                  <div key={st.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{st.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{st.count} items ({percentage}%)</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(percentage, 4)}%`,
                          background: st.fill,
                          borderRadius: '4px',
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Tracked Entries</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-cyan)' }}>{totalContentCount} items</span>
          </div>
        </div>

      </div>

      {/* ═════════ 5. Data Feeds & Recent Activity Section ═════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

        {/* Left: Registered Users Feed */}
        <div
          className="card"
          style={{
            padding: '24px',
            borderRadius: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HiOutlineUsers style={{ color: 'var(--accent-cyan)', fontSize: '20px' }} />
                  Registered Users Feed
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Latest users joined the platform.
                </p>
              </div>

              <Link
                to="/users"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                }}
              >
                Manage Users <HiOutlineArrowRight />
              </Link>
            </div>

            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats.recentUsers.map((u) => (
                  <div
                    key={u._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar-sm" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#fff' }}>
                        {getInitials(u.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {u.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : u.role === 'AUTHOR' ? 'badge-author' : 'badge-user'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                        {u.role || 'USER'}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'Recent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                No recent users logged in database.
              </div>
            )}
          </div>
        </div>
        {/* Right: Additional Information for Users */}
        <div
          className="card"
          style={{
            padding: '24px',
            borderRadius: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <HiOutlineCheckCircle style={{ color: 'var(--accent-purple)', fontSize: '20px' }} />
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>User Insights & Information</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick Stats Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Total Members</p>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#fff', fontWeight: 800 }}>{stats?.totalUsers || 0}</h4>
              </div>
              <div style={{ background: 'rgba(124, 58, 237, 0.2)', color: '#a78bfa', padding: '8px', borderRadius: '8px' }}>
                <HiOutlineUsers size={24} />
              </div>
            </div>

            {/* Role Explanations */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <h5 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#fff', fontWeight: 600 }}>Role Capabilities</h5>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span className="badge badge-admin" style={{ fontSize: '10px', height: 'fit-content' }}>ADMIN</span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Full access to manage platform settings, users, and all content.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span className="badge badge-author" style={{ fontSize: '10px', height: 'fit-content' }}>AUTHOR</span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Access to write and publish articles, blogs, and view telemetry data.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span className="badge badge-user" style={{ fontSize: '10px', height: 'fit-content' }}>USER</span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Standard readers. Can comment, like, and read premium content.
                  </p>
                </div>
              </div>
            </div>

            {/* Management Tip */}
            <div style={{ marginTop: 'auto', padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.05)', border: '1px dashed rgba(16, 185, 129, 0.2)' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HiOutlineSparkles /> <strong>Pro Tip:</strong> Regularly review user roles to maintain platform security.
              </p>
            </div>
          </div>
        </div>

        {/* Project Hub & Management Feed */}
        <div
          className="card"
          style={{
            padding: '24px',
            borderRadius: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HiOutlineCube style={{ color: '#10b981', fontSize: '20px' }} />
                  Total Projects & Management
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Project Hub showcase builds and contributor activity.
                </p>
              </div>

              <Link
                to="/projects"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                }}
              >
                Manage Projects <HiOutlineArrowRight />
              </Link>
            </div>

            {/* Total Projects Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(0, 212, 255, 0.06) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Total Projects Published</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '24px', color: '#fff', fontWeight: 800 }}>
                    {stats?.totalProjects || 0}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>
                    {stats?.featuredProjectsCount || 0} Featured • {stats?.contributorProjectsCount || 0} Collab Open
                  </span>
                </div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '8px', borderRadius: '8px' }}>
                <HiOutlineCube size={24} />
              </div>
            </div>

            {stats?.recentProjects && stats.recentProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stats.recentProjects.slice(0, 4).map((proj) => (
                  <div
                    key={proj._id}
                    onClick={() => navigate('/projects')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ minWidth: 0, paddingRight: '10px' }}>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {proj.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {proj.creator?.name || proj.creatorName || 'Developer'} • {proj.category || 'Full Stack'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {proj.isFeatured && (
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                          <HiOutlineStar style={{ verticalAlign: 'middle' }} /> Featured
                        </span>
                      )}
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent-cyan)' }}>
                        {proj.difficulty || 'Intermediate'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                No projects found. Click Manage Projects to publish one.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Overview;
