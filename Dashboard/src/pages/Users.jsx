import { useState, useEffect } from 'react';
import { HiOutlineTrash, HiOutlineSearch, HiOutlineShieldCheck } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated');
      setUsers(prev =>
        prev.map(u => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User removed successfully');
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-description">
          Manage system users, change roles, or remove accounts. (Admin only)
        </p>
      </div>

      <div className="content-table-wrapper">
        <div className="table-header">
          <div className="table-title">All Users ({filteredUsers.length})</div>
          <div className="table-actions">
            <div className="table-search">
              <HiOutlineSearch className="table-search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="table-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="AUTHOR">Author</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-text">No users found.</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSelf = u._id === currentUser?._id;
                return (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm">
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {u.name} {isSelf && <span style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>(You)</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            @{u.username || u.name?.toLowerCase().replace(/\s+/g, '')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      {isSelf ? (
                        <span className="badge badge-admin">{u.role}</span>
                      ) : (
                        <select
                          className="role-select"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        >
                          <option value="USER">USER</option>
                          <option value="AUTHOR">AUTHOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      )}
                    </td>
                    <td>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td>
                      <div className="action-btns">
                        {!isSelf && (
                          <button
                            className="action-btn action-btn-delete"
                            title="Delete User"
                            onClick={() => handleDeleteUser(u._id, u.name)}
                          >
                            <HiOutlineTrash />
                          </button>
                        )}
                        {isSelf && (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            <HiOutlineShieldCheck style={{ verticalAlign: 'middle' }} /> Active
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
