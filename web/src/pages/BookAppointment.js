import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const SERVICE_OPTIONS = [
  { value: 'general_service',     label: 'General Service',     icon: '🔧' },
  { value: 'oil_change',          label: 'Oil Change',          icon: '🛢️' },
  { value: 'tyre_change',         label: 'Tyre Change',         icon: '🛞' },
  { value: 'brake_service',       label: 'Brake Service',       icon: '🛑' },
  { value: 'battery_replacement', label: 'Battery Replacement', icon: '🔋' },
  { value: 'full_service',        label: 'Full Service',        icon: '⭐' },
  { value: 'repair',              label: 'Repair',              icon: '🔩' },
  { value: 'other',               label: 'Other',               icon: '📋' },
];

const EMPTY = {
  guest_name: '', guest_phone: '', guest_vehicle_number: '', guest_vehicle_model: '',
  service_types: [], scheduled_date: '', notes: '',
  pickup_required: false, pickup_address: '', drop_required: false, drop_address: '',
};

export default function BookAppointment() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const set = field => e => setForm(f => ({
    ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
  }));

  const toggleService = value => setForm(f => ({
    ...f,
    service_types: f.service_types.includes(value)
      ? f.service_types.filter(s => s !== value)
      : [...f.service_types, value],
  }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.service_types.length === 0) { toast.error('Select at least one service'); return; }
    setLoading(true);
    try {
      await api.post('/api/appointments/guest', {
        ...form,
        guest_phone: `+91${form.guest_phone}`,
      });
      setBooked(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (booked) return (
    <div className="container py-5 text-center" style={{ maxWidth: 480 }}>
      <div style={{ fontSize: 64 }}>✅</div>
      <h3 className="fw-bold mt-3">Booking Confirmed!</h3>
      <p className="text-muted">We've received your appointment request. Our team will contact you on <strong>+91{form.guest_phone}</strong> to confirm.</p>
      <button className="btn btn-danger mt-2" onClick={() => { setForm(EMPTY); setBooked(false); }}>
        Book Another
      </button>
    </div>
  );

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <h3 className="fw-bold mb-1">📅 Book a Service</h3>
      <p className="text-muted mb-4">No registration needed — just fill in your details</p>

      <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">

        {/* Contact Details */}
        <h6 className="fw-bold text-danger mb-3">Your Details</h6>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input className="form-control" placeholder="Ramesh Patel" required
              value={form.guest_name} onChange={set('guest_name')} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mobile Number</label>
            <div className="input-group">
              <span className="input-group-text">+91</span>
              <input className="form-control" placeholder="9876543210" required
                maxLength={10} value={form.guest_phone}
                onChange={e => setForm(f => ({ ...f, guest_phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} />
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <h6 className="fw-bold text-danger mb-3">Vehicle Details</h6>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Vehicle Number</label>
            <input className="form-control" placeholder="GJ01AB1234" required
              value={form.guest_vehicle_number} onChange={set('guest_vehicle_number')} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Vehicle Model</label>
            <input className="form-control" placeholder="Honda Activa 6G" required
              value={form.guest_vehicle_model} onChange={set('guest_vehicle_model')} />
          </div>
        </div>

        {/* Service Types */}
        <h6 className="fw-bold text-danger mb-3">Select Service</h6>
        <div className="row g-2 mb-4">
          {SERVICE_OPTIONS.map(opt => {
            const selected = form.service_types.includes(opt.value);
            return (
              <div className="col-6 col-md-3" key={opt.value}>
                <div onClick={() => toggleService(opt.value)} style={{
                  border: `2px solid ${selected ? '#dc3545' : '#dee2e6'}`,
                  borderRadius: 10, padding: '10px 8px', textAlign: 'center',
                  cursor: 'pointer', background: selected ? '#fff5f5' : 'white',
                  transition: 'all 0.15s', userSelect: 'none',
                }}>
                  <div style={{ fontSize: 24 }}>{opt.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: selected ? 600 : 400, color: selected ? '#dc3545' : '#555', marginTop: 4 }}>
                    {opt.label}
                  </div>
                  {selected && <div style={{ fontSize: 11, color: '#dc3545' }}>✓</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Date */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Preferred Date & Time</label>
          <input type="datetime-local" className="form-control" required
            value={form.scheduled_date} onChange={set('scheduled_date')} />
        </div>

        {/* Notes */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Notes (optional)</label>
          <textarea className="form-control" rows={2} placeholder="Describe any specific issues..."
            value={form.notes} onChange={set('notes')} />
        </div>

        {/* Pickup */}
        <div className="mb-2 form-check">
          <input type="checkbox" className="form-check-input" id="pickup"
            checked={form.pickup_required} onChange={set('pickup_required')} />
          <label className="form-check-label" htmlFor="pickup">🚗 Request Pickup Service</label>
        </div>
        {form.pickup_required && (
          <div className="mb-3">
            <input className="form-control" placeholder="Enter pickup address"
              value={form.pickup_address} onChange={set('pickup_address')} />
          </div>
        )}

        {/* Drop */}
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="drop"
            checked={form.drop_required} onChange={set('drop_required')} />
          <label className="form-check-label" htmlFor="drop">🏠 Request Drop Service</label>
        </div>
        {form.drop_required && (
          <div className="mb-3">
            <input className="form-control" placeholder="Enter drop address"
              value={form.drop_address} onChange={set('drop_address')} />
          </div>
        )}

        <button className="btn btn-danger w-100 mt-2" disabled={loading || form.service_types.length === 0}>
          {loading ? 'Booking...' : `Confirm Booking${form.service_types.length > 1 ? ` (${form.service_types.length} services)` : ''}`}
        </button>
      </form>
    </div>
  );
}
