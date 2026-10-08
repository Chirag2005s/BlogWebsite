import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Shield, Calendar, Edit3, Globe,
  CheckCircle2, AlertCircle, Loader2, Camera, Lock, Eye, EyeOff,
  Sparkles, Code2, BookOpen, Trophy, ArrowRight, Share2, Plus, X,
  FileText, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const GithubIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
];

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem('userInfo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const isOwnProfile = !id || (currentUser && (currentUser._id === id || currentUser.id === id));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'edit', 'articles', 'problems'
  const [showPassword, setShowPassword] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [profileData, setProfileData] = useState({
    _id: '',
    name: '',
    email: '',
    role: 'USER',
    bio: '',
    skills: [],
    experience: [],
    github: '',
    linkedin: '',
    profileImage: '',
    createdAt: null,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profileImage: '',
    github: '',
    linkedin: '',
    skills: [],
    password: '',
    confirmPassword: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [userArticles, setUserArticles] = useState([]);
  const [userProblems, setUserProblems] = useState([]);

  // Fetch Profile Data
  const fetchProfile = async () => {
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      let data = null;

      if (isOwnProfile) {
        if (!currentUser) {
          navigate('/login');
          return;
        }
        const res = await api.get('/auth/profile');
        data = res.data?.data || res.data;
      } else {
        // Fetch public profile by ID
        try {
          const res = await api.get(`/auth/user/${id}`);
          data = res.data?.data || res.data;
        } catch {
          // Fallback: try standard profile if viewing own with ID
          if (currentUser && currentUser._id === id) {
            const res = await api.get('/auth/profile');
            data = res.data?.data || res.data;
          }
        }
      }

      if (data) {
        const skillsList = Array.isArray(data.skills) 
          ? data.skills 
          : (data.skills ? data.skills.split(',').map(s => s.trim()) : []);

        const formatted = {
          _id: data._id || currentUser?._id || '',
          name: data.name || currentUser?.name || 'Developer',
          email: data.email || currentUser?.email || '',
          role: data.role || currentUser?.role || 'USER',
          bio: data.bio || '',
          skills: skillsList,
          experience: data.experience || [],
          github: data.github || '',
          linkedin: data.linkedin || '',
          profileImage: data.profileImage || '',
          createdAt: data.createdAt || currentUser?.createdAt || null,
        };

        setProfileData(formatted);
        setFormData({
          name: formatted.name,
          email: formatted.email,
          bio: formatted.bio,
          profileImage: formatted.profileImage,
          github: formatted.github,
          linkedin: formatted.linkedin,
          skills: [...skillsList],
          password: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // Fallback to local user info if available
      if (isOwnProfile && currentUser) {
        setProfileData(prev => ({
          ...prev,
          _id: currentUser._id,
          name: currentUser.name || 'Developer',
          email: currentUser.email || '',
          role: currentUser.role || 'USER',
        }));
        setFormData(prev => ({
          ...prev,
          name: currentUser.name || '',
          email: currentUser.email || '',
        }));
      } else {
        setFeedback({
          type: 'error',
          message: err.response?.data?.message || 'Could not load user profile details.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch articles and problems created by this user
  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        const targetUserId = isOwnProfile ? currentUser?._id : id;
        if (!targetUserId) return;

        // Fetch articles
        try {
          const { data: articles } = await api.get('/articles');
          if (Array.isArray(articles)) {
            const userOwned = articles.filter(a => 
              String(a.author?._id || a.author) === String(targetUserId)
            );
            setUserArticles(userOwned);
          }
        } catch {
          // Ignore error
        }

        // Fetch problems
        try {
          const { data: problems } = await api.get('/problems');
          if (Array.isArray(problems)) {
            const userOwned = problems.filter(p => 
              String(p.creator?._id || p.creator) === String(targetUserId)
            );
            setUserProblems(userOwned);
          }
        } catch {
          // Ignore error
        }
      } catch (e) {
        console.warn('Content fetch failed:', e);
      }
    };

    fetchProfile();
    fetchUserContent();
  }, [id, isOwnProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const clean = skillInput.trim();
    if (clean && !formData.skills.includes(clean)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, clean] }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handlePresetSelect = (url) => {
    setFormData(prev => ({ ...prev, profileImage: url }));
  };

  const handleShareProfile = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (!formData.name.trim()) {
      setFeedback({ type: 'error', message: 'Name cannot be empty.' });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setFeedback({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim(),
        profileImage: formData.profileImage.trim(),
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
        skills: formData.skills,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await api.put('/auth/profile', payload);
      const updated = res.data?.data || res.data;

      // Update local storage
      if (currentUser) {
        const newLocal = {
          ...currentUser,
          name: updated.name || payload.name,
          email: updated.email || payload.email,
          role: updated.role || currentUser.role,
          profileImage: updated.profileImage || payload.profileImage,
        };
        localStorage.setItem('userInfo', JSON.stringify(newLocal));
        // Notify any listening components (like navbar)
        window.dispatchEvent(new Event('authChange'));
      }

      setProfileData(prev => ({
        ...prev,
        ...payload,
        name: updated.name || payload.name,
        email: updated.email || payload.email,
        role: updated.role || prev.role,
        profileImage: updated.profileImage || payload.profileImage,
      }));

      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));

      setFeedback({
        type: 'success',
        message: 'Profile updated successfully!',
      });

      // Switch back to overview after brief delay
      setTimeout(() => {
        setActiveTab('overview');
      }, 1200);
    } catch (err) {
      console.error('Update failed:', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const userInitial = (profileData.name || 'User').charAt(0).toUpperCase();
  const joinDate = profileData.createdAt 
    ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Member';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#0F6B4F] animate-spin mb-4" />
        <p className="text-sm font-mono text-muted">Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* ═══ TOP HERO BANNER & AVATAR ═══ */}
      <div className="relative rounded-3xl overflow-hidden border border-line bg-card mb-8 shadow-xl">
        {/* Cover Background Graphic */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-[#07241B] via-[#0F6B4F]/40 to-[#0A192F] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#2BAF85_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#0F6B4F]/30 rounded-full blur-3xl" />
          <div className="absolute left-1/3 -bottom-16 w-64 h-64 bg-[#16805E]/20 rounded-full blur-3xl" />
        </div>

        {/* Profile Details Bar */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden bg-card border-4 border-card shadow-2xl relative flex items-center justify-center">
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#0F6B4F] to-[#2BAF85] flex items-center justify-center text-4xl sm:text-5xl font-extrabold text-white">
                    {userInitial}
                  </div>
                )}
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab('edit')}
                  className="absolute bottom-1 right-1 p-2.5 rounded-2xl bg-[#0F6B4F] hover:bg-[#16805E] text-white shadow-lg border border-white/20 transition-all hover:scale-110"
                  title="Change avatar in edit mode"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>

            <div className="space-y-1.5 pb-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">
                  {profileData.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  profileData.role === 'ADMIN'
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : profileData.role === 'AUTHOR'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-[#0F6B4F]/15 text-[#4FD1A5] border-[#0F6B4F]/30'
                }`}>
                  {profileData.role}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted flex items-center justify-center sm:justify-start gap-2">
                <Mail size={14} className="text-muted" />
                <span>{profileData.email}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted pt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-[#0F6B4F]" />
                  Joined {joinDate}
                </span>
                {profileData.github && (
                  <a
                    href={profileData.github.startsWith('http') ? profileData.github : `https://github.com/${profileData.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-heading transition-colors"
                  >
                    <GithubIcon size={13} />
                    GitHub
                  </a>
                )}
                {profileData.linkedin && (
                  <a
                    href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://linkedin.com/in/${profileData.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[#0A66C2] transition-colors"
                  >
                    <LinkedinIcon size={13} />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center sm:justify-end gap-3 pt-2">
            <button
              onClick={handleShareProfile}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-soft hover:bg-line border border-line text-xs font-semibold text-heading transition-all shadow-sm"
              title="Share profile link"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 size={14} className="text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share</span>
                </>
              )}
            </button>

            {isOwnProfile && (
              <button
                onClick={() => setActiveTab(activeTab === 'edit' ? 'overview' : 'edit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  activeTab === 'edit'
                    ? 'bg-soft border border-line text-heading hover:bg-line'
                    : 'bg-[#0F6B4F] hover:bg-[#16805E] text-white shadow-emerald-900/30'
                }`}
              >
                <Edit3 size={14} />
                <span>{activeTab === 'edit' ? 'View Profile' : 'Edit Profile'}</span>
              </button>
            )}

            {isOwnProfile && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card hover:bg-soft border border-[#0F6B4F]/40 text-[#4FD1A5] text-xs font-semibold transition-all shadow-sm"
              >
                <span>Content Studio</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-t border-line px-6 sm:px-10 overflow-x-auto scrollbar-hide bg-card/50">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            ...(isOwnProfile ? [{ id: 'edit', label: 'Edit Profile & Security', icon: Edit3 }] : []),
            { id: 'articles', label: 'Publications', count: userArticles.length, icon: BookOpen },
            { id: 'problems', label: 'ProblemHub', count: userProblems.length, icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  active
                    ? 'border-[#0F6B4F] text-[#4FD1A5]'
                    : 'border-transparent text-muted hover:text-heading hover:bg-soft/40'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    active ? 'bg-[#0F6B4F]/20 text-[#4FD1A5]' : 'bg-soft text-muted'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ FEEDBACK NOTIFICATION ═══ */}
      <AnimatePresence>
        {feedback.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl mb-6 border flex items-center gap-3 text-sm ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium">{feedback.message}</span>
            <button
              onClick={() => setFeedback({ type: '', message: '' })}
              className="ml-auto p-1 rounded-lg hover:bg-white/10"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ TAB CONTENT PANELS ═══ */}
      <AnimatePresence mode="wait">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column: Bio & Skills */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Card */}
              <div className="p-6 rounded-3xl bg-card border border-line shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-heading flex items-center gap-2">
                    <Sparkles size={16} className="text-[#0F6B4F]" />
                    About & Bio
                  </h3>
                  {isOwnProfile && (
                    <button
                      onClick={() => setActiveTab('edit')}
                      className="text-xs text-[#4FD1A5] hover:underline font-medium"
                    >
                      Edit Bio
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {profileData.bio || 'No bio provided yet. Click "Edit Profile" to share your developer story, areas of expertise, and current projects!'}
                </p>
              </div>

              {/* Skills Card */}
              <div className="p-6 rounded-3xl bg-card border border-line shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-heading flex items-center gap-2">
                    <Code2 size={16} className="text-[#16805E]" />
                    Skills & Tech Stack
                  </h3>
                  {isOwnProfile && (
                    <button
                      onClick={() => setActiveTab('edit')}
                      className="text-xs text-[#4FD1A5] hover:underline font-medium"
                    >
                      Manage Skills
                    </button>
                  )}
                </div>

                {profileData.skills && profileData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-soft border border-line text-heading hover:border-[#0F6B4F]/50 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F6B4F]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted py-2">
                    No technical skills added yet. Add languages, frameworks, or tools to highlight your profile!
                  </div>
                )}
              </div>

              {/* Recent Activity / Contributions */}
              <div className="p-6 rounded-3xl bg-card border border-line shadow-sm space-y-4">
                <h3 className="text-base font-bold text-heading flex items-center gap-2">
                  <BookOpen size={16} className="text-[#F4A62A]" />
                  Publications & Contributions
                </h3>

                {userArticles.length === 0 && userProblems.length === 0 ? (
                  <div className="text-center py-8 text-muted space-y-2">
                    <FileText size={28} className="mx-auto text-muted/60" />
                    <p className="text-sm font-medium">No published articles or problems yet.</p>
                    {isOwnProfile && (
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <Link
                          to="/admin"
                          className="px-3.5 py-1.5 rounded-xl bg-[#0F6B4F] text-white text-xs font-semibold hover:bg-[#16805E]"
                        >
                          Write Blog
                        </Link>
                        <Link
                          to="/problemhub/create"
                          className="px-3.5 py-1.5 rounded-xl bg-soft border border-line text-heading text-xs font-semibold hover:bg-line"
                        >
                          Post Problem
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userArticles.slice(0, 3).map((art) => (
                      <Link
                        key={art._id}
                        to={`/articles/${art.slug || art._id}`}
                        className="p-3.5 rounded-2xl bg-soft/50 hover:bg-soft border border-line/60 flex items-center justify-between gap-4 transition-all group block"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4FD1A5]">
                            {art.category || 'Technical Article'}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-heading group-hover:text-[#4FD1A5] transition-colors truncate">
                            {art.title}
                          </h4>
                        </div>
                        <ExternalLink size={14} className="text-muted group-hover:text-heading shrink-0" />
                      </Link>
                    ))}

                    {userProblems.slice(0, 3).map((prob) => (
                      <Link
                        key={prob._id}
                        to={`/problemhub/problem/${prob._id}`}
                        className="p-3.5 rounded-2xl bg-soft/50 hover:bg-soft border border-line/60 flex items-center justify-between gap-4 transition-all group block"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                            ProblemHub • {prob.difficulty || 'Medium'}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-heading group-hover:text-blue-400 transition-colors truncate">
                            {prob.title}
                          </h4>
                        </div>
                        <ExternalLink size={14} className="text-muted group-hover:text-heading shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Stats & Social Info */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="p-6 rounded-3xl bg-card border border-line shadow-sm space-y-4">
                <h3 className="text-base font-bold text-heading flex items-center gap-2">
                  <Trophy size={16} className="text-yellow-400" />
                  Developer Metrics
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-soft border border-line/70 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-heading font-mono">
                      {userArticles.length}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-muted mt-1">
                      Articles
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-soft border border-line/70 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-[#4FD1A5] font-mono">
                      {userProblems.length}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-muted mt-1">
                      Problems
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F6B4F]/10 border border-[#0F6B4F]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted">Community Standing</span>
                    <span className="text-[#4FD1A5]">Active Contributor</span>
                  </div>
                  <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0F6B4F] to-[#2BAF85] h-full w-4/5 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Connected Profiles Card */}
              <div className="p-6 rounded-3xl bg-card border border-line shadow-sm space-y-3">
                <h3 className="text-base font-bold text-heading flex items-center gap-2">
                  <Globe size={16} className="text-[#2BAF85]" />
                  Social Profiles
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-soft border border-line/60 text-xs">
                    <div className="flex items-center gap-2.5 text-heading font-medium">
                      <GithubIcon size={16} className="text-muted" />
                      <span>GitHub</span>
                    </div>
                    {profileData.github ? (
                      <a
                        href={profileData.github.startsWith('http') ? profileData.github : `https://github.com/${profileData.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4FD1A5] hover:underline font-mono"
                      >
                        @{profileData.github.replace(/^https?:\/\/github\.com\//, '')}
                      </a>
                    ) : (
                      <span className="text-muted italic">Not linked</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-soft border border-line/60 text-xs">
                    <div className="flex items-center gap-2.5 text-heading font-medium">
                      <LinkedinIcon size={16} className="text-[#0A66C2]" />
                      <span>LinkedIn</span>
                    </div>
                    {profileData.linkedin ? (
                      <a
                        href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://linkedin.com/in/${profileData.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4FD1A5] hover:underline font-mono"
                      >
                        Profile
                      </a>
                    ) : (
                      <span className="text-muted italic">Not linked</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. EDIT PROFILE TAB */}
        {activeTab === 'edit' && isOwnProfile && (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              {/* Basic Information Section */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-line shadow-sm space-y-6">
                <div className="border-b border-line pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-heading">Personal Information</h3>
                    <p className="text-xs text-muted">Update your display name, bio statement, and avatar.</p>
                  </div>
                  <span className="p-2 rounded-xl bg-soft text-[#0F6B4F]">
                    <User size={18} />
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-heading uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-2xl bg-soft border border-line text-heading text-sm focus:outline-none focus:border-[#0F6B4F] focus:ring-1 focus:ring-[#0F6B4F] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-heading uppercase tracking-wider">
                      Email Address (Read-only)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-2xl bg-soft/50 border border-line text-muted text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Avatar URL & Preset Selector */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-heading uppercase tracking-wider">
                    Profile Image URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleInputChange}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-4 py-3 rounded-2xl bg-soft border border-line text-heading text-sm focus:outline-none focus:border-[#0F6B4F] focus:ring-1 focus:ring-[#0F6B4F] transition-all"
                    />
                    {formData.profileImage && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, profileImage: '' }))}
                        className="px-3.5 py-2 rounded-2xl bg-soft border border-line text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Preset Avatars */}
                  <div className="pt-2">
                    <p className="text-xs text-muted mb-2 font-medium">Or pick an avatar preset:</p>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                      {AVATAR_PRESETS.map((presetUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePresetSelect(presetUrl)}
                          className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                            formData.profileImage === presetUrl
                              ? 'border-[#0F6B4F] ring-2 ring-[#0F6B4F]/40 scale-105'
                              : 'border-line opacity-70 hover:opacity-100 hover:border-slate-400'
                          }`}
                        >
                          <img src={presetUrl} alt={`Avatar preset ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-heading uppercase tracking-wider">
                      Developer Bio
                    </label>
                    <span className="text-[11px] text-muted">{formData.bio.length}/500</span>
                  </div>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    maxLength={500}
                    rows={4}
                    placeholder="Tell the community about your expertise, background, current stack, and what you are building..."
                    className="w-full px-4 py-3 rounded-2xl bg-soft border border-line text-heading text-sm focus:outline-none focus:border-[#0F6B4F] focus:ring-1 focus:ring-[#0F6B4F] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Skills Management Section */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-line shadow-sm space-y-6">
                <div className="border-b border-line pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-heading">Skills & Technologies</h3>
                    <p className="text-xs text-muted">Add technical tags and programming frameworks you work with.</p>
                  </div>
                  <span className="p-2 rounded-xl bg-soft text-[#16805E]">
                    <Code2 size={18} />
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="e.g. React, TypeScript, Node.js, Docker, MongoDB"
                      className="flex-1 px-4 py-3 rounded-2xl bg-soft border border-line text-heading text-sm focus:outline-none focus:border-[#0F6B4F] transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-5 py-3 rounded-2xl bg-[#0F6B4F] hover:bg-[#16805E] text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Plus size={15} /> Add
                    </button>
                  </div>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-soft border border-line text-heading flex items-center gap-2 group hover:border-rose-500/40 transition-all"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-muted group-hover:text-rose-400 p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {formData.skills.length === 0 && (
                      <span className="text-xs text-muted italic">No skills added yet. Type above and press Add!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-line shadow-sm space-y-6">
                <div className="border-b border-line pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-heading">Social Profiles & Portfolios</h3>
                    <p className="text-xs text-muted">Link your GitHub and professional profiles.</p>
                  </div>
                  <span className="p-2 rounded-xl bg-soft text-[#2BAF85]">
                    <Globe size={18} />
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-heading uppercase tracking-wider flex items-center gap-1.5">
                      <GithubIcon size={14} /> GitHub Profile URL or Username
                    </label>
                    <input
                      type="text"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="e.g. chirag2005 or https://github.com/chirag2005"
                      className="w-full px-4 py-3 rounded-2xl bg-soft border border-line text-heading text-sm focus:outline-none focus:border-[#0F6B4F] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-heading uppercase tracking-wider flex items-center gap-1.5">
                      <LinkedinIcon size={14} /> LinkedIn Profile URL or Username
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="e.g. linkedin.com/in/username"
                      className="w-full px-4 py-3 rounded-2xl bg-soft border border-line text-heading text-sm focus:outline-none focus:border-[#0F6B4F] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Change Password (Optional) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-line shadow-sm space-y-6">
                <div className="border-b border-line pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-heading">Security & Password</h3>
                    <p className="text-xs text-muted">Leave fields blank if you do not want to change your password.</p>
                  </div>
                  <span className="p-2 rounded-xl bg-soft text-yellow-400">
                    <Lock size={18} />
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-heading uppercase tracking-wider">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-2xl bg-soft border border-line text-heading text-sm focus:outline-none focus:border-[#0F6B4F] transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-heading"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-heading uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-2xl bg-soft border border-line text-heading text-sm focus:outline-none focus:border-[#0F6B4F] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-6 py-3 rounded-2xl bg-soft hover:bg-line border border-line text-xs font-semibold text-heading transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#0F6B4F] hover:bg-[#16805E] text-white text-xs font-bold transition-all shadow-xl shadow-emerald-900/30 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* 3. PUBLICATIONS TAB */}
        {activeTab === 'articles' && (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {userArticles.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-card border border-line text-muted space-y-3">
                <BookOpen size={36} className="mx-auto text-muted/60" />
                <h3 className="text-base font-bold text-heading">No publications yet</h3>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Author technical guides, blog posts, and programming insights to share with the TechJourney network.
                </p>
                {isOwnProfile && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F6B4F] text-white text-xs font-semibold hover:bg-[#16805E] mt-2"
                  >
                    Write an Article
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userArticles.map((art) => (
                  <div
                    key={art._id}
                    className="p-5 rounded-2xl bg-card border border-line hover:border-[#0F6B4F] transition-all shadow-sm flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#4FD1A5] uppercase mb-2">
                        <span>{art.category || 'Article'}</span>
                        <span className="text-muted font-normal">
                          {new Date(art.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        to={`/articles/${art.slug || art._id}`}
                        className="text-base font-bold text-heading group-hover:text-[#4FD1A5] transition-colors line-clamp-2 mb-2 block"
                      >
                        {art.title}
                      </Link>
                      <p className="text-xs text-muted line-clamp-2 mb-4">
                        {art.excerpt || art.description || 'Read complete technical publication on TechJourney.'}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                      <span className="text-muted">{art.views || 0} reads</span>
                      <Link
                        to={`/articles/${art.slug || art._id}`}
                        className="text-[#4FD1A5] font-semibold flex items-center gap-1 hover:underline"
                      >
                        Read Post <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 4. PROBLEMHUB TAB */}
        {activeTab === 'problems' && (
          <motion.div
            key="problems"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            {userProblems.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-card border border-line text-muted space-y-3">
                <Code2 size={36} className="mx-auto text-muted/60" />
                <h3 className="text-base font-bold text-heading">No ProblemHub questions posted</h3>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Submit algorithm challenges or real-world debugging scenarios to test the community.
                </p>
                {isOwnProfile && (
                  <Link
                    to="/problemhub/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F6B4F] text-white text-xs font-semibold hover:bg-[#16805E] mt-2"
                  >
                    Post a Problem
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProblems.map((prob) => (
                  <div
                    key={prob._id}
                    className="p-5 rounded-2xl bg-card border border-line hover:border-blue-500/40 transition-all shadow-sm flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase">
                          {prob.difficulty || 'Medium'}
                        </span>
                        {prob.language && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-soft text-muted">
                            {prob.language}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/problemhub/problem/${prob._id}`}
                        className="text-base font-bold text-heading group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 block"
                      >
                        {prob.title}
                      </Link>
                      <p className="text-xs text-muted line-clamp-2 mb-4">
                        {prob.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                      <span className="text-muted">{prob.solutionsCount || 0} solutions</span>
                      <Link
                        to={`/problemhub/problem/${prob._id}`}
                        className="text-blue-400 font-semibold flex items-center gap-1 hover:underline"
                      >
                        View Problem <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
