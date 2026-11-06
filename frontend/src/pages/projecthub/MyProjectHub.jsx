import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  FolderGit2,
  Heart,
  Bookmark,
  Eye,
  MessageSquare,
  Edit3,
  Trash2,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import api from '../../services/api';

export default function MyProjectHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('myProjects'); // 'myProjects' | 'bookmarked' | 'liked'
  const [loading, setLoading] = useState(true);
  const [hubData, setHubData] = useState({
    stats: {
      projectsCreated: 0,
      bookmarkedCount: 0,
      likedCount: 0,
      totalLikesReceived: 0,
      totalViewsReceived: 0,
      totalCommentsReceived: 0,
    },
    myProjects: [],
    bookmarkedProjects: [],
    likedProjects: [],
  });

  const fetchMyHub = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects/my-hub');
      if (data) {
        setHubData({
          stats: data.stats || {},
          myProjects: Array.isArray(data.myProjects) ? data.myProjects : [],
          bookmarkedProjects: Array.isArray(data.bookmarkedProjects)
            ? data.bookmarkedProjects
            : [],
          likedProjects: Array.isArray(data.likedProjects)
            ? data.likedProjects
            : [],
        });
      }
    } catch (err) {
      console.error('Failed to load My Project Hub:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyHub();
  }, []);

  const handleDeleteProject = async (e, projectId, title) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${title}" permanently?`)) return;
    try {
      await api.delete(`/projects/${projectId}`);
      fetchMyHub();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleRemoveBookmark = async (e, projectId) => {
    e.stopPropagation();
    try {
      await api.post(`/projects/${projectId}/bookmark`);
      fetchMyHub();
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  const currentList =
    activeTab === 'myProjects'
      ? hubData.myProjects
      : activeTab === 'bookmarked'
      ? hubData.bookmarkedProjects
      : hubData.likedProjects;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/projecthub"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#4FD1A5] transition-colors mb-2"
          >
            <ChevronLeft size={16} />
            <span>Back to Project Hub</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
            My Project Portfolio
          </h1>
          <p className="text-sm text-muted mt-1">
            Manage your published builds, inspect community engagement, and access your bookmarked projects.
          </p>
        </div>

        <Link
          to="/projecthub/create"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F6B4F] hover:bg-[#16805E] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0F6B4F]/25 transition-all self-start"
        >
          <Plus size={16} />
          <span>Submit New Project</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl bg-card border border-line p-5">
          <div className="text-xs font-semibold text-muted">Projects Built</div>
          <div className="text-3xl font-black text-heading mt-1">
            {hubData.stats.projectsCreated || 0}
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-line p-5">
          <div className="text-xs font-semibold text-muted">
            Total Likes Earned
          </div>
          <div className="text-3xl font-black text-rose-400 mt-1">
            {hubData.stats.totalLikesReceived || 0}
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-line p-5">
          <div className="text-xs font-semibold text-muted">
            Total Project Views
          </div>
          <div className="text-3xl font-black text-[#4FD1A5] mt-1">
            {hubData.stats.totalViewsReceived || 0}
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-line p-5">
          <div className="text-xs font-semibold text-muted">
            Saved Bookmarks
          </div>
          <div className="text-3xl font-black text-sky-400 mt-1">
            {hubData.stats.bookmarkedCount || 0}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4 mb-6">
        <button
          onClick={() => setActiveTab('myProjects')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'myProjects'
              ? 'bg-[#0F6B4F] text-white'
              : 'bg-card hover:bg-soft text-muted hover:text-heading border border-line'
          }`}
        >
          <FolderGit2 size={15} />
          <span>My Submissions ({hubData.myProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarked')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'bookmarked'
              ? 'bg-[#0F6B4F] text-white'
              : 'bg-card hover:bg-soft text-muted hover:text-heading border border-line'
          }`}
        >
          <Bookmark size={15} />
          <span>Bookmarked ({hubData.bookmarkedProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'liked'
              ? 'bg-[#0F6B4F] text-white'
              : 'bg-card hover:bg-soft text-muted hover:text-heading border border-line'
          }`}
        >
          <Heart size={15} />
          <span>Liked Projects ({hubData.likedProjects.length})</span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#0F6B4F]/30 border-t-[#4FD1A5] rounded-full animate-spin mb-2" />
          <p className="text-xs text-muted">Loading your projects...</p>
        </div>
      ) : currentList.length === 0 ? (
        <div className="rounded-3xl bg-card border border-line p-12 text-center">
          <FolderGit2 size={44} className="mx-auto text-muted mb-3" />
          <h3 className="text-lg font-bold text-heading mb-1">
            {activeTab === 'myProjects'
              ? 'You have not submitted any projects yet'
              : activeTab === 'bookmarked'
              ? 'No bookmarked projects yet'
              : 'No liked projects yet'}
          </h3>
          <p className="text-xs text-muted mb-5 max-w-md mx-auto">
            {activeTab === 'myProjects'
              ? 'Publish your first project to showcase your engineering skills to the TechJourney community.'
              : 'Explore the Project Hub to discover and save awesome builds from fellow developers.'}
          </p>
          <Link
            to={
              activeTab === 'myProjects' ? '/projecthub/create' : '/projecthub'
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F6B4F] text-white text-xs font-bold"
          >
            {activeTab === 'myProjects'
              ? 'Submit Your First Project'
              : 'Explore Project Hub'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/projecthub/project/${project._id}`)}
              className="rounded-2xl bg-card border border-line hover:border-[#0F6B4F]/60 overflow-hidden shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#0F6B4F]/15 text-[#4FD1A5] border border-[#0F6B4F]/30">
                    {project.category}
                  </span>
                  <span className="text-[11px] font-semibold text-muted">
                    {project.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-heading line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                  {project.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(project.techStack || []).slice(0, 4).map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-soft text-muted border border-line"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3.5 border-t border-line bg-soft/20 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Heart size={13} className="text-rose-400" />
                    {project.likesCount || 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare size={13} />
                    {project.commentsCount || 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye size={13} />
                    {project.views || 0}
                  </span>
                </div>

                {activeTab === 'myProjects' ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projecthub/edit/${project._id}`);
                      }}
                      className="p-1.5 rounded-lg bg-soft hover:bg-[#0F6B4F] text-muted hover:text-white transition-colors cursor-pointer"
                      title="Edit project"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={(e) =>
                        handleDeleteProject(e, project._id, project.title)
                      }
                      className="p-1.5 rounded-lg bg-soft hover:bg-rose-500/20 text-muted hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : activeTab === 'bookmarked' ? (
                  <button
                    onClick={(e) => handleRemoveBookmark(e, project._id)}
                    className="text-xs font-semibold text-sky-400 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

