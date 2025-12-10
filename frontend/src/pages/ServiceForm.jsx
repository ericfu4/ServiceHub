// frontend/src/pages/ServiceForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';
import './ServiceForm.css';

export default function ServiceForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'tutoring',
    hourlyRate: 20,
    itemPrice: '',
    location: '',
    school: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const payload = {
        ...form,
        hourlyRate:
          form.category === 'selling'
            ? Number(form.itemPrice || 0)
            : Number(form.hourlyRate || 0),
        location: form.school,
      };
      delete payload.itemPrice;
      delete payload.school;
      const res = await api.post('/api/services', payload);
      if (onCreated) onCreated(res.service);
    } catch (error) {
      setErr(error.message || 'Failed to create listing');
    }
    setLoading(false);
  };

  return (
    <div>
      <form
        className="serviceForm serviceForm__card"
        onSubmit={submit}
        noValidate
      >
        <h3>Create service</h3>

        {err && (
          <div className="serviceForm__hint" style={{ color: 'var(--danger)' }}>
            {err}
          </div>
        )}

        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="input"
            placeholder="e.g., iPhone screen repair"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            className="textarea"
            placeholder="What's included? Any requirements?"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="school">School/College</label>
          <select
            id="school"
            className="select"
            value={form.school}
            onChange={(e) => update('school', e.target.value)}
            required
          >
            <option value="">Select your school</option>
            <option value="Boston University">Boston University</option>
            <option value="Northeastern University">
              Northeastern University
            </option>
            <option value="Harvard University">Harvard University</option>
            <option value="MIT">MIT</option>
            <option value="Tufts University">Tufts University</option>
            <option value="Boston College">Boston College</option>
            <option value="Emerson College">Emerson College</option>
            <option value="Suffolk University">Suffolk University</option>
            <option value="UMass Boston">UMass Boston</option>
            <option value="Berklee College of Music">
              Berklee College of Music
            </option>
            <option value="Simmons University">Simmons University</option>
            <option value="Wentworth Institute of Technology">
              Wentworth Institute of Technology
            </option>
            <option value="Lesley University">Lesley University</option>
            <option value="MCPHS University">MCPHS University</option>
            <option value="Bentley University">Bentley University</option>
            <option value="Brandeis University">Brandeis University</option>
            <option value="Babson College">Babson College</option>
            <option value="Olin College of Engineering">
              Olin College of Engineering
            </option>
            <option value="Fisher College">Fisher College</option>
            <option value="Emmanuel College">Emmanuel College</option>
            <option value="Wheelock College">Wheelock College</option>
          </select>
        </div>

        <div className="serviceForm__row">
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="select"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              required
            >
              <option value="tutoring">Tutoring</option>
              <option value="moving">Moving & Delivery</option>
              <option value="tech">Tech Support</option>
              <option value="photo">Photography & Video</option>
              <option value="events">Event Services</option>
              <option value="design">Graphic Design</option>
              <option value="writing">Writing & Editing</option>
              <option value="music">Music Lessons</option>
              <option value="fitness">Fitness & Training</option>
              <option value="petcare">Pet Care</option>
              <option value="home">Home Services</option>
              <option value="auto">Car Services</option>
              <option value="food">Food & Catering</option>
              <option value="admin">Administrative</option>
              <option value="other">Other</option>
              <option value="selling">Selling</option>
            </select>
          </div>
          {form.category === 'selling' ? (
            <div>
              <label htmlFor="itemPrice">Item Price ($)</label>
              <input
                id="itemPrice"
                className="input"
                type="number"
                min="0"
                step="1"
                value={form.itemPrice}
                onChange={(e) => update('itemPrice', e.target.value)}
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="hourlyRate">Hourly Rate ($)</label>
              <input
                id="hourlyRate"
                className="input"
                type="number"
                min="0"
                step="1"
                value={form.hourlyRate}
                onChange={(e) => update('hourlyRate', e.target.value)}
                required
              />
            </div>
          )}
        </div>

        <div className="serviceForm__footer">
          <button
            type="submit"
            className="button button--primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
