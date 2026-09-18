import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  Search,
  CalendarCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredSubmissions = submissions.filter((sub) => {
    const term = searchTerm.toLowerCase();
    const date = (sub.formattedDate || sub.date || '').toLowerCase();
    const purpose = (sub.purpose || '').toLowerCase();
    const time = (sub.confirmedTime || '').toLowerCase();
    return date.includes(term) || purpose.includes(term) || time.includes(term);
  });

  return (
    <div>
      {/* Dashboard Top Header */}
      <div className="dash-header-block">
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#818cf8',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '0.35rem',
            }}
          >
            <Sparkles size={14} /> Real-Time MongoDB Atlas Sync
          </div>
          <h1 style={{ fontSize: '2.25rem' }}>Welcome back, {user?.name || 'User'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your scheduled appointments and confirmed time allocations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <button
            onClick={fetchSubmissions}
            className="btn btn-secondary btn-sm"
            title="Refresh submissions"
          >
            <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
            <span>Sync</span>
          </button>
          <Link to="/form" className="btn btn-primary btn-sm btn-glow">
            <PlusCircle size={15} />
            <span>New Request</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-icon-box">
            <CalendarCheck size={24} />
          </div>
          <div>
            <div className="metric-number">{submissions.length}</div>
            <div className="metric-title">Total Bookings</div>
          </div>
        </div>

        <div className="metric-card">
          <div
            className="metric-icon-box"
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="metric-number">{submissions.length}</div>
            <div className="metric-title">Confirmed Slots</div>
          </div>
        </div>

        <div className="metric-card">
          <div
            className="metric-icon-box"
            style={{
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
            }}
          >
            <Clock size={24} />
          </div>
          <div>
            <div className="metric-number" style={{ fontSize: '1.35rem' }}>
              {submissions.length > 0
                ? submissions[0].confirmedTime || submissions[0].preferredTime
                : 'None'}
            </div>
            <div className="metric-title">Latest Confirmed Slot</div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Submissions Panel */}
      <div className="table-panel">
        <div className="table-panel-header">
          <h3 style={{ fontSize: '1.2rem' }}>Appointment History</h3>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
              }}
            />
            <input
              type="text"
              className="input-modern"
              placeholder="Search by date, purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '2.4rem',
                paddingTop: '0.45rem',
                paddingBottom: '0.45rem',
                fontSize: '0.85rem',
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div
              className="spinner"
              style={{
                width: '32px',
                height: '32px',
                margin: '0 auto 1rem',
                borderWidth: '3px',
                borderTopColor: '#818cf8',
              }}
            ></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Querying MongoDB Atlas database...
            </p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <Calendar size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              {searchTerm ? 'No Matching Records' : 'No Submissions Yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
              {searchTerm
                ? `No submissions found matching "${searchTerm}".`
                : 'Submit your first schedule request to receive an instant confirmed time slot.'}
            </p>
            {!searchTerm && (
              <Link to="/form" className="btn btn-primary btn-glow">
                <PlusCircle size={16} />
                <span>Submit First Request</span>
              </Link>
            )}
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Scheduled Date</th>
                  <th>Requested</th>
                  <th>Confirmed Time</th>
                  <th>Purpose / Reason</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <tr key={sub._id || sub.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>
                        {sub.formattedDate || sub.date}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-dim)' }}>
                        {sub.preferredTime}
                      </span>
                    </td>
                    <td>
                      <span className="time-badge">
                        <Clock size={13} />
                        {sub.confirmedTime}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          maxWidth: '240px',
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: '#cbd5e1',
                        }}
                        title={sub.purpose}
                      >
                        {sub.purpose}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge-confirmed">
                        <CheckCircle2 size={13} />
                        {sub.status || 'Confirmed'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
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
