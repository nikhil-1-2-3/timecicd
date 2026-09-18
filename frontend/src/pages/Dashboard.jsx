import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  CalendarCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await formService.getMySubmissions();
      if (response.success && Array.isArray(response.data)) {
        setSubmissions(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p>Review your schedule history and confirmed time slots</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchSubmissions}
            className="btn btn-secondary btn-sm"
            title="Refresh submissions"
          >
            <RefreshCw size={15} className={loading ? 'spin-icon' : ''} />
            <span>Refresh</span>
          </button>
          <Link to="/form" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>New Time Request</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <CalendarCheck size={24} />
          </div>
          <div>
            <div className="stat-number">{submissions.length}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'var(--success-light)', color: 'var(--success)' }}
          >
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-number">{submissions.length}</div>
            <div className="stat-label">Confirmed Slots</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'var(--primary-light)', color: 'var(--secondary)' }}
          >
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-number" style={{ fontSize: '1.25rem' }}>
              {submissions.length > 0
                ? submissions[0].confirmedTime || submissions[0].preferredTime
                : 'None'}
            </div>
            <div className="stat-label">Latest Confirmed Slot</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Submissions List / Table */}
      <div className="submissions-table-card">
        <div className="table-header-title">
          <h3>Your Submitted Requests & Confirmed Times</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {submissions.length} record{submissions.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center' }}>
            <div
              className="spinner spinner-primary"
              style={{ width: '32px', height: '32px', margin: '0 auto 1rem', borderWidth: '3px' }}
            ></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Loading your submission records...
            </p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar size={28} />
            </div>
            <h3>No Submissions Found</h3>
            <p>
              You haven't requested any time slots yet. Submit your first form to get an
              instant confirmed slot.
            </p>
            <Link to="/form" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Submit Your First Request</span>
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Scheduled Date</th>
                  <th>Preferred Time</th>
                  <th>Confirmed Time</th>
                  <th>Purpose / Reason</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub._id || sub.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {sub.formattedDate || sub.date}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {sub.preferredTime}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: 'var(--primary)',
                          background: 'var(--primary-light)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                        }}
                      >
                        {sub.confirmedTime}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          maxWidth: '220px',
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={sub.purpose}
                      >
                        {sub.purpose}
                      </span>
                    </td>
                    <td>
                      <span className="badge-status">
                        <CheckCircle2 size={12} />
                        {sub.status || 'Confirmed'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(sub.createdAt).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
