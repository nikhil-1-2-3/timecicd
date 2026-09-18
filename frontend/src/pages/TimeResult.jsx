import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, ArrowRight, PlusCircle, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TimeResult = () => {
  const location = useLocation();
  const { user } = useAuth();

  const resultData = location.state?.resultData;

  // Fallback if accessed directly without submission state
  if (!resultData) {
    return <Navigate to="/dashboard" replace />;
  }

  const {
    name,
    formattedDate,
    date,
    preferredTime,
    confirmedTime,
    confirmationMessage,
    purpose,
  } = resultData;

  const displayDate = formattedDate || date;
  const displayName = name || user?.name || 'Valued User';

  return (
    <div className="result-container">
      <div className="celebration-card">
        <div className="celebration-header">
          <div className="celebration-emoji">🎉</div>
          <h1>Congratulations, {displayName}!</h1>
          <p>{confirmationMessage || 'Your time has been successfully confirmed.'}</p>
        </div>

        <div className="result-body">
          <div className="result-message-badge">
            <CheckCircle2 size={18} />
            <span>Schedule Slot Successfully Allocated</span>
          </div>

          <div className="result-highlight-box">
            <div>
              <div className="result-item-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={13} /> Selected Date
                </span>
              </div>
              <div className="result-item-value">{displayDate}</div>
            </div>

            <div>
              <div className="result-item-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={13} /> Requested Time
                </span>
              </div>
              <div className="result-item-value">{preferredTime}</div>
            </div>

            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div className="result-item-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={13} /> Generated / Confirmed Time
                </span>
              </div>
              <div className="result-item-value highlight-time" style={{ fontSize: '1.45rem' }}>
                {confirmedTime}
              </div>
            </div>

            {purpose && (
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div className="result-item-label">Purpose</div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 500 }}>
                  {purpose}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <LayoutDashboard size={18} />
              <span>View in Dashboard</span>
            </Link>

            <Link to="/form" className="btn btn-secondary btn-lg">
              <PlusCircle size={18} />
              <span>Submit Another Request</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeResult;
