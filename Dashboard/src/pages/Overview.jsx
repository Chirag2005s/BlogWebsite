import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePencilAlt,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineTag,
  HiOutlineEye,
  HiOutlineThumbUp,
  HiOutlinePlus,
} from 'react-icons/hi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatsCard from '../components/StatsCard';
import ContentTable from '../components/ContentTable';
import api from '../services/api';

const COLORS = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#8b5cf6'];

const Overview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
      // If user is AUTHOR (not ADMIN), fall back to fetching their articles directly
      try {
        const { data } = await api.get('/articles');
        const articles = data.data || [];
        const blogs = articles.filter(a => a.type === 'blog');
        const standardArticles = articles.filter(a => a.type === 'article');
        const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
        const totalLikes = articles.reduce((sum, a) => sum + (a.likes || 0), 0);

        setStats({
          totalBlogs: blogs.length,
          totalArticles: standardArticles.length,
          totalUsers: '—',
          totalCategories: 7,
          totalViews,
          totalLikes,
          recentContent: articles.slice(0, 5),
          contentByCategory: [],
          monthlyData: [],
        });
      } catch (fallbackErr) {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
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
        <button className="btn btn-primary" onClick={fetchStats}>Retry</button>
      </div>
    );
  }

  const monthlyChartData = (stats?.monthlyData || []).map(item => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      Blogs: item.blogs,
      Articles: item.articles,
    };
  });

  const categoryChartData = (stats?.contentByCategory || []).map(item => ({
    name: item._id || 'Uncategorized',
    value: item.count,
  }));

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-description">Welcome back! Here is what's happening with your tech platform.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/add-blog')}>
            <HiOutlinePlus /> New Blog
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/add-article')}>
            <HiOutlinePlus /> New Article
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          icon={HiOutlinePencilAlt}
          label="Total Blogs"
          value={stats?.totalBlogs || 0}
          accentColor="cyan"
        />
        <StatsCard
          icon={HiOutlineDocumentText}
          label="Total Articles"
          value={stats?.totalArticles || 0}
          accentColor="purple"
        />
        <StatsCard
          icon={HiOutlineUsers}
          label="Total Users"
          value={stats?.totalUsers || 0}
          accentColor="blue"
        />
        <StatsCard
          icon={HiOutlineTag}
          label="Categories"
          value={stats?.totalCategories || 7}
          accentColor="green"
        />
        <StatsCard
          icon={HiOutlineEye}
          label="Total Views"
          value={stats?.totalViews || 0}
          accentColor="amber"
        />
        <StatsCard
          icon={HiOutlineThumbUp}
          label="Total Likes"
          value={stats?.totalLikes || 0}
          accentColor="rose"
        />
      </div>

      {/* Analytics Charts */}
      {(monthlyChartData.length > 0 || categoryChartData.length > 0) && (
        <div className="charts-grid">
          {monthlyChartData.length > 0 && (
            <div className="chart-card">
              <div className="chart-card-title">Monthly Publication Activity</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyChartData}>
                  <XAxis dataKey="name" stroke="#5a5a72" fontSize={12} />
                  <YAxis stroke="#5a5a72" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(22, 22, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#f0f0f5',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#8b8ba3', fontSize: '13px' }} />
                  <Bar dataKey="Blogs" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Articles" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {categoryChartData.length > 0 && (
            <div className="chart-card">
              <div className="chart-card-title">Content by Category</div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(22, 22, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#f0f0f5',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Recent Content */}
      <div style={{ marginTop: '24px' }}>
        <ContentTable
          articles={stats?.recentContent || []}
          onRefresh={fetchStats}
          title="Recently Created Content"
        />
      </div>
    </div>
  );
};

export default Overview;
