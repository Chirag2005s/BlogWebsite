import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineTrash } from 'react-icons/hi';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/contact');
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      setError('Failed to load contact messages');
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id, currentStatus) => {
    try {
      const { data } = await api.put(`/contact/${id}`);
      if (data.success) {
        setMessages(messages.map(msg => msg._id === id ? { ...msg, isRead: !currentStatus } : msg));
        toast.success(data.message || 'Status updated');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HiOutlineMail className="text-primary-500" />
            Contact Messages
          </h1>
          <p className="page-description">Manage and respond to user inquiries.</p>
        </div>
      </div>

      {error ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-text">{error}</div>
          <button className="btn btn-primary" onClick={fetchMessages}>Retry</button>
        </div>
      ) : messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📬</div>
          <div className="empty-state-text">No contact messages found.</div>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-dark)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Sender</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Subject</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg._id} style={{ borderTop: '1px solid var(--border-color)', background: msg.isRead ? 'transparent' : 'rgba(16, 185, 129, 0.05)' }}>
                    <td style={{ padding: '16px' }}>
                      {msg.isRead ? (
                        <span className="badge badge-published" style={{ display: 'inline-flex', gap: '4px' }}>
                          <HiOutlineCheckCircle /> Read
                        </span>
                      ) : (
                        <span className="badge badge-draft" style={{ display: 'inline-flex', gap: '4px' }}>
                          <HiOutlineExclamationCircle /> Unread
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{msg.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{msg.email}</div>
                    </td>
                    <td style={{ padding: '16px', maxWidth: '300px' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{msg.subject || 'No Subject'}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.message}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => handleToggleRead(msg._id, msg.isRead)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Mark as {msg.isRead ? 'Unread' : 'Read'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
