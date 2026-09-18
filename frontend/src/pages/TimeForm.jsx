import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Send, AlertCircle, FileText, User, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formService } from '../services/api';

const TimeForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get today's date formatted as YYYY-MM-DD for min date
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, date, preferredTime, purpose } = formData;

    if (!name.trim() || !email.trim() || !date || !preferredTime || !purpose.trim()) {
      setError('Please fill in all the form fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const response = await formService.submitForm(formData);

      if (response.success && response.data) {
        // Navigate to the Time Result page and pass the result data
        navigate('/result', { state: { resultData: response.data } });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit form. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '1rem auto 3rem' }}>
      <div className="card">
        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
            }}
          >
            <Clock size={24} />
          </div>
          <h2>Time Slot Request</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Provide your preferred schedule details for instant automated confirmation
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="date">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={15} /> Select Date
                </span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className="form-input"
                min={todayString}
                value={formData.date}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="preferredTime">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={15} /> Preferred Time
                </span>
              </label>
              <input
                id="preferredTime"
                name="preferredTime"
                type="time"
                className="form-input"
                value={formData.preferredTime}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="purpose">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={15} /> Purpose / Reason
              </span>
            </label>
            <textarea
              id="purpose"
              name="purpose"
              rows={4}
              className="form-textarea"
              placeholder="Briefly describe the purpose of this time slot (e.g. Project Architecture Review, Client Consultation)..."
              value={formData.purpose}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isSubmitting}
            style={{ marginTop: '1.25rem' }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="spinner" /> Generating & Confirming Time...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={18} /> Submit & Confirm Time
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimeForm;
