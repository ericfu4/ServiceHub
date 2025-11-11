// src/pages/ServiceDetail.jsx
import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Loading from '../components/Loading';
import ReviewsList from './ReviewsList';
import './ServiceDetail.css';

export default function ServiceDetail({
  id: idProp,
  canEdit = false,
  onDeleted,
}) {
  const { id: idFromRoute } = useParams();
  const navigate = useNavigate();

  // prefer route param, fall back to prop
  const id = useMemo(() => idFromRoute || idProp, [idFromRoute, idProp]);

  const [svc, setSvc] = useState(null);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setErr('Missing service id');
      return;
    }
    let alive = true;
    setErr('');
    api
      .get(`/api/services/${id}`)
      .then((res) => {
        if (alive) setSvc(res.service);
      })
      .catch((e) => setErr(e.message || 'Failed to load service'));
    return () => {
      alive = false;
    };
  }, [id]);

  async function update(field, value) {
    if (!canEdit || !id) return;
    setSaving(true);
    setErr('');
    try {
      const { service } = await api.put(`/api/services/${id}`, {
        [field]: value,
      });
      setSvc(service);
    } catch (e) {
      setErr(e.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!canEdit || !id) return;
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.delete(`/api/services/${id}`);
      onDeleted?.();
      // Go to My Listings if present, otherwise home
      navigate('/me', { replace: true });
    } catch (e) {
      setErr(e.message || 'Failed to delete');
    }
  }

  if (!id) {
    return (
      <p className="error" role="alert">
        Invalid service URL.
      </p>
    );
  }

  if (!svc && !err) return <Loading label="Loading service…" />;

  if (err) {
    return (
      <p className="error" role="alert">
        {err}
      </p>
    );
  }

  if (!svc) return null;

  return (
    <section className="svcDetail">
      <h2>{svc.title}</h2>

      <p
        className="svcDetail__rating"
        aria-label={`Rating ${svc.averageRating ?? 0} of 5`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} aria-hidden="true">
            {i < Math.round(svc.averageRating ?? 0) ? '★' : '☆'}
          </span>
        ))}
        <span className="count">({svc.reviewsCount ?? 0})</span>
      </p>

      <p className="svcDetail__desc">{svc.description}</p>

      <dl className="svcDetail__meta">
        <div>
          <dt>Category</dt>
          <dd>{svc.category}</dd>
        </div>
        <div>
          <dt>Rate</dt>
          <dd>${svc.hourlyRate}/hr</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{svc.location}</dd>
        </div>
      </dl>

      {canEdit && (
        <div className="svcDetail__actions">
          <button
            onClick={() => {
              const v = Number(prompt('New rate?', svc.hourlyRate));
              if (!Number.isNaN(v)) update('hourlyRate', v);
            }}
            disabled={saving}
          >
            Update Rate
          </button>
          <button className="danger" onClick={remove} disabled={saving}>
            Delete
          </button>
        </div>
      )}

      <section className="svcDetail__reviews">
        <h3>Reviews</h3>
        <ReviewsList serviceId={id} />
      </section>
    </section>
  );
}

ServiceDetail.propTypes = {
  id: PropTypes.string, // now optional (route param preferred)
  canEdit: PropTypes.bool,
  onDeleted: PropTypes.func,
};
