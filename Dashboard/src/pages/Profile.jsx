import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    profileImage: '',
    github: '',
    linkedin: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        profileImage: user.profileImage || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        bio: form.bio,
        profileImage: form.profileImage,
        github: form.github,
        linkedin: form.linkedin,
      };
      if (form.password) {
        payload.password = form.password;
      }

      await api.put('/auth/profile', payload);
      toast.success('Profile updated successfully!');
      if (refreshProfile) {
        await refreshProfile();
      }
      setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Profile</h1>
        <p className="page-description">Manage your personal information, profile image, and credentials.</p>
      </div>

      <div className="profile-header">
        <div className="profile-avatar-lg">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            getInitials(user?.name)
          )}
        </div>
        <div className="profile-info">
          <h2>{user?.name || 'User'}</h2>
          <p>{user?.email}</p>
          <div style={{ marginTop: '8px' }}>
            <span className={`badge ${user?.role === 'ADMIN' ? 'badge-admin' : 'badge-author'}`}>
              {user?.role || 'AUTHOR'}
            </span>
          </div>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Bio</label>
            <textarea
              name="bio"
              className="form-textarea"
              style={{ minHeight: '100px' }}
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell readers about yourself, your tech focus, and experience..."
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Profile Image URL</label>
            <input
              type="url"
              name="profileImage"
              className="form-input"
              value={form.profileImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">GitHub Profile</label>
            <input
              type="text"
              name="github"
              className="form-input"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">LinkedIn Profile</label>
            <input
              type="text"
              name="linkedin"
              className="form-input"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving Changes...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
