import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Send,
  Image as ImageIcon,
  GitBranch,
  ExternalLink,
  PlayCircle,
  Layers,
  Terminal,
  Cpu,
  Users,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Upload,
  Link2,
  Trash2,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = [
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

export default function CreateProject() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [coverInputMode, setCoverInputMode] = useState('link'); // 'link' | 'upload'
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const coverFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
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
    keyFeatures: [],
    architectureOverview: '',
    setupInstructions: '',
    lookingForContributors: false,
  });

  useEffect(() => {
    if (isEditing && id) {
      const loadProject = async () => {
        try {
          setFetching(true);
          const { data } = await api.get(`/projects/${id}`);
          setFormData({
            title: data.title || '',
            tagline: data.tagline || '',
            description: data.description || '',
            category: data.category || 'Full Stack',
            difficulty: data.difficulty || 'Intermediate',
            techStack: Array.isArray(data.techStack) ? data.techStack : [],
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            coverImage: data.coverImage || '',
            screenshots: Array.isArray(data.screenshots)
              ? data.screenshots.join('\n')
              : '',
            githubUrl: data.githubUrl || '',
            liveDemoUrl: data.liveDemoUrl || '',
            videoDemoUrl: data.videoDemoUrl || '',
            keyFeatures: Array.isArray(data.keyFeatures)
              ? data.keyFeatures
              : [],
            architectureOverview: data.architectureOverview || '',
            setupInstructions: data.setupInstructions || '',
            lookingForContributors: Boolean(data.lookingForContributors),
          });
        } catch (err) {
          setError(
            err.response?.data?.message || 'Failed to load project for editing'
          );
        } finally {
          setFetching(false);
        }
      };
      loadProject();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const addTechTag = (tech) => {
    const clean = tech.trim();
    if (!clean) return;
    if (
      !formData.techStack.some((t) => t.toLowerCase() === clean.toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, clean],
      }));
    }
    setTechInput('');
  };

  const removeTechTag = (tech) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }));
  };

  const addFeatureItem = () => {
    const clean = featureInput.trim();
    if (!clean) return;
    setFormData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, clean],
    }));
    setFeatureInput('');
  };

  const removeFeatureItem = (idx) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== idx),
    }));
  };

  // Compress image client-side so cover images load fast and never exceed payload limits
  const compressImageToDataUrl = (file, maxWidth = 1024, quality = 0.78) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to decode image file.'));
        img.src = event.target?.result;
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });

  const processCoverFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, or GIF).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Cover image file size must be under 8 MB.');
      return;
    }

    setError('');
    setUploadingCover(true);
    setUploadedFileName(file.name);

    try {
      // 1. Try uploading to backend /api/upload endpoint first
      const uploadForm = new FormData();
      uploadForm.append('media', file);
      const { data } = await api.post('/upload', uploadForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data?.url) {
        const baseOrigin = (api.defaults.baseURL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
        const resolvedUrl = data.url.startsWith('http') ? data.url : `${baseOrigin}${data.url}`;
        setFormData((prev) => ({ ...prev, coverImage: resolvedUrl }));
        setUploadingCover(false);
        return;
      }
    } catch {
      // Fallback to optimized client-side image encoding if /api/upload is unavailable or restricted
    }

    try {
      const compressedDataUrl = await compressImageToDataUrl(file);
      setFormData((prev) => ({ ...prev, coverImage: compressedDataUrl }));
    } catch (err) {
      setError(err.message || 'Failed to process cover image.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCoverFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processCoverFile(file);
    }
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    setIsDraggingCover(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processCoverFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.title.trim() ||
      !formData.tagline.trim() ||
      !formData.description.trim()
    ) {
      setError('Please provide a Project Title, Tagline, and Description.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        videoDemoUrl: (formData.videoDemoUrl || '').trim(),
        status: 'Published',
      };

      if (isEditing) {
        const { data } = await api.put(`/projects/${id}`, payload);
        setSuccess('Project updated successfully!');
        setTimeout(() => {
          navigate(`/projecthub/project/${data._id || id}`);
        }, 700);
      } else {
        const { data } = await api.post('/projects', payload);
        setSuccess('Project published to Project Hub!');
        setTimeout(() => {
          navigate(`/projecthub/project/${data._id}`);
        }, 700);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to save project. Please check your inputs and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-page border border-line rounded-xl px-4 py-3 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-[#0F6B4F] focus:ring-1 focus:ring-[#0F6B4F] transition-all';

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-9 h-9 border-2 border-[#0F6B4F]/30 border-t-[#4FD1A5] rounded-full animate-spin mb-3" />
        <p className="text-muted text-sm">Loading project data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6">
        <Link
          to="/projecthub"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#4FD1A5] transition-colors mb-3"
        >
          <ChevronLeft size={16} />
          <span>Back to Project Hub</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
          {isEditing ? 'Update Engineering Project' : 'Submit a New Project'}
        </h1>
        <p className="text-muted text-sm mt-1">
          Share your project architecture, live demo, source code, and setup guide with the TechJourney developer community.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 px-5 py-4 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-4 text-sm">
          <CheckCircle size={18} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info Card */}
        <div className="rounded-2xl bg-card border border-line p-6 space-y-5">
          <h2 className="text-base font-bold text-heading flex items-center gap-2">
            <Layers size={18} className="text-[#4FD1A5]" />
            <span>1. Project Identity & Classification</span>
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. CloudPulse — Distributed Microservices Telemetry & APM"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Short Tagline / Elevator Pitch *
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="A concise 1-2 sentence summary of what your project does and why it matters."
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Complexity / Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Tech Stack Builder */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Tech Stack
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-[#0F6B4F]/20 text-[#4FD1A5] border border-[#0F6B4F]/40"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => removeTechTag(tech)}
                    className="hover:text-white cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechTag(techInput);
                  }
                }}
                placeholder="Type a technology (e.g. Rust, Kubernetes) and press Add..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => addTechTag(techInput)}
                className="px-4 py-2.5 rounded-xl bg-soft hover:bg-[#0F6B4F] text-heading hover:text-white text-xs font-bold border border-line transition-colors shrink-0 cursor-pointer"
              >
                Add Tech
              </button>
            </div>

            {/* <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] text-muted mr-1">Quick add:</span>
              {QUICK_TECH_SUGGESTIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => addTechTag(item)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-page hover:bg-soft text-muted hover:text-heading border border-line cursor-pointer"
                >
                  + {item}
                </button>
              ))}
            </div> */}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Domain Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. Microservices, OpenTelemetry, DevOps, Real-Time"
              className={inputClass}
            />
          </div>
        </div>

        {/* Links & Media Card */}
        <div className="rounded-2xl bg-card border border-line p-6 space-y-5">
          <h2 className="text-base font-bold text-heading flex items-center gap-2">
            <ExternalLink size={18} className="text-[#4FD1A5]" />
            <span>2. Repository, Demo Links & Visuals</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted mb-2">
                <GitBranch size={13} /> GitHub Repository URL
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/user/repo"
                className={inputClass}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted mb-2">
                <ExternalLink size={13} /> Live Demo URL
              </label>
              <input
                type="url"
                name="liveDemoUrl"
                value={formData.liveDemoUrl}
                onChange={handleChange}
                placeholder="https://myproject.vercel.app"
                className={inputClass}
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted mb-2">
                <span className="flex items-center gap-1.5">
                  <PlayCircle size={13} /> Video Demo URL
                </span>
                <span className="text-[10px] font-mono font-normal normal-case text-muted/80 bg-page px-2 py-0.5 rounded-md border border-line">
                  Optional
                </span>
              </label>
              <input
                type="text"
                name="videoDemoUrl"
                value={formData.videoDemoUrl}
                onChange={handleChange}
                placeholder="Optional (e.g. https://youtube.com/...)"
                className={inputClass}
              />
            </div>
          </div>

          {/* Cover Image Link & File Upload System */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                <ImageIcon size={13} className="text-[#4FD1A5]" />
                <span>Project Cover Image (Link or Upload)</span>
              </label>

              {/* Mode Switcher Tabs */}
              <div className="inline-flex items-center p-1 rounded-xl bg-page border border-line">
                <button
                  type="button"
                  onClick={() => setCoverInputMode('link')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${coverInputMode === 'link'
                      ? 'bg-[#0F6B4F] text-white shadow-sm'
                      : 'text-muted hover:text-heading'
                    }`}
                >
                  <Link2 size={12} />
                  <span>Cover Image Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoverInputMode('upload')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${coverInputMode === 'upload'
                      ? 'bg-[#0F6B4F] text-white shadow-sm'
                      : 'text-muted hover:text-heading'
                    }`}
                >
                  <Upload size={12} />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              ref={coverFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              onChange={handleCoverFileSelect}
              className="hidden"
            />

            {coverInputMode === 'link' ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Link2
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                  />
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage.startsWith('data:image/') ? '' : formData.coverImage}
                    onChange={(e) => {
                      setUploadedFileName('');
                      handleChange(e);
                    }}
                    placeholder="Paste Cover Image URL (e.g. https://images.unsplash.com/...)"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-soft hover:bg-[#0F6B4F] text-heading hover:text-white border border-line text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {uploadingCover ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Upload from Device</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingCover(true);
                }}
                onDragLeave={() => setIsDraggingCover(false)}
                onDrop={handleCoverDrop}
                onClick={() => coverFileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${isDraggingCover
                    ? 'border-[#4FD1A5] bg-[#0F6B4F]/15'
                    : 'border-line hover:border-[#0F6B4F] bg-page/70 hover:bg-soft/50'
                  }`}
              >
                {uploadingCover ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 size={28} className="text-[#4FD1A5] animate-spin" />
                    <p className="text-xs font-semibold text-heading">
                      Uploading & optimizing cover image...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-2xl bg-[#0F6B4F]/15 border border-[#0F6B4F]/30 flex items-center justify-center text-[#4FD1A5] mb-2.5">
                      <Upload size={20} />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-heading">
                      Click to upload cover image{' '}
                      <span className="text-muted font-normal">or drag and drop here</span>
                    </p>
                    <p className="text-[11px] text-muted mt-1">
                      Supports PNG, JPG, WEBP, or GIF (Recommended 16:9 ratio, up to 8 MB)
                    </p>
                    {uploadedFileName && (
                      <span className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0F6B4F]/20 text-[#4FD1A5] border border-[#0F6B4F]/30 text-[11px] font-mono">
                        <CheckCircle size={12} />
                        {uploadedFileName}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Live Cover Preview */}
            {formData.coverImage && (
              <div className="relative mt-3 h-48 sm:h-56 rounded-2xl overflow-hidden border border-line bg-soft group">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-mono text-emerald-300 border border-white/10 truncate max-w-[70%]">
                    {formData.coverImage.startsWith('data:image/') || uploadedFileName ? (
                      <>
                        <Upload size={11} />
                        <span>Uploaded: {uploadedFileName || 'Custom Cover Image'}</span>
                      </>
                    ) : (
                      <>
                        <Link2 size={11} />
                        <span className="truncate">{formData.coverImage}</span>
                      </>
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, coverImage: '' }));
                        setUploadedFileName('');
                        if (coverFileInputRef.current) {
                          coverFileInputRef.current.value = '';
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <Trash2 size={11} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Additional Screenshot URLs (one URL per line)
            </label>
            <textarea
              rows={2}
              name="screenshots"
              value={formData.screenshots}
              onChange={handleChange}
              placeholder="https://example.com/screen1.png&#10;https://example.com/screen2.png"
              className={inputClass}
            />
          </div>
        </div>

        {/* Documentation, Key Features & Architecture Card */}
        <div className="rounded-2xl bg-card border border-line p-6 space-y-5">
          <h2 className="text-base font-bold text-heading flex items-center gap-2">
            <Cpu size={18} className="text-[#4FD1A5]" />
            <span>3. Engineering Documentation & Setup</span>
          </h2>

          {/* Key Features List Builder */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Key Features Highlights
            </label>
            {formData.keyFeatures.length > 0 && (
              <div className="space-y-2 mb-3">
                {formData.keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-page border border-line text-xs text-heading"
                  >
                    <span>• {feat}</span>
                    <button
                      type="button"
                      onClick={() => removeFeatureItem(idx)}
                      className="text-muted hover:text-rose-400 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeatureItem();
                  }
                }}
                placeholder="e.g. Sub-second distributed trace ingestion over gRPC..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={addFeatureItem}
                className="px-4 py-2.5 rounded-xl bg-soft hover:bg-[#0F6B4F] text-heading hover:text-white text-xs font-bold border border-line transition-colors shrink-0 cursor-pointer flex items-center gap-1"
              >
                <Plus size={14} /> Add Feature
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted mb-2">
              <span>Full Project Description / README *</span>
              <span className="text-[#4FD1A5] normal-case font-semibold">
                Supports Markdown
              </span>
            </label>
            <textarea
              rows={8}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain the problem your project solves, how you built it, challenges overcome, and usage details..."
              className={`${inputClass} font-mono text-xs`}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
              System Architecture & Data Flow (Optional)
            </label>
            <textarea
              rows={4}
              name="architectureOverview"
              value={formData.architectureOverview}
              onChange={handleChange}
              placeholder="Describe the backend services, database schema, caching strategy, or data pipeline..."
              className={`${inputClass} font-mono text-xs`}
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted mb-2">
              <Terminal size={13} /> Local Setup & Installation Commands (Optional)
            </label>
            <textarea
              rows={4}
              name="setupInstructions"
              value={formData.setupInstructions}
              onChange={handleChange}
              placeholder={`git clone https://github.com/your-username/your-repo.git\ncd your-repo\nnpm install\nnpm run dev`}
              className={`${inputClass} font-mono text-xs`}
            />
          </div>

          {/* Open to Contributors Toggle */}
          <label className="flex items-center justify-between p-4 rounded-xl bg-page border border-line cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Users size={18} />
              </div>
              <div>
                <span className="block text-sm font-bold text-heading">
                  Open for Community Contributors
                </span>
                <span className="block text-xs text-muted">
                  Display a badge inviting other developers to submit PRs or collaborate on this project.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              name="lookingForContributors"
              checked={formData.lookingForContributors}
              onChange={handleChange}
              className="w-5 h-5 accent-[#0F6B4F] rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/projecthub"
            className="px-5 py-3 rounded-xl bg-card hover:bg-soft border border-line text-xs sm:text-sm font-semibold text-heading transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#0F6B4F] hover:bg-[#16805E] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0F6B4F]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send size={16} />
            <span>
              {loading
                ? isEditing
                  ? 'Updating...'
                  : 'Publishing...'
                : isEditing
                  ? 'Update Project'
                  : 'Publish Project'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

