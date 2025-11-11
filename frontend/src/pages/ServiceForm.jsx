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
    location: '',
    // isEmergency removed
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      // no isEmergency in the payload
      await api.post('/api/services', {
        title: form.title,
        description: form.description,
        category: form.category,
        hourlyRate: Number(form.hourlyRate),
        location: form.location,
      });

      setForm({
        title: '',
        description: '',
        category: 'tutoring',
        hourlyRate: 20,
        location: '',
      });
      onCreated?.();
    } catch (error) {
      setErr(error.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          placeholder="What’s included? Any requirements?"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </div>

      <div className="serviceForm__row">
        <div>
          <label htmlFor="cat">Category</label>
          <select
            id="cat"
            className="select"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
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
          </select>
        </div>

        <div>
          <label htmlFor="rate">Hourly Rate ($)</label>
          <input
            id="rate"
            className="input"
            type="number"
            min="0"
            value={form.hourlyRate}
            onChange={(e) => update('hourlyRate', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="loc">School</label>
        <select
          id="loc"
          className="select"
          value={form.location}
          onChange={(e) => update('location', e.target.value)}
        >
          <option value="">Select school</option>
          <option value="Northeastern University">Northeastern</option>
          <option value="Boston University">Boston University</option>
          <option value="MIT">MIT</option>
          <option value="Harvard">Harvard</option>
          <option value="Boston College">Boston College</option>
          <option value="Tufts">Tufts</option>
          <option value="UMass Boston">UMass Boston</option>
          <option value="Berklee">Berklee</option>
        </select>
      </div>

      <div className="serviceForm__footer">
        <button
          type="submit"
          className="button button--primary"
          disabled={loading}
        >
          {loading ? 'Creating…' : 'Create'}
        </button>
      </div>
    </form>
  );
}

ServiceForm.propTypes = {
  onCreated: PropTypes.func,
};
