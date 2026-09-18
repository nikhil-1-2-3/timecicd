import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  LayoutDashboard,
  PlusCircle,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const TimeResult = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const resultData = location.state?.resultData;

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

  const copyToClipboard = () => {
    const text = `TimeCheck Booking Confirmed!\nName: ${displayName}\nDate: ${displayDate}\nRequested: ${preferredTime}\nConfirmed Time: ${confirmedTime}\nPurpose: ${purpose || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="ticket-wrapper">
      <div className="boarding-pass">
        {/* Pass Top Banner */}
        <div className="pass-header">
          <div className="celebration-spark">🎉</div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff' }}>
            Congratulations, {displayName}!
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginTop: '0.4rem', fontSize: '1.05rem' }}>
            {confirmationMessage || 'Your time has been successfully confirmed.'}
          </p>
        </div>

        {/* Pass Body */}
        <div className="pass-body">
          {/* Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#6ee7b7',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: '1.75rem',
            }}
          >
            <CheckCircle2 size={18} />
            <span>Guaranteed Appointment Slot Allocated in MongoDB Atlas</span>
          </div>

          {/* Schedule Grid */}
          <div className="pass-grid">
            <div className="pass-data-item">
              <span className="pass-label">Scheduled Date</span>
              <span className="pass-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={16} color="#818cf8" /> {displayDate}
              </span>
            </div>

            <div className="pass-data-item">
              <span className="pass-label">Preferred Request</span>
              <span className="pass-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={16} color="#94a3b8" /> {preferredTime}
              </span>
            </div>

            <div className="pass-data-item" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <span className="pass-label">System Confirmed Time</span>
              <span className="pass-value-highlight" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={20} color="#38bdf8" /> {confirmedTime}
              </span>
            </div>

            {purpose && (
              <div className="pass-data-item" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <span className="pass-label">Purpose / Reason</span>
                <span className="pass-value" style={{ fontSize: '0.95rem', fontWeight: 500, color: '#cbd5e1' }}>
                  {purpose}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary btn-lg btn-glow">
              <LayoutDashboard size={18} />
              <span>View in Dashboard</span>
            </Link>

            <button onClick={copyToClipboard} className="btn btn-secondary btn-lg">
              {copied ? (
                <>
                  <Check size={18} color="#10b981" />
                  <span style={{ color: '#10b981' }}>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span>Copy Details</span>
                </>
              )}
            </button>

            <Link to="/form" className="btn btn-secondary btn-lg">
              <PlusCircle size={18} />
              <span>New Request</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeResult;
