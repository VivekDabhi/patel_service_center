import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const VEHICLE_TYPES = ['bike', 'scooter', 'activa'];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ vehicle_number: '', model: '', vehicle_type: 'bike', brand: '', year: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchVehicles = () => api.get('/api/vehicles/').then(r => setVehicles(r.data));
  useEffect(() => { fetchVehicles(); }, []);

  const set = field => e => setForm({ ...form, [field]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/vehicles/', { ...form, year: form.year ? parseInt(form.year) : null });
      toast.success('Vehicle added!');
      setForm({ vehicle_number: '', model: '', vehicle_type: 'bike', brand: '', year: '' });
      setShowForm(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">🏍️ My Vehicles</h3>
        <button className="btn btn-danger" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Vehicle'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card border-0 shadow-sm p-4 mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Vehicle Number</label>
              <input className="form-control" placeholder="GJ01AB1234" required
                value={form.vehicle_number} onChange={set('vehicle_number')} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Model</label>
              <input className="form-control" placeholder="Honda Activa 6G" required
                value={form.model} onChange={set('model')} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.vehicle_type} onChange={set('vehicle_type')}>
                {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Brand</label>
              <input className="form-control" placeholder="Honda" value={form.brand} onChange={set('brand')} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Year</label>
              <input type="number" className="form-control" placeholder="2022" value={form.year} onChange={set('year')} />
            </div>
          </div>
          <button className="btn btn-danger mt-3" disabled={loading}>{loading ? 'Adding...' : 'Add Vehicle'}</button>
        </form>
      )}

      <div className="row g-3">
        {vehicles.map(v => (
          <div className="col-md-4" key={v.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="fw-bold">{v.vehicle_number}</h6>
                <p className="mb-1">{v.model} {v.year ? `(${v.year})` : ''}</p>
                <span className="badge bg-danger">{v.vehicle_type}</span>
                {v.last_service_date && (
                  <p className="text-muted small mt-2 mb-0">
                    Last service: {new Date(v.last_service_date).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && <p className="text-muted">No vehicles added yet.</p>}
      </div>
    </div>
  );
}
