import { useState, useEffect } from 'react';
import api from '../api';

const STATUS_COLORS = {
  pending: 'warning', confirmed: 'info', in_progress: 'primary',
  completed: 'success', ready_for_pickup: 'success', cancelled: 'secondary'
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/appointments/').then(r => setAppointments(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>;

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">🗓️ My Appointments</h3>
      {appointments.length === 0 ? (
        <div className="alert alert-info">No appointments yet. <a href="/book">Book your first service!</a></div>
      ) : (
        <div className="row g-3">
          {appointments.map(appt => (
            <div className="col-md-6" key={appt.id}>
                  <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="fw-bold mb-1">
                      {appt.service_types.map(s => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ')}
                    </h6>
                    <span className={`badge bg-${STATUS_COLORS[appt.status] || 'secondary'}`}>
                      {appt.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-muted small mb-1">
                    📅 {new Date(appt.scheduled_date).toLocaleString('en-IN')}
                  </p>
                  {appt.notes && <p className="text-muted small mb-1">📝 {appt.notes}</p>}
                  {appt.pickup_required && <span className="badge bg-light text-dark me-1">🚗 Pickup</span>}
                  {appt.drop_required && <span className="badge bg-light text-dark">🏠 Drop</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
