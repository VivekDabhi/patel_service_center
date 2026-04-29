import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function BookAppointment() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    vehicle_id: '', service_types: [], scheduled_date: '',
    notes: '', pickup_required: false, pickup_address: '',
    drop_required: false, drop_address: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/vehicles/').then(r => setVehicles(r.data));
  }, []);

  const toggleService = (value) => {
    setForm(prev => ({
      ...prev,
      service_types: prev.service_types.includes(value)
        ? prev.service_types.filter(s => s !== value)
        : [...prev.service_types, value]
    }));
  };

  const set = field => e => setForm(prev => ({
    ...prev,
    [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
  }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.service_types.length === 0) {
      toast.error('Please select at least one service type');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/appointments/', { ...form, vehicle_id: parseInt(form.vehicle_id) });
      toast.success('Appointment booked! Check WhatsApp for confirmation.');
      navigate('/appointments');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <h3 className="fw-bold mb-4">📅 Book a Service Appointment</h3>

      {vehicles.length === 0 && (
        <div className="alert alert-warning">
          No vehicles found. <a href="/vehicles">Add a vehicle first</a>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">

        {/* Vehicle */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Select Vehicle</label>
          <select className="form-select" required value={form.vehicle_id} onChange={set('vehicle_id')}>
            <option value="">-- Choose vehicle --</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.vehicle_number} — {v.model}</option>
            ))}
          </select>
        </div>

        {/* Service Types — multi-select cards */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            Service Type
            <span className="text-muted fw-normal ms-2" style={{ fontSize: 13 }}>
              (select one or more)
            </span>
          </label>
          <div className="row g-2">
            {SERVICE_OPTIONS.map(opt => {
              const selected = form.service_types.includes(opt.value);
              return (
                <div className="col-6 col-md-3" key={opt.value}>
                  <div
                    onClick={() => toggleService(opt.value)}
                    style={{
                      border: `2px solid ${selected ? '#dc3545' : '#dee2e6'}`,
                      borderRadius: 10,
                      padding: '10px 8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: selected ? '#fff5f5' : 'white',
                      transition: 'all 0.15s',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ fontSize: 24 }}>{opt.icon}</div>
                    <div style={{
                      fontSize: 12, fontWeight: selected ? 600 : 400,
                      color: selected ? '#dc3545' : '#555', marginTop: 4,
                    }}>
                      {opt.label}
                    </div>
                    {selected && (
                      <div style={{ fontSize: 11, color: '#dc3545', marginTop: 2 }}>✓ Selected</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {form.service_types.length > 0 && (
            <div className="mt-2">
              {form.service_types.map(s => (
                <span key={s} className="badge bg-danger me-1">
                  {SERVICE_OPTIONS.find(o => o.value === s)?.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Date & Time */}
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
        <div className="mb-2 form-check">
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

        <button
          className="btn btn-danger w-100 mt-2"
          disabled={loading || !form.vehicle_id || form.service_types.length === 0}
        >
          {loading ? 'Booking...' : `Confirm Booking${form.service_types.length > 1 ? ` (${form.service_types.length} services)` : ''}`}
        </button>
      </form>
    </div>
  );
}
