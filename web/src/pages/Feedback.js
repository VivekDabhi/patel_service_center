import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export default function Feedback() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/appointments/').then(r => {
      const completed = r.data.filter(a => a.status === 'completed' || a.status === 'ready_for_pickup');
      setAppointments(completed);
    });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedAppt) { toast.error('Please select an appointment'); return; }
    setLoading(true);
    try {
      await api.post('/api/feedback/', { appointment_id: parseInt(selectedAppt), rating, comment });
      toast.success('Thank you for your feedback!');
      setSelectedAppt('');
      setRating(5);
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <h3 className="fw-bold mb-4">⭐ Rate Your Service</h3>

      {appointments.length === 0 ? (
        <div className="alert alert-info">No completed services to rate yet.</div>
      ) : (
        <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
          <div className="mb-3">
            <label className="form-label">Select Completed Service</label>
            <select className="form-select" required value={selectedAppt} onChange={e => setSelectedAppt(e.target.value)}>
              <option value="">-- Choose service --</option>
              {appointments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.service_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — {new Date(a.scheduled_date).toLocaleDateString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Rating</label>
            <div className="d-flex gap-2 align-items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
                  style={{ fontSize: 32, color: star <= rating ? '#ffc107' : '#dee2e6' }}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
              <span className="ms-2 fw-semibold">{rating} / 5</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Comments (optional)</label>
            <textarea className="form-control" rows={4} placeholder="Share your experience..."
              value={comment} onChange={e => setComment(e.target.value)} />
          </div>

          <button className="btn btn-danger w-100" disabled={loading || !selectedAppt}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      )}
    </div>
  );
}
