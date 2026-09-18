import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Send,
  AlertCircle,
  FileText,
  User,
  Mail,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formService } from '../services/api';

const QUICK_TIME_PRESETS = ['09:00', '10:45', '14:00', '16:30'];
const PURPOSE_SUGGESTIONS = [
  'Architecture & Cloud Review',
  'Deployment Status Sync',
  'Sprint Strategy & Planning',
  'Client Consultation',
];

const TimeForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    date: todayString,
    preferredTime: '10:45',
    purpose: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const setPresetTime = (time) => {
    setFormData({ ...formData, preferredTime: time });
  };

  const setPurposePreset = (purpose) => {
    setFormData({ ...formData, purpose });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, date, preferredTime, purpose } = formData;

    if (!name.trim() || !email.trim() || !date || !preferredTime || !purpose.trim()) {
      setError('Please fill in all the required form fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const response = await formService.submitForm(formData);

      if (response.success && response.data) {
        navigate('/result', { state: { resultData: response.data } });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit form. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '1rem auto 3.5rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '0.4rem 1rem',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '9999px',
              color: '#818cf8',
              fontSize: '0.85rem',
              fontWeight: 600,
              gap: '0.4rem',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} /> Guaranteed Slot Allocation
          </div>
          <h2 style={{ fontSize: '2rem' }}>Request Time Slot</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Submit your schedule preferences for instant system-confirmed booking
          </p>
        </div>

        {error && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name & Email */}
          <div className="field-row">
            <div className="form-field">
              <label className="field-label" htmlFor="name">
                Full Name
              </label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input-modern"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input-modern"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="field-row">
            <div className="form-field">
              <label className="field-label" htmlFor="date">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={15} color="#818cf8" /> Scheduled Date
                </span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className="input-modern input-no-icon"
                min={todayString}
                value={formData.date}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="preferredTime">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={15} color="#06b6d4" /> Preferred Time
                </span>
              </label>
              <input
                id="preferredTime"
                name="preferredTime"
                type="time"
                className="input-modern input-no-icon"
                value={formData.preferredTime}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              {/* Quick Preset Pills */}
              <div className="slot-chips">
                {QUICK_TIME_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setPresetTime(preset)}
                    className={`chip-btn ${
                      formData.preferredTime === preset ? 'active' : ''
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Purpose & Presets */}
          <div className="form-field">
            <label className="field-label" htmlFor="purpose">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={15} color="#818cf8" /> Meeting Purpose & Reason
              </span>
            </label>
            <textarea
              id="purpose"
              name="purpose"
              rows={3}
              className="textarea-modern input-no-icon"
              placeholder="Describe the purpose of this appointment or select a suggestion below..."
              value={formData.purpose}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            {/* Quick Purpose Chips */}
            <div className="slot-chips">
              {PURPOSE_SUGGESTIONS.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => setPurposePreset(suggestion)}
                  className={`chip-btn ${
                    formData.purpose === suggestion ? 'active' : ''
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg btn-glow"
            disabled={isSubmitting}
            style={{ marginTop: '1.5rem' }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="spinner" /> Generating Instant Confirmation...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={18} /> Confirm Time Slot Now
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimeForm;
