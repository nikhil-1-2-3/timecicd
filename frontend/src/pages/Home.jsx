import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  Zap,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  BarChart3,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="hero-wrapper">
      {/* Top Banner Pill */}
      <div className="hero-pill">
        <Sparkles size={14} />
        <span>Next-Gen Smart Scheduling & Automated Confirmation</span>
      </div>

      {/* Main Headline */}
      <h1 className="hero-title-main">
        Effortless Time Allocation, <br />
        <span className="text-gradient">Confirmed in Milliseconds.</span>
      </h1>

      {/* Subtitle */}
      <p className="hero-desc">
        Eliminate scheduling bottlenecks. TimeCheck instantly validates, allocates, and
        guarantees confirmed time slots for modern teams and high-velocity workflows.
      </p>

      {/* Hero Action Buttons */}
      <div className="hero-actions">
        {isAuthenticated ? (
          <>
            <Link to="/form" className="btn btn-primary btn-lg btn-glow">
              <span>Book Confirmed Slot</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
              <span>Open Dashboard</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/register" className="btn btn-primary btn-lg btn-glow">
              <span>Start Free Today</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              <span>Sign In to Account</span>
            </Link>
          </>
        )}
      </div>

      {/* Interactive Showcase Preview */}
      <div className="hero-showcase">
        <div className="showcase-header">
          <div className="showcase-title-group">
            <div className="showcase-indicator"></div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              TimeCheck Intelligent Engine Live
            </span>
          </div>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--brand-emerald)',
              fontWeight: 600,
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
            }}
          >
            ⚡ 99.99% Guaranteed Allocation
          </span>
        </div>

        <div className="showcase-grid">
          <div className="showcase-slot-badge">
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Today's Requested Window
              </div>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '0.25rem',
                }}
              >
                18 September 2026
              </div>
            </div>
            <Clock size={28} color="#818cf8" />
          </div>

          <div
            className="showcase-slot-badge"
            style={{
              background: 'rgba(6, 182, 212, 0.12)',
              borderColor: 'rgba(6, 182, 212, 0.3)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#67e8f9',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Auto-Confirmed Slot
              </div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  marginTop: '0.25rem',
                }}
              >
                10:45 AM
              </div>
            </div>
            <CheckCircle2 size={28} color="#38bdf8" />
          </div>
        </div>
      </div>

      {/* Feature Value Cards */}
      <div className="features-grid-saas">
        <div className="feature-saas-card">
          <div className="feature-icon-gem">
            <Zap size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Instant Slot Calculation
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Isolated algorithms process your time preferences instantly without double-booking
            or scheduling friction.
          </p>
        </div>

        <div className="feature-saas-card">
          <div
            className="feature-icon-gem"
            style={{
              background: 'rgba(6, 182, 212, 0.15)',
              borderColor: 'rgba(6, 182, 212, 0.3)',
              color: '#38bdf8',
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Bank-Grade JWT Security
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Protected with bcrypt cryptographic hashing, salted tokens, and private MongoDB
            schemas.
          </p>
        </div>

        <div className="feature-saas-card">
          <div
            className="feature-icon-gem"
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              color: '#34d399',
            }}
          >
            <BarChart3 size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Actionable Schedule Hub
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Track all historical submissions, active confirmed slots, and meeting reasons from a
            centralized dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
