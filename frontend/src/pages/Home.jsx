import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, Zap, CalendarCheck, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Zap size={14} /> Smart Scheduling & Time Confirmation
        </div>
        <h1 className="hero-title">
          Smart Time Allocation Made <span>Effortless</span>
        </h1>
        <p className="hero-subtitle">
          TimeCheck empowers you to effortlessly request, validate, and secure your
          confirmed schedule slots with intelligent instant confirmation.
        </p>

        <div className="hero-cta">
          {isAuthenticated ? (
            <>
              <Link to="/form" className="btn btn-primary btn-lg">
                <span>Submit Time Request</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" className="btn btn-secondary btn-lg">
                <span>Go to Dashboard</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                <span>Sign In to Account</span>
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <CalendarCheck size={24} />
            </div>
            <h3>Instant Slot Confirmation</h3>
            <p>
              Submit your desired date and preferred time slot to receive a guaranteed,
              instantly confirmed time allocation.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={24} />
            </div>
            <h3>Secure JWT Authentication</h3>
            <p>
              Protected by industry standard JWT tokens and bcrypt password encryption,
              ensuring your booking data stays private.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <UserCheck size={24} />
            </div>
            <h3>Personalized Dashboard</h3>
            <p>
              Access all your historical submissions and confirmed schedules in one
              centralized, mobile-responsive view.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
