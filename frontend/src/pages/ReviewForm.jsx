import { useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';
import './ReviewForm.css';

export default function ReviewForm({ booking, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const review = await api.post('/api/reviews', {
        bookingId: booking._id,
        serviceId: booking.serviceId,
        providerId: booking.providerId,
        rating,
        comment,
      });
      onSuccess?.(review);
      setRating(5);
      setComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="reviewForm" onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div className="reviewForm__rating">
        <label>Rating</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${star <= rating ? 'active' : ''}`}
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} stars`}
            >
              {star <= rating ? '★' : '☆'}
            </button>
          ))}
        </div>
      </div>

      <label>
        Comment
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          placeholder="Share your experience..."
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

ReviewForm.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    serviceId: PropTypes.string.isRequired,
    providerId: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func,
};
