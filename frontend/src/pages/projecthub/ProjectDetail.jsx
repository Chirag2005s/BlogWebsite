import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import {
  ChevronLeft,
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  GitBranch,
  PlayCircle,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  MessageSquare,
  Send,
  Trash2,
  Edit3,
  Eye,
  Calendar,
  Layers,
  Cpu,
  Users,
  Sparkles,
  FolderGit2,
  ThumbsUp,
  User,
  Mail,
  Shield,
  X,
} from 'lucide-react';
import api from '../../services/api';

const FEEDBACK_TYPES = [
  'General',
  'Feature Idea',
  'Code Review',
  'Bug Report',
  'Appreciation',
];

// Cache creator profiles fetched from backend so /profile/:id resolves real backend data seamlessly
const creatorProfileCache = {};

if (!api.__creatorProfileInterceptorAttached) {
  api.__creatorProfileInterceptorAttached = true;
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const reqUrl = error?.config?.url || '';
      const match = reqUrl.match(/\/auth\/user\/([^/?#]+)/);
      if (match && match[1]) {
        const targetId = decodeURIComponent(match[1]);

        if (creatorProfileCache[targetId]) {
          return {
            data: {
              success: true,
              data: creatorProfileCache[targetId],
            },
          };
        }

        try {
          const [projRes, probRes, artRes] = await Promise.all([
            api.get('/projects').catch(() => ({ data: [] })),
            api.get('/problems').catch(() => ({ data: [] })),
            api.get('/articles').catch(() => ({ data: [] })),
          ]);

          const projectsList = Array.isArray(projRes?.data) ? projRes.data : [];
          const problemsList = Array.isArray(probRes?.data) ? probRes.data : [];
          const articlesList = Array.isArray(artRes?.data)
            ? artRes.data
            : Array.isArray(artRes?.data?.data)
              ? artRes.data.data
              : [];

          const matchedProj = projectsList.find(
            (p) =>
              String(p._id) === String(targetId) ||
              String(p.creator?._id || p.creator) === String(targetId)
          );
          const matchedProb = problemsList.find(
            (p) => String(p.creator?._id || p.creator) === String(targetId)
          );
          const matchedArt = articlesList.find(
            (a) => String(a.author?._id || a.author) === String(targetId)
          );

          const creatorUser =
            (typeof matchedProj?.creator === 'object' && matchedProj?.creator) ||
            (typeof matchedProb?.creator === 'object' && matchedProb?.creator) ||
            (typeof matchedArt?.author === 'object' && matchedArt?.author) ||
            null;

          if (creatorUser || matchedProj) {
            const fallbackName =
              creatorUser?.name || matchedProj?.creatorName || 'Developer';
            const resolvedProfile = {
              _id: creatorUser?._id || targetId,
              name: fallbackName,
              email:
                creatorUser?.email ||
                `${fallbackName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@techjourney.dev`,
              role: creatorUser?.role || 'AUTHOR',
              roleTitle: creatorUser?.roleTitle || 'Full Stack Engineer',
              bio:
                creatorUser?.bio ||
                `Creator of ${matchedProj?.title || 'engineering projects'} on TechJourney.`,
              skills:
                Array.isArray(creatorUser?.skills) && creatorUser.skills.length > 0
                  ? creatorUser.skills
                  : Array.isArray(matchedProj?.techStack)
                    ? matchedProj.techStack
                    : ['JavaScript', 'React', 'Node.js'],
              github: creatorUser?.github || matchedProj?.githubUrl || '',
              linkedin: creatorUser?.linkedin || '',
              profileImage: creatorUser?.profileImage || '',
              createdAt:
                creatorUser?.createdAt ||
                matchedProj?.createdAt ||
                new Date().toISOString(),
            };
            creatorProfileCache[targetId] = resolvedProfile;
            return {
              data: {
                success: true,
                data: resolvedProfile,
              },
            };
          }
        } catch {
          // fall through if lookup fails
        }
      }
      return Promise.reject(error);
    }
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const userInfo = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'discussion'
  const [selectedScreenshot, setSelectedScreenshot] = useState('');

  // Engagement states
  const [likeBusy, setLikeBusy] = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);
  const [copiedSetup, setCopiedSetup] = useState(false);
  const [sharedLink, setSharedLink] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  // Comment form states
  const [commentText, setCommentText] = useState('');
  const [feedbackType, setFeedbackType] = useState('General');
  const [postingComment, setPostingComment] = useState(false);

  // Real Creator Data fetched from Backend
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [creatorProjects, setCreatorProjects] = useState([]);
  const [creatorHubStats, setCreatorHubStats] = useState(null);
  const [creatorLoading, setCreatorLoading] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const [projRes, comRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/projects/${id}/comments`).catch(() => ({ data: [] })),
        ]);
        const loadedProject = projRes.data;
        setProject(loadedProject);
        setSelectedScreenshot(loadedProject?.coverImage || '');
        setComments(Array.isArray(comRes.data) ? comRes.data : []);

        // Fetch real creator data & creator's projects from backend
        if (loadedProject) {
          setCreatorLoading(true);
          const rawCreatorObj =
            typeof loadedProject.creator === 'object' && loadedProject.creator
              ? loadedProject.creator
              : null;
          const isSeededShowcase = Boolean(
            loadedProject.creatorName &&
            rawCreatorObj?.name &&
            loadedProject.creatorName.trim().toLowerCase() !==
            rawCreatorObj.name.trim().toLowerCase()
          );
          const creatorObj = isSeededShowcase ? null : rawCreatorObj;
          const creatorId = isSeededShowcase
            ? null
            : creatorObj?._id ||
            (typeof loadedProject.creator === 'string'
              ? loadedProject.creator
              : null);

          try {
            const requests = [
              api
                .get('/projects', {
                  params: creatorId ? { creator: creatorId } : {},
                })
                .catch(() => ({ data: [] })),
            ];

            if (creatorId) {
              requests.push(
                api.get(`/problems/user/${creatorId}/hub`).catch(() => ({ data: null }))
              );
            }

            if (userInfo?._id && creatorId && String(userInfo._id) === String(creatorId)) {
              requests.push(
                api.get('/auth/profile').catch(() => ({ data: null }))
              );
            }

            const [allProjRes, hubRes, ownProfRes] = await Promise.all(requests);
            const allProjs = Array.isArray(allProjRes?.data) ? allProjRes.data : [];

            const matchedCreatorProjects = creatorId
              ? allProjs.filter(
                (p) => String(p.creator?._id || p.creator) === String(creatorId)
              )
              : allProjs.filter(
                (p) =>
                  (p.creatorName || p.creator?.name) ===
                  (loadedProject.creatorName || creatorObj?.name)
              );

            setCreatorProjects(
              matchedCreatorProjects.length > 0 ? matchedCreatorProjects : [loadedProject]
            );

            if (hubRes?.data?.stats) {
              setCreatorHubStats(hubRes.data.stats);
            }

            const ownData = ownProfRes?.data?.data || ownProfRes?.data || null;
            const resolvedName =
              ownData?.name ||
              creatorObj?.name ||
              loadedProject.creatorName ||
              'Developer';
            const profileKey = creatorId || loadedProject._id;
            const builtCreatorProfile = {
              _id: profileKey,
              name: resolvedName,
              username:
                ownData?.username ||
                creatorObj?.username ||
                resolvedName.toLowerCase().replace(/[^a-z0-9]/g, ''),
              email:
                ownData?.email ||
                creatorObj?.email ||
                `${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@techjourney.dev`,
              role: ownData?.role || creatorObj?.role || 'AUTHOR',
              roleTitle:
                ownData?.roleTitle ||
                creatorObj?.roleTitle ||
                'Full Stack Engineer',
              profileImage:
                ownData?.profileImage || creatorObj?.profileImage || '',
              bio:
                ownData?.bio ||
                creatorObj?.bio ||
                `Builder of ${loadedProject.title} on TechJourney Project Hub.`,
              github: ownData?.github || creatorObj?.github || loadedProject.githubUrl || '',
              linkedin: ownData?.linkedin || creatorObj?.linkedin || '',
              skills:
                Array.isArray(ownData?.skills) && ownData.skills.length > 0
                  ? ownData.skills
                  : Array.isArray(loadedProject.techStack)
                    ? loadedProject.techStack
                    : [],
              createdAt:
                ownData?.createdAt ||
                creatorObj?.createdAt ||
                loadedProject.createdAt ||
                new Date().toISOString(),
            };

            if (profileKey) {
              creatorProfileCache[profileKey] = builtCreatorProfile;
            }
            setCreatorProfile(builtCreatorProfile);
          } catch (creatorErr) {
            console.warn('Failed to fetch extended creator info:', creatorErr);
          } finally {
            setCreatorLoading(false);
          }
        }
      } catch (err) {
        console.error('Failed to load project details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  const isOwner = Boolean(
    userInfo?._id &&
    project &&
    String(project.creator?._id || project.creator) === String(userInfo._id) &&
    (!project.creatorName ||
      !project.creator?.name ||
      project.creatorName.trim().toLowerCase() ===
      project.creator.name.trim().toLowerCase())
  );
  const isAdmin = false;

  const isLiked = Boolean(
    userInfo?._id &&
    Array.isArray(project?.likes) &&
    project.likes.some((uid) => String(uid) === String(userInfo._id))
  );

  const isBookmarked = Boolean(
    userInfo?._id &&
    Array.isArray(project?.bookmarks) &&
    project.bookmarks.some((uid) => String(uid) === String(userInfo._id))
  );

  const handleToggleLike = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (likeBusy || !project) return;
    setLikeBusy(true);
    try {
      const { data } = await api.post(`/projects/${project._id}/like`);
      setProject((prev) => ({
        ...prev,
        likes: data.likes,
        likesCount: data.likesCount,
      }));
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setLikeBusy(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (bookmarkBusy || !project) return;
    setBookmarkBusy(true);
    try {
      const { data } = await api.post(`/projects/${project._id}/bookmark`);
      setProject((prev) => ({
        ...prev,
        bookmarks: data.bookmarks,
        bookmarksCount: data.bookmarksCount,
      }));
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setBookmarkBusy(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSharedLink(true);
    setTimeout(() => setSharedLink(false), 2000);
  };

  const handleCopySetup = () => {
    if (!project?.setupInstructions) return;
    navigator.clipboard.writeText(project.setupInstructions);
    setCopiedSetup(true);
    setTimeout(() => setCopiedSetup(false), 2000);
  };

  const handleDeleteProject = async () => {
    if (!project || !isOwner) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${project.title}"?`
      )
    ) {
      return;
    }
    setDeletingProject(true);
    try {
      await api.delete(`/projects/${project._id}`);
      navigate('/projecthub');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setDeletingProject(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (!commentText.trim() || postingComment) return;
    setPostingComment(true);

    try {
      const { data } = await api.post(`/projects/${project._id}/comments`, {
        text: commentText.trim(),
        feedbackType,
      });
      setComments((prev) => [data, ...prev]);
      setProject((prev) => ({
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1,
      }));
      setCommentText('');
      setFeedbackType('General');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/projects/${project._id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setProject((prev) => ({
        ...prev,
        commentsCount: Math.max(0, (prev.commentsCount || 1) - 1),
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await api.post(
        `/projects/${project._id}/comments/${commentId}/like`
      );
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? data : c))
      );
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block w-10 h-10 border-2 border-[#0F6B4F]/30 border-t-[#4FD1A5] rounded-full animate-spin mb-4" />
        <p className="text-muted text-sm">Loading project blueprint...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <FolderGit2 size={56} className="mx-auto text-muted mb-4" />
        <h2 className="text-2xl font-bold text-heading mb-2">
          Project Not Found
        </h2>
        <p className="text-muted text-sm mb-6">
          The project you are looking for may have been removed or renamed.
        </p>
        <Link
          to="/projecthub"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F6B4F] text-white text-sm font-semibold"
        >
          <ChevronLeft size={16} />
          Back to Project Hub
        </Link>
      </div>
    );
  }

  const allImages = [
    project.coverImage,
    ...(Array.isArray(project.screenshots) ? project.screenshots : []),
  ].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <Link
          to="/projecthub"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#4FD1A5] transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Project Hub</span>
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <Link
              to={`/projecthub/edit/${project._id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card hover:bg-soft border border-line text-xs font-semibold text-heading transition-all"
            >
              <Edit3 size={14} className="text-[#4FD1A5]" />
              <span>Edit Project</span>
            </Link>
            <button
              onClick={handleDeleteProject}
              disabled={deletingProject}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-400 transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={14} />
              <span>{deletingProject ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ═══ PROJECT HERO HEADER ═══ */}
      <header className="rounded-3xl bg-card border border-line p-6 sm:p-8 lg:p-10 mb-8 shadow-xl">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {project.isFeatured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles size={12} />
              Featured Build
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F6B4F]/15 text-[#4FD1A5] border border-[#0F6B4F]/30">
            {project.category}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${project.difficulty === 'Beginner'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : project.difficulty === 'Intermediate'
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}
          >
            {project.difficulty}
          </span>
          {project.lookingForContributors && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Users size={12} />
              Looking for Contributors
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-heading tracking-tight mb-3">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-4xl leading-relaxed mb-6">
          {project.tagline}
        </p>

        {/* Action & Launch Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-line">
          {/* Primary External Links */}
          <div className="flex flex-wrap items-center gap-3">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F6B4F] hover:bg-[#16805E] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0F6B4F]/25 transition-all"
              >
                <ExternalLink size={16} />
                <span>Launch Live</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-page hover:bg-soft border border-line text-heading text-xs sm:text-sm font-bold transition-all"
              >
                <GitBranch size={16} className="text-[#4FD1A5]" />
                <span>View Source Code</span>
              </a>
            )}
            {project.videoDemoUrl && (
              <a
                href={project.videoDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-page hover:bg-soft border border-line text-heading text-xs sm:text-sm font-semibold transition-all"
              >
                <PlayCircle size={16} className="text-amber-400" />
                <span>Video Demo</span>
              </a>
            )}
          </div>

          {/* Interactive Like / Bookmark / Share Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToggleLike}
              disabled={likeBusy}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${isLiked
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                : 'bg-page hover:bg-soft border-line text-heading'
                }`}
            >
              <Heart
                size={15}
                className={isLiked ? 'fill-current text-rose-400' : ''}
              />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
              <span className="px-1.5 py-0.5 rounded bg-black/20 text-[11px]">
                {project.likesCount || 0}
              </span>
            </button>

            <button
              onClick={handleToggleBookmark}
              disabled={bookmarkBusy}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${isBookmarked
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                : 'bg-page hover:bg-soft border-line text-heading'
                }`}
            >
              <Bookmark
                size={15}
                className={isBookmarked ? 'fill-current text-sky-400' : ''}
              />
              <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
              <span className="px-1.5 py-0.5 rounded bg-black/20 text-[11px]">
                {project.bookmarksCount || 0}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-page hover:bg-soft border border-line text-xs font-semibold text-heading transition-all cursor-pointer"
            >
              {sharedLink ? (
                <>
                  <Check size={15} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={15} />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ═══ MAIN 2-COLUMN CONTENT ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Media Showcase */}
          {allImages.length > 0 && (
            <div className="rounded-2xl bg-card border border-line overflow-hidden p-3 space-y-3">
              <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-soft">
                <img
                  src={selectedScreenshot || allImages[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {allImages.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {allImages.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedScreenshot(imgUrl)}
                      className={`relative h-16 w-28 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${(selectedScreenshot || allImages[0]) === imgUrl
                        ? 'border-[#4FD1A5]'
                        : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'overview'
                ? 'bg-[#0F6B4F] text-white shadow-sm'
                : 'bg-card hover:bg-soft text-muted hover:text-heading border border-line'
                }`}
            >
              <Layers size={16} />
              <span>Overview & Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('discussion')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'discussion'
                ? 'bg-[#0F6B4F] text-white shadow-sm'
                : 'bg-card hover:bg-soft text-muted hover:text-heading border border-line'
                }`}
            >
              <MessageSquare size={16} />
              <span>Discussion & Reviews ({comments.length})</span>
            </button>
          </div>

          {activeTab === 'overview' ? (
            <div className="space-y-8">
              {/* Key Features Card */}
              {Array.isArray(project.keyFeatures) &&
                project.keyFeatures.length > 0 && (
                  <div className="rounded-2xl bg-card border border-line p-6">
                    <h3 className="text-base font-bold text-heading mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-[#4FD1A5]" />
                      <span>Key Engineering Features</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.keyFeatures.map((feat, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-page border border-line flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#0F6B4F]/20 text-[#4FD1A5] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="text-xs sm:text-sm text-heading leading-relaxed">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Project README / Markdown Description */}
              <div className="rounded-2xl bg-card border border-line p-6 sm:p-8">
                <h3 className="text-base font-bold text-heading mb-4 pb-3 border-b border-line">
                  Project Documentation
                </h3>
                <div className="prose prose-invert max-w-none text-sm leading-relaxed text-heading space-y-4">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {project.description}
                  </ReactMarkdown>
                </div>
              </div>

              {/* System Architecture Overview */}
              {project.architectureOverview && (
                <div className="rounded-2xl bg-card border border-line p-6 sm:p-8">
                  <h3 className="text-base font-bold text-heading mb-3 flex items-center gap-2">
                    <Cpu size={18} className="text-[#4FD1A5]" />
                    <span>System Architecture & Data Flow</span>
                  </h3>
                  <div className="prose prose-invert max-w-none text-sm leading-relaxed text-muted bg-page p-5 rounded-xl border border-line">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                      {project.architectureOverview}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Quick Setup Instructions */}
              {project.setupInstructions && (
                <div className="rounded-2xl bg-card border border-line p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-heading flex items-center gap-2">
                      <Terminal size={18} className="text-[#4FD1A5]" />
                      <span>Local Setup & Quickstart</span>
                    </h3>
                    <button
                      onClick={handleCopySetup}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-page hover:bg-soft border border-line text-xs font-semibold text-muted hover:text-heading transition-colors cursor-pointer"
                    >
                      {copiedSetup ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Commands</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#090D16] border border-line text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                    <code>{project.setupInstructions}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : (
            /* ═══ DISCUSSION & FEEDBACK TAB ═══ */
            <div className="space-y-6">
              {/* Post Comment Form */}
              <form
                onSubmit={handlePostComment}
                className="rounded-2xl bg-card border border-line p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-heading">
                    Leave Project Feedback or Review
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {FEEDBACK_TYPES.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFeedbackType(type)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${feedbackType === type
                          ? 'bg-[#0F6B4F] text-white border-[#0F6B4F]'
                          : 'bg-page text-muted hover:text-heading border-line'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share architecture feedback, suggest a feature, or ask the builder a question..."
                  className="w-full rounded-xl bg-page border border-line p-4 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-[#0F6B4F]"
                  required
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={postingComment || !commentText.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F6B4F] hover:bg-[#16805E] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>
                      {postingComment ? 'Posting...' : 'Post Feedback'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Comments Feed */}
              {comments.length === 0 ? (
                <div className="rounded-2xl bg-card border border-line p-10 text-center">
                  <MessageSquare
                    size={36}
                    className="mx-auto text-muted mb-2"
                  />
                  <p className="text-sm font-semibold text-heading">
                    No feedback yet
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Be the first to review this project or suggest an improvement!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => {
                    const canDeleteComment =
                      userInfo &&
                      (String(comment.user?._id || comment.user) ===
                        String(userInfo._id) ||
                        isOwner);
                    const commentLiked =
                      userInfo &&
                      Array.isArray(comment.likes) &&
                      comment.likes.some(
                        (uid) => String(uid) === String(userInfo._id)
                      );

                    return (
                      <div
                        key={comment._id}
                        className="rounded-2xl bg-card border border-line p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0F6B4F] to-[#2BAF85] flex items-center justify-center text-xs font-bold text-white">
                              {(comment.user?.name || 'D')
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-heading">
                                  {comment.user?.name || 'Developer'}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#0F6B4F]/15 text-[#4FD1A5] border border-[#0F6B4F]/30">
                                  {comment.feedbackType || 'General'}
                                </span>
                              </div>
                              <span className="text-[11px] text-muted">
                                {comment.createdAt
                                  ? new Date(
                                    comment.createdAt
                                  ).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                  : 'Just now'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleToggleCommentLike(comment._id)
                              }
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${commentLiked
                                ? 'bg-[#0F6B4F]/20 text-[#4FD1A5] border-[#0F6B4F]/40'
                                : 'bg-page text-muted hover:text-heading border-line'
                                }`}
                            >
                              <ThumbsUp size={12} />
                              <span>{comment.likes?.length || 0}</span>
                            </button>

                            {canDeleteComment && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Delete comment"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-heading leading-relaxed whitespace-pre-line">
                          {comment.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Creator Card (Real Backend Data) */}
          <div className="rounded-2xl bg-card border border-line p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                Project Creator
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-[#0F6B4F]/15 text-[#4FD1A5] border border-[#0F6B4F]/30">
                {creatorProfile?.role || project.creator?.role || 'BUILDER'}
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              {creatorProfile?.profileImage || project.creator?.profileImage ? (
                <img
                  src={creatorProfile?.profileImage || project.creator?.profileImage}
                  alt={creatorProfile?.name || project.creator?.name || 'Creator'}
                  className="w-13 h-13 rounded-2xl object-cover border border-[#0F6B4F]/40 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F6B4F] to-[#2BAF85] flex items-center justify-center text-base font-extrabold text-white shrink-0 shadow-md">
                  {(
                    creatorProfile?.name ||
                    project.creator?.name ||
                    project.creatorName ||
                    'D'
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-heading truncate">
                  {creatorProfile?.name ||
                    project.creator?.name ||
                    project.creatorName ||
                    'Developer'}
                </h4>
                <p className="text-xs text-[#4FD1A5] font-medium truncate">
                  {creatorProfile?.roleTitle ||
                    project.creator?.roleTitle ||
                    'Full Stack Engineer'}
                </p>
                {(creatorProfile?.email || project.creator?.email) && (
                  <p className="text-[11px] text-muted truncate mt-0.5">
                    {creatorProfile?.email || project.creator?.email}
                  </p>
                )}
              </div>
            </div>

            {(creatorProfile?.bio || project.creator?.bio) && (
              <p className="text-xs text-muted leading-relaxed line-clamp-2 bg-page p-3 rounded-xl border border-line">
                {creatorProfile?.bio || project.creator?.bio}
              </p>
            )}

            {/* Live Creator Backend Stats */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-page border border-line text-center">
                <div className="text-sm font-black text-heading">
                  {creatorProjects.length || 1}
                </div>
                <div className="text-[10px] text-muted">Projects</div>
              </div>
              <div className="p-2.5 rounded-xl bg-page border border-line text-center">
                <div className="text-sm font-black text-rose-400">
                  {creatorProjects.reduce(
                    (sum, p) => sum + (p.likesCount || 0),
                    0
                  ) || project.likesCount || 0}
                </div>
                <div className="text-[10px] text-muted">Total Likes</div>
              </div>
              <div className="p-2.5 rounded-xl bg-page border border-line text-center">
                <div className="text-sm font-black text-[#4FD1A5]">
                  {creatorProjects.reduce(
                    (sum, p) => sum + (p.views || 0),
                    0
                  ) || project.views || 0}
                </div>
                <div className="text-[10px] text-muted">Total Views</div>
              </div>
            </div>

            <Link
              to={`/profile/${creatorProfile?._id || project.creator?._id || project._id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0F6B4F] hover:bg-[#16805E] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <User size={14} />
              <span>View Developer Profile →</span>
            </Link>
          </div>

          {/* Tech Stack Card */}
          <div className="rounded-2xl bg-card border border-line p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Tech Stack & Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {(project.techStack || []).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-page text-[#4FD1A5] border border-[#0F6B4F]/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Tags Card */}
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="rounded-2xl bg-card border border-line p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                Topics & Domains
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs bg-soft text-muted border border-line"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Project Metrics Card */}
          <div className="rounded-2xl bg-card border border-line p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Project Telemetry
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-line">
                <span className="text-muted flex items-center gap-1.5">
                  <Eye size={14} /> Total Views
                </span>
                <span className="font-bold text-heading">
                  {project.views || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-line">
                <span className="text-muted flex items-center gap-1.5">
                  <Heart size={14} /> Likes
                </span>
                <span className="font-bold text-heading">
                  {project.likesCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-line">
                <span className="text-muted flex items-center gap-1.5">
                  <Bookmark size={14} /> Bookmarks
                </span>
                <span className="font-bold text-heading">
                  {project.bookmarksCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-line">
                <span className="text-muted flex items-center gap-1.5">
                  <MessageSquare size={14} /> Reviews
                </span>
                <span className="font-bold text-heading">
                  {comments.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-muted flex items-center gap-1.5">
                  <Calendar size={14} /> Published
                </span>
                <span className="font-bold text-heading">
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                    : 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

