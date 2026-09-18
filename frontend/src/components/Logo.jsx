import React from 'react';

const Logo = ({ size = 'medium', showText = true, animated = false }) => {
  const iconSizes = {
    small: 28,
    medium: 36,
    large: 48,
  };

  const currentSize = iconSizes[size] || iconSizes.medium;

  return (
    <div className={`timecheck-brand ${animated ? 'brand-animated' : ''}`}>
      <div
        className="brand-logo-gem"
        style={{
          width: currentSize,
          height: currentSize,
          minWidth: currentSize,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="tcGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="tcAccentGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <filter id="tcNeon" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Outer Rounded Hex/Squircle Shield */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="26"
            fill="url(#tcGlowGrad)"
            opacity="0.95"
          />

          {/* Inner Dial Track */}
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="3.5"
            strokeDasharray="4 3"
          />

          {/* Glowing Time Ring Arc */}
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="140"
            strokeDashoffset="35"
            filter="url(#tcNeon)"
          />

          {/* Dial Markers */}
          <circle cx="50" cy="22" r="2.5" fill="#FFFFFF" />
          <circle cx="78" cy="50" r="2.5" fill="#FFFFFF" />
          <circle cx="50" cy="78" r="2.5" fill="#FFFFFF" />
          <circle cx="22" cy="50" r="2.5" fill="#FFFFFF" />

          {/* Modern Hands: Angle at 10:45 */}
          {/* Hour Hand pointing toward 10 */}
          <line
            x1="50"
            y1="50"
            x2="32"
            y2="36"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Minute Hand pointing toward 9/45 */}
          <line
            x1="50"
            y1="50"
            x2="24"
            y2="50"
            stroke="url(#tcAccentGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Center Pivot Jewel */}
          <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="2.5" fill="#6366F1" />

          {/* Verified Check Badge Accent */}
          <circle
            cx="74"
            cy="26"
            r="12"
            fill="#10B981"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          <path
            d="M69 26L72.5 29.5L79 23"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="brand-text-container">
          <span className="brand-title">
            Time<span className="brand-title-accent">Check</span>
          </span>
          <span className="brand-tagline">SMART SCHEDULER</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
