import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineCube,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineX,
  HiOutlineCode,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineTag,
  HiOutlineClipboardCopy,
  HiOutlineCheck,
  HiOutlineChatAlt2,
  HiOutlineExternalLink,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlineUsers,
  HiOutlinePhotograph,
  HiOutlineLink,
  HiOutlineCloudUpload,
  HiOutlineStar,
  HiOutlinePlay,
} from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import api from '../services/api';

const CATEGORY_OPTIONS = [
  'Full Stack',
  'Web App',
  'AI / ML',
  'Internet Of Things',
  'Backend & API',
  'DevTools & CLI',
  'Mobile App',
  'System Design',
  'Open Source',
];

const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

const QUICK_TECH_SUGGESTIONS = [
  'React',
  'Node.js',
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'MongoDB',
  'PostgreSQL',
  'Redis',
  'Docker',
  'Tailwind CSS',
  'Express',
  'FastAPI',
  'Next.js',
  'WebSockets',
  'GraphQL',
];

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');
  const [contributorFilter, setContributorFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectComments, setProjectComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'media' | 'architecture'
  const [copiedSetup, setCopiedSetup] = useState(false);

  // Cover upload state
  const [coverInputMode, setCoverInputMode] = useState('link'); // 'link' | 'upload'
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const coverFileInputRef = useRef(null);
  const [techInput, setTechInput] = useState('');

  const initialFormState = {
    title: '',
    tagline: '',
    description: '',
    category: 'Full Stack',
    difficulty: 'Intermediate',
    techStack: ['React', 'Node.js'],
    tags: '',
    coverImage: '',
    screenshots: '',
    githubUrl: '',
    liveDemoUrl: '',
    videoDemoUrl: '',
    keyFeatures: '',
    architectureOverview: '',
    setupInstructions: '',
    lookingForContributors: false,
    isFeatured: false,
    status: 'Published',
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      const projectList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setProjects(projectList);
    } catch (err) {
      console.error('Failed to load projects in Dashboard', err);
      toast.error('Failed to fetch projects from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingId(project._id);
      setFormData({
        title: project.title || '',
        tagline: project.tagline || '',
        description: project.description || '',
        category: project.category || 'Full Stack',
        difficulty: project.difficulty || 'Intermediate',
        techStack: Array.isArray(project.techStack) ? project.techStack : [],
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
        coverImage: project.coverImage || '',
        screenshots: Array.isArray(project.screenshots)
          ? project.screenshots.join('\n')
          : (project.screenshots || ''),
        githubUrl: project.githubUrl || '',
        liveDemoUrl: project.liveDemoUrl || '',
        videoDemoUrl: project.videoDemoUrl || '',
        keyFeatures: Array.isArray(project.keyFeatures)
          ? project.keyFeatures.join('\n')
          : (project.keyFeatures || ''),
        architectureOverview: project.architectureOverview || '',
        setupInstructions: project.setupInstructions || '',
        lookingForContributors: Boolean(project.lookingForContributors),
        isFeatured: Boolean(project.isFeatured),
        status: project.status || 'Published',
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setTechInput('');
    setUploadedFileName('');
    setCoverInputMode('link');
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const fetchProjectComments = async (projectId) => {
    try {
      setLoadingComments(true);
      const res = await api.get(`/projects/${projectId}/comments`);
      setProjectComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setProjectComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleViewDetail = (project) => {
    setSelectedProject(project);
    setIsDetailOpen(true);
    fetchProjectComments(project._id);
  };

  const handleDeleteComment = async (commentId) => {
    if (!selectedProject) return;
    if (!window.confirm('Delete this project comment?')) return;
    try {
      await api.delete(`/projects/${selectedProject._id}/comments/${commentId}`);
      toast.success('Comment deleted');
      setProjectComments((prev) => prev.filter((c) => c._id !== commentId));
      setProjects((prev) =>
        prev.map((p) =>
          p._id === selectedProject._id
            ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 1) - 1) }
            : p
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleCopySetup = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedSetup(true);
    toast.success('Setup commands copied to clipboard!');
    setTimeout(() => setCopiedSetup(false), 2000);
  };

  const addTech = (tech) => {
    const clean = tech.trim();
    if (!clean) return;
    if (!formData.techStack.includes(clean)) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, clean],
      }));
    }
    setTechInput('');
  };

  const removeTech = (tech) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }));
  };

  const handleCoverFileUpload = async (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file format. Please upload JPG, PNG, WEBP, or GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image exceeds 5MB limit.');
      return;
    }

    try {
      setUploadingCover(true);
      const uploadForm = new FormData();
      uploadForm.append('image', file);
      const { data } = await api.post('/upload', uploadForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data?.url) {
        setFormData((prev) => ({ ...prev, coverImage: data.url }));
        setUploadedFileName(file.name);
        toast.success('Cover image uploaded!');
      }
    } catch (err) {
      // Fallback to data URL if upload endpoint fails
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, coverImage: reader.result }));
          setUploadedFileName(file.name);
          toast.success('Cover image loaded!');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.tagline.trim() || !formData.description.trim()) {
      toast.error('Project Title, Tagline, and Description are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        tagline: formData.tagline.trim(),
        description: formData.description.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        techStack: formData.techStack,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        coverImage: formData.coverImage.trim(),
        screenshots: formData.screenshots
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean),
        githubUrl: formData.githubUrl.trim(),
        liveDemoUrl: formData.liveDemoUrl.trim(),
        videoDemoUrl: formData.videoDemoUrl.trim(),
        keyFeatures: formData.keyFeatures
          .split(/\r?\n/)
          .map((f) => f.trim())
          .filter(Boolean),
        architectureOverview: formData.architectureOverview.trim(),
        setupInstructions: formData.setupInstructions.trim(),
        lookingForContributors: Boolean(formData.lookingForContributors),
        isFeatured: Boolean(formData.isFeatured),
        status: formData.status,
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        toast.success('Project updated successfully!');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created successfully!');
      }
      fetchProjects();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving project', err);
      toast.error(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, projectTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete project:\n"${projectTitle}"?\n\nThis will permanently remove the project and its comments.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully!');
      setProjects((prev) => prev.filter((p) => p._id !== id));
      if (selectedProject?._id === id) {
        setIsDetailOpen(false);
      }
    } catch (err) {
      console.error('Failed to delete project', err);
      toast.error(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      const updatedFeatured = !project.isFeatured;
      await api.put(`/projects/${project._id}`, { isFeatured: updatedFeatured });
      toast.success(
        updatedFeatured ? 'Project marked as Featured!' : 'Removed from Featured'
      );
      setProjects((prev) =>
        prev.map((p) => (p._id === project._id ? { ...p, isFeatured: updatedFeatured } : p))
      );
      if (selectedProject?._id === project._id) {
        setSelectedProject((prev) => ({ ...prev, isFeatured: updatedFeatured }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update featured status');
    }
  };

  const handleToggleContributors = async (project) => {
    try {
      const updatedContributors = !project.lookingForContributors;
      await api.put(`/projects/${project._id}`, {
        lookingForContributors: updatedContributors,
      });
      toast.success(
        updatedContributors
          ? 'Project marked as Open for Contributors'
          : 'Contributors badge disabled'
      );
      setProjects((prev) =>
        prev.map((p) =>
          p._id === project._id
            ? { ...p, lookingForContributors: updatedContributors }
            : p
        )
      );
      if (selectedProject?._id === project._id) {
        setSelectedProject((prev) => ({
          ...prev,
          lookingForContributors: updatedContributors,
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update contributor status');
    }
  };

  // Metrics Calculations
  const totalProjects = projects.length;
  const featuredProjects = projects.filter((p) => p.isFeatured).length;
  const contributorProjects = projects.filter((p) => p.lookingForContributors).length;
  const totalLikes = projects.reduce(
    (acc, p) => acc + (p.likesCount ?? p.likes?.length ?? 0),
    0
  );
  const totalBookmarks = projects.reduce(
    (acc, p) => acc + (p.bookmarksCount ?? p.bookmarks?.length ?? 0),
    0
  );
  const totalViews = projects.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalComments = projects.reduce((acc, p) => acc + (p.commentsCount || 0), 0);

  // Filtered & Sorted Projects
  const filteredProjects = projects
    .filter((p) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        p.title?.toLowerCase().includes(searchLower) ||
        p.tagline?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower) ||
        p.creator?.name?.toLowerCase().includes(searchLower) ||
        p.creatorName?.toLowerCase().includes(searchLower) ||
        (Array.isArray(p.techStack) &&
          p.techStack.some((t) => t.toLowerCase().includes(searchLower))) ||
        (Array.isArray(p.tags) &&
          p.tags.some((t) => t.toLowerCase().includes(searchLower)));

      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      const matchesFeatured =
        featuredFilter === 'All' ||
        (featuredFilter === 'Featured' && p.isFeatured) ||
        (featuredFilter === 'Standard' && !p.isFeatured);
      const matchesContributors =
        contributorFilter === 'All' ||
        (contributorFilter === 'Open' && p.lookingForContributors) ||
        (contributorFilter === 'Closed' && !p.lookingForContributors);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesFeatured &&
        matchesContributors
      );
    })
    .sort((a, b) => {
      if (sortBy === 'likes') {
        return (b.likesCount || 0) - (a.likesCount || 0);
      }
      if (sortBy === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === 'comments') {
        return (b.commentsCount || 0) - (a.commentsCount || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            className="page-title"
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <HiOutlineCube style={{ color: 'var(--accent-cyan)' }} /> Project Management Studio
          </h1>
          <p className="page-description">
            Monitor total projects, showcase featured engineering builds, and manage all community & admin projects on Project Hub.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={fetchProjects}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HiOutlineRefresh /> Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HiOutlinePlus /> Create Project
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Projects</span>
            <div
              className="stat-card-icon"
              style={{ background: 'rgba(0, 212, 255, 0.15)', color: '#00d4ff' }}
            >
              <HiOutlineCube size={22} />
            </div>
          </div>
          <div className="stat-card-value">{totalProjects}</div>
          <div className="stat-card-change" style={{ color: 'var(--text-secondary)' }}>
            Across {new Set(projects.map((p) => p.category).filter(Boolean)).size || 1} Categories
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Featured Projects</span>
            <div
              className="stat-card-icon"
              style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
            >
              <HiOutlineStar size={22} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: '#f59e0b' }}>
            {featuredProjects}
          </div>
          <div className="stat-card-change" style={{ color: 'var(--text-secondary)' }}>
            Highlighted on Project Hub
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Open to Contributors</span>
            <div
              className="stat-card-icon"
              style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
            >
              <HiOutlineUsers size={22} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: '#10b981' }}>
            {contributorProjects}
          </div>
          <div className="stat-card-change" style={{ color: 'var(--text-secondary)' }}>
            Active Collaboration Builds
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Likes & Bookmarks</span>
            <div
              className="stat-card-icon"
              style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}
            >
              <HiOutlineHeart size={22} />
            </div>
          </div>
          <div className="stat-card-value" style={{ color: '#fb7185' }}>
            {(totalLikes + totalBookmarks).toLocaleString()}
          </div>
          <div className="stat-card-change" style={{ color: 'var(--text-secondary)' }}>
            {totalLikes} Likes • {totalBookmarks} Saved
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Views & Feedback</span>
            <div
              className="stat-card-icon"
              style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa' }}
            >
              <HiOutlineEye size={22} />
            </div>
          </div>
          <div className="stat-card-value">{totalViews.toLocaleString()}</div>
          <div className="stat-card-change" style={{ color: 'var(--text-secondary)' }}>
            {totalComments} Community Reviews
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <HiOutlineSearch
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search projects by title, tech stack, category, or creator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ minWidth: '150px', flex: '1 1 150px' }}>
            <select
              className="form-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div style={{ minWidth: '140px', flex: '1 1 140px' }}>
            <select
              className="form-input"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Filter */}
          <div style={{ minWidth: '135px', flex: '1 1 135px' }}>
            <select
              className="form-input"
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
            >
              <option value="All">All Showcase</option>
              <option value="Featured">Featured Only</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          {/* Contributors Filter */}
          <div style={{ minWidth: '150px', flex: '1 1 150px' }}>
            <select
              className="form-input"
              value={contributorFilter}
              onChange={(e) => setContributorFilter(e.target.value)}
            >
              <option value="All">All Collaboration</option>
              <option value="Open">Open to Contributors</option>
              <option value="Closed">Solo / Closed</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ minWidth: '140px', flex: '1 1 140px' }}>
            <select
              className="form-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="likes">Sort: Most Liked</option>
              <option value="views">Sort: Most Viewed</option>
              <option value="comments">Sort: Most Discussed</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(search ||
            categoryFilter !== 'All' ||
            difficultyFilter !== 'All' ||
            featuredFilter !== 'All' ||
            contributorFilter !== 'All' ||
            sortBy !== 'newest') && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setDifficultyFilter('All');
                setFeaturedFilter('All');
                setContributorFilter('All');
                setSortBy('newest');
              }}
              style={{ fontSize: '13px', padding: '8px 12px' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <HiOutlineCube
            size={48}
            style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}
          />
          <h3
            style={{
              fontSize: '18px',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            No Projects Found
          </h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: '20px',
              maxWidth: '420px',
              margin: '0 auto 20px',
            }}
          >
            {projects.length === 0
              ? 'Get started by publishing your first engineering project to Project Hub.'
              : 'No projects match your current search or filter criteria.'}
          </p>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <HiOutlinePlus /> Create Project
          </button>
        </div>
      ) : (
        <div
          className="table-container"
          style={{ borderRadius: '16px', border: '1px solid var(--border-color)' }}
        >
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <th style={{ padding: '14px 16px', textAlign: 'left', minWidth: '280px' }}>
                  Project & Tech Stack
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>
                  Category & Level
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Creator</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Links</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Engagement</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>
                  Showcase / Collab
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => {
                const diffColor =
                  p.difficulty === 'Beginner'
                    ? '#10b981'
                    : p.difficulty === 'Advanced'
                    ? '#f43f5e'
                    : '#f59e0b';

                const creatorName = p.creator?.name || p.creatorName || 'Developer';
                const creatorEmail = p.creator?.email || 'builder@techjourney.dev';

                return (
                  <tr
                    key={p._id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.2s ease',
                    }}
                    className="table-row-hover"
                  >
                    {/* Project & Tech Stack */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        {p.coverImage ? (
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            style={{
                              width: '60px',
                              height: '44px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid rgba(255,255,255,0.1)',
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '60px',
                              height: '44px',
                              borderRadius: '8px',
                              background: 'rgba(0, 212, 255, 0.1)',
                              border: '1px solid rgba(0, 212, 255, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--accent-cyan)',
                              flexShrink: 0,
                            }}
                          >
                            <HiOutlineCube size={20} />
                          </div>
                        )}

                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: '600',
                              color: 'var(--text-primary)',
                              marginBottom: '3px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              flexWrap: 'wrap',
                            }}
                          >
                            <span>{p.title}</span>
                            {p.isFeatured && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  padding: '1px 6px',
                                  borderRadius: '6px',
                                  background: 'rgba(245, 158, 11, 0.15)',
                                  color: '#fbbf24',
                                  border: '1px solid rgba(245, 158, 11, 0.3)',
                                }}
                              >
                                ★ Featured
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'var(--text-secondary)',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: '1.4',
                            }}
                          >
                            {p.tagline || p.description}
                          </div>

                          {Array.isArray(p.techStack) && p.techStack.length > 0 && (
                            <div
                              style={{
                                display: 'flex',
                                gap: '4px',
                                flexWrap: 'wrap',
                                marginTop: '6px',
                              }}
                            >
                              {p.techStack.slice(0, 4).map((tech, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: '10px',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: 'rgba(0, 212, 255, 0.08)',
                                    color: '#38bdf8',
                                    border: '1px solid rgba(0, 212, 255, 0.15)',
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                              {p.techStack.length > 4 && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    color: 'var(--text-muted)',
                                    padding: '2px 4px',
                                  }}
                                >
                                  +{p.techStack.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category & Difficulty */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(124, 58, 237, 0.15)',
                            color: '#a78bfa',
                            display: 'inline-block',
                          }}
                        >
                          {p.category || 'Full Stack'}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: `${diffColor}22`,
                            color: diffColor,
                            border: `1px solid ${diffColor}44`,
                            display: 'inline-block',
                          }}
                        >
                          {p.difficulty || 'Intermediate'}
                        </span>
                      </div>
                    </td>

                    {/* Creator */}
                    <td style={{ padding: '14px 16px' }}>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                        }}
                      >
                        {creatorName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {creatorEmail}
                      </div>
                    </td>

                    {/* Links */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        {p.githubUrl ? (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub Repository"
                            style={{
                              color: '#e2e8f0',
                              padding: '5px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.06)',
                              display: 'inline-flex',
                            }}
                          >
                            <FaGithub size={14} />
                          </a>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
                        )}

                        {p.liveDemoUrl && (
                          <a
                            href={p.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Live Demo"
                            style={{
                              color: '#00d4ff',
                              padding: '5px',
                              borderRadius: '6px',
                              background: 'rgba(0, 212, 255, 0.1)',
                              display: 'inline-flex',
                            }}
                          >
                            <HiOutlineExternalLink size={15} />
                          </a>
                        )}

                        {p.videoDemoUrl && (
                          <a
                            href={p.videoDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Video Demo"
                            style={{
                              color: '#f43f5e',
                              padding: '5px',
                              borderRadius: '6px',
                              background: 'rgba(244, 63, 94, 0.1)',
                              display: 'inline-flex',
                            }}
                          >
                            <HiOutlinePlay size={15} />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Engagement Metrics */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '10px',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span
                          title="Likes"
                          style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          <HiOutlineHeart style={{ color: '#f43f5e' }} />{' '}
                          {p.likesCount ?? p.likes?.length ?? 0}
                        </span>
                        <span
                          title="Bookmarks"
                          style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          <HiOutlineBookmark style={{ color: '#f59e0b' }} />{' '}
                          {p.bookmarksCount ?? p.bookmarks?.length ?? 0}
                        </span>
                        <span
                          title="Comments"
                          style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          <HiOutlineChatAlt2 style={{ color: '#38bdf8' }} />{' '}
                          {p.commentsCount || 0}
                        </span>
                        <span
                          title="Views"
                          style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          <HiOutlineEye style={{ color: '#94a3b8' }} /> {p.views || 0}
                        </span>
                      </div>
                    </td>

                    {/* Showcase / Collab Toggles */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          alignItems: 'center',
                        }}
                      >
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          title="Click to toggle Featured status"
                          style={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 9px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: p.isFeatured
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(255, 255, 255, 0.04)',
                            color: p.isFeatured ? '#fbbf24' : 'var(--text-secondary)',
                            border: p.isFeatured
                              ? '1px solid rgba(245, 158, 11, 0.35)'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <HiOutlineStar /> {p.isFeatured ? 'Featured' : 'Standard'}
                        </button>

                        <button
                          onClick={() => handleToggleContributors(p)}
                          title="Click to toggle Open for Contributors"
                          style={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 9px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: p.lookingForContributors
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(255, 255, 255, 0.04)',
                            color: p.lookingForContributors
                              ? '#10b981'
                              : 'var(--text-muted)',
                            border: p.lookingForContributors
                              ? '1px solid rgba(16, 185, 129, 0.35)'
                              : '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          <HiOutlineUsers />{' '}
                          {p.lookingForContributors ? 'Collab Open' : 'Solo'}
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon"
                          onClick={() => handleViewDetail(p)}
                          title="Inspect Project & Comments"
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: 'var(--accent-cyan)',
                            cursor: 'pointer',
                          }}
                        >
                          <HiOutlineEye size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleOpenModal(p)}
                          title="Edit Project"
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: '#a78bfa',
                            cursor: 'pointer',
                          }}
                        >
                          <HiOutlinePencilAlt size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(p._id, p.title)}
                          title="Delete Project"
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(244, 63, 94, 0.1)',
                            border: '1px solid rgba(244, 63, 94, 0.2)',
                            borderRadius: '6px',
                            color: '#f43f5e',
                            cursor: 'pointer',
                          }}
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── CREATE / EDIT PROJECT MODAL ────────────────────────────── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '860px',
              width: '95%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '20px',
              background: '#121224',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              padding: '0',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <HiOutlineCube style={{ color: 'var(--accent-cyan)' }} />
                  {editingId ? 'Edit Project Showcase' : 'Create New Project'}
                </h2>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginTop: '2px',
                  }}
                >
                  Configure project metadata, cover visuals, repository links, and architecture documentation.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                }}
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-color)',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '0 24px',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                style={{
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom:
                    activeTab === 'basic'
                      ? '2px solid var(--accent-cyan)'
                      : '2px solid transparent',
                  color:
                    activeTab === 'basic'
                      ? 'var(--accent-cyan)'
                      : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                1. Overview & Tech Stack
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                style={{
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom:
                    activeTab === 'media'
                      ? '2px solid var(--accent-cyan)'
                      : '2px solid transparent',
                  color:
                    activeTab === 'media'
                      ? 'var(--accent-cyan)'
                      : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                2. Cover Image & Links
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('architecture')}
                style={{
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom:
                    activeTab === 'architecture'
                      ? '2px solid var(--accent-cyan)'
                      : '2px solid transparent',
                  color:
                    activeTab === 'architecture'
                      ? 'var(--accent-cyan)'
                      : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                3. Architecture & Setup
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {/* TAB 1: BASIC INFO & TECH STACK */}
              {activeTab === 'basic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>
                      Project Title <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CloudPulse — Distributed Microservices Telemetry & APM"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>
                      Short Tagline <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="A concise one-sentence pitch explaining what this project does..."
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        className="form-input"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Complexity Level</label>
                      <select
                        className="form-input"
                        value={formData.difficulty}
                        onChange={(e) =>
                          setFormData({ ...formData, difficulty: e.target.value })
                        }
                      >
                        {DIFFICULTY_OPTIONS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Visibility Status</label>
                      <select
                        className="form-input"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Tech Stack Builder */}
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>
                      Tech Stack
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Add technology (e.g. React, Docker, Redis)..."
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTech(techInput);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => addTech(techInput)}
                      >
                        Add
                      </button>
                    </div>

                    {formData.techStack.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '6px',
                          flexWrap: 'wrap',
                          marginBottom: '10px',
                        }}
                      >
                        {formData.techStack.map((tech) => (
                          <span
                            key={tech}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: 'rgba(0, 212, 255, 0.12)',
                              color: 'var(--accent-cyan)',
                              border: '1px solid rgba(0, 212, 255, 0.25)',
                            }}
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => removeTech(tech)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'inline-flex',
                              }}
                            >
                              <HiOutlineX size={13} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {QUICK_TECH_SUGGESTIONS.filter(
                        (s) => !formData.techStack.includes(s)
                      )
                        .slice(0, 10)
                        .map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => addTech(suggestion)}
                            style={{
                              fontSize: '11px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            + {suggestion}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tags (comma-separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Microservices, Observability, Open Source, Cloud"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>

                  {/* Switches */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'rgba(245, 158, 11, 0.06)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData({ ...formData, isFeatured: e.target.checked })
                        }
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#fbbf24' }}>
                          Featured Project
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          Pin to top of Project Hub showcase
                        </div>
                      </div>
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'rgba(16, 185, 129, 0.06)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.lookingForContributors}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lookingForContributors: e.target.checked,
                          })
                        }
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#10b981' }}>
                          Open for Contributors
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          Invite community developers to collaborate
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: COVER IMAGE & LINKS */}
              {activeTab === 'media' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
                        Cover Image (URL Link or Upload)
                      </label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setCoverInputMode('link')}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            borderColor:
                              coverInputMode === 'link'
                                ? 'var(--accent-cyan)'
                                : 'var(--border-color)',
                            color:
                              coverInputMode === 'link'
                                ? 'var(--accent-cyan)'
                                : 'var(--text-secondary)',
                          }}
                        >
                          <HiOutlineLink /> Image Link
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setCoverInputMode('upload')}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            borderColor:
                              coverInputMode === 'upload'
                                ? 'var(--accent-cyan)'
                                : 'var(--border-color)',
                            color:
                              coverInputMode === 'upload'
                                ? 'var(--accent-cyan)'
                                : 'var(--text-secondary)',
                          }}
                        >
                          <HiOutlineCloudUpload /> Upload File
                        </button>
                      </div>
                    </div>

                    {coverInputMode === 'link' ? (
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.coverImage}
                        onChange={(e) =>
                          setFormData({ ...formData, coverImage: e.target.value })
                        }
                      />
                    ) : (
                      <div
                        onClick={() =>
                          !uploadingCover && coverFileInputRef.current?.click()
                        }
                        style={{
                          border: '2px dashed rgba(0, 212, 255, 0.3)',
                          borderRadius: '12px',
                          padding: '24px',
                          textAlign: 'center',
                          cursor: uploadingCover ? 'wait' : 'pointer',
                          background: 'rgba(0, 212, 255, 0.03)',
                        }}
                      >
                        <input
                          ref={coverFileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCoverFileUpload(file);
                            e.target.value = '';
                          }}
                        />
                        <HiOutlineCloudUpload
                          size={30}
                          style={{ color: 'var(--accent-cyan)', marginBottom: '6px' }}
                        />
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {uploadingCover
                            ? 'Uploading cover image...'
                            : uploadedFileName
                            ? `Uploaded: ${uploadedFileName}`
                            : 'Click to upload cover image (JPG, PNG, WEBP, GIF up to 5MB)'}
                        </div>
                      </div>
                    )}

                    {formData.coverImage && (
                      <div
                        style={{
                          marginTop: '12px',
                          position: 'relative',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid var(--border-color)',
                          maxHeight: '180px',
                        }}
                      >
                        <img
                          src={formData.coverImage}
                          alt="Cover preview"
                          style={{
                            width: '100%',
                            height: '180px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, coverImage: '' });
                            setUploadedFileName('');
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(15, 15, 30, 0.85)',
                            color: '#f43f5e',
                            border: '1px solid rgba(244, 63, 94, 0.4)',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Remove Cover
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">GitHub Repository URL</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://github.com/username/repo"
                        value={formData.githubUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, githubUrl: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Live Demo URL</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://my-project.vercel.app"
                        value={formData.liveDemoUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, liveDemoUrl: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Video Demo URL <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Optional: YouTube or Loom walkthrough link"
                        value={formData.videoDemoUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, videoDemoUrl: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Additional Screenshots (One image URL per line)
                    </label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder={`https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2...`}
                      value={formData.screenshots}
                      onChange={(e) =>
                        setFormData({ ...formData, screenshots: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: DESCRIPTION, ARCHITECTURE & SETUP */}
              {activeTab === 'architecture' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>
                      Full Project Description (Markdown Supported){' '}
                      <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <textarea
                      className="form-input"
                      rows={6}
                      placeholder="Explain the problem solved, core capabilities, and technical highlights..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Key Engineering Features (One feature per line)
                    </label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder={`Sub-second distributed trace ingestion\nReal-time WebSocket anomaly alerting\nRole-based access control`}
                      value={formData.keyFeatures}
                      onChange={(e) =>
                        setFormData({ ...formData, keyFeatures: e.target.value })
                      }
                    />
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">System Architecture Overview</label>
                      <textarea
                        className="form-input"
                        rows={4}
                        placeholder="Describe data flow, backend services, caching, or database design..."
                        value={formData.architectureOverview}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            architectureOverview: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Local Setup Instructions</label>
                      <textarea
                        className="form-input"
                        rows={4}
                        style={{
                          fontFamily: 'Consolas, Monaco, monospace',
                          fontSize: '12px',
                          background: '#090912',
                        }}
                        placeholder={`git clone https://github.com/...\nnpm install\nnpm run dev`}
                        value={formData.setupInstructions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            setupInstructions: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeTab !== 'basic' && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        setActiveTab(activeTab === 'architecture' ? 'media' : 'basic')
                      }
                    >
                      Previous Step
                    </button>
                  )}
                  {activeTab !== 'architecture' && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        setActiveTab(activeTab === 'basic' ? 'media' : 'architecture')
                      }
                    >
                      Next Step
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting
                      ? 'Saving...'
                      : editingId
                      ? 'Update Project'
                      : 'Publish Project'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── PROJECT INSPECT & COMMENTS MODAL ───────────────────────── */}
      {isDetailOpen && selectedProject && (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '840px',
              width: '95%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '20px',
              background: '#121224',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              padding: '24px',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(0, 212, 255, 0.15)',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    {selectedProject.category}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(124, 58, 237, 0.15)',
                      color: '#a78bfa',
                    }}
                  >
                    {selectedProject.difficulty}
                  </span>
                  {selectedProject.isFeatured && (
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#fbbf24',
                      }}
                    >
                      ★ Featured
                    </span>
                  )}
                  {selectedProject.lookingForContributors && (
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                      }}
                    >
                      Open for Contributors
                    </span>
                  )}
                </div>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                  }}
                >
                  {selectedProject.title}
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginTop: '4px',
                  }}
                >
                  {selectedProject.tagline}
                </p>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <HiOutlineX size={22} />
              </button>
            </div>

            {/* Cover Banner */}
            {selectedProject.coverImage && (
              <div
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  border: '1px solid var(--border-color)',
                  maxHeight: '240px',
                }}
              >
                <img
                  src={selectedProject.coverImage}
                  alt={selectedProject.title}
                  style={{
                    width: '100%',
                    height: '240px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            )}

            {/* Quick Action Links */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '16px',
              }}
            >
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FaGithub /> GitHub Repository
                </a>
              )}
              {selectedProject.liveDemoUrl && (
                <a
                  href={selectedProject.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <HiOutlineExternalLink /> Live Demo
                </a>
              )}
              {selectedProject.videoDemoUrl && (
                <a
                  href={selectedProject.videoDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <HiOutlinePlay /> Video Demo
                </a>
              )}
            </div>

            {/* Tech Stack */}
            {Array.isArray(selectedProject.techStack) &&
              selectedProject.techStack.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                    marginBottom: '16px',
                  }}
                >
                  {selectedProject.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'rgba(0, 212, 255, 0.1)',
                        color: '#38bdf8',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

            {/* Description */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '16px',
                lineHeight: '1.6',
                color: 'var(--text-primary)',
                whiteSpace: 'pre-line',
                fontSize: '14px',
              }}
            >
              {selectedProject.description}
            </div>

            {/* Key Features */}
            {Array.isArray(selectedProject.keyFeatures) &&
              selectedProject.keyFeatures.length > 0 && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.04)',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.18)',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#10b981',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    Key Engineering Features
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-primary)', fontSize: '13px' }}>
                    {selectedProject.keyFeatures.map((feat, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Setup Instructions */}
            {selectedProject.setupInstructions && (
              <div style={{ marginBottom: '18px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Quick Start / Setup Commands:
                  </span>
                  <button
                    onClick={() => handleCopySetup(selectedProject.setupInstructions)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedSetup ? <HiOutlineCheck /> : <HiOutlineClipboardCopy />}{' '}
                    {copiedSetup ? 'Copied' : 'Copy Commands'}
                  </button>
                </div>
                <pre
                  style={{
                    background: '#090912',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    overflowX: 'auto',
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '12px',
                    color: '#e2e8f0',
                  }}
                >
                  {selectedProject.setupInstructions}
                </pre>
              </div>
            )}

            {/* Project Comments Moderation */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <HiOutlineChatAlt2 style={{ color: 'var(--accent-cyan)' }} />
                Project Reviews & Comments ({projectComments.length})
              </div>

              {loadingComments ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Loading comments...
                </div>
              ) : projectComments.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  No comments posted on this project yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {projectComments.map((c) => (
                    <div
                      key={c._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                          {c.user?.name || 'User'}{' '}
                          <span
                            style={{
                              fontSize: '10px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: 'rgba(0, 212, 255, 0.12)',
                              color: 'var(--accent-cyan)',
                              marginLeft: '6px',
                            }}
                          >
                            {c.feedbackType || 'General'}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            marginTop: '3px',
                          }}
                        >
                          {c.text}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        title="Delete Comment"
                        style={{
                          background: 'rgba(244, 63, 94, 0.12)',
                          border: '1px solid rgba(244, 63, 94, 0.25)',
                          color: '#f43f5e',
                          borderRadius: '6px',
                          padding: '4px 6px',
                          cursor: 'pointer',
                        }}
                      >
                        <HiOutlineTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Created by{' '}
                <strong>
                  {selectedProject.creator?.name ||
                    selectedProject.creatorName ||
                    'Developer'}
                </strong>{' '}
                •{' '}
                {selectedProject.createdAt
                  ? new Date(selectedProject.createdAt).toLocaleDateString()
                  : 'Recent'}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsDetailOpen(false);
                    handleOpenModal(selectedProject);
                  }}
                >
                  <HiOutlinePencilAlt /> Edit Project
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;

