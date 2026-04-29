import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const VEHICLE_TYPES = ['bike', 'scooter', 'activa'];
const EMPTY_FORM = { vehicle_number: '', model: '', vehicle_type: 'bike', brand: '', year: '' };

const VEHICLE_ICONS = { bike: '🏍️', scooter: '🛵', activa: '🛺' };

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);       // null = add mode, number = edit mode
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);   // confirm delete
  const [loading, setLoading] = useState(false);

  const fetchVehicles = () => api.get('/api/vehicles/').then(r => setVehicles(r.data));
  useEffect(() => { fetchVehicles(); }, []);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = v => {
    setForm({ vehicle_number: v.vehicle_number, model: v.model, vehicle_type: v.vehicle_type, brand: v.brand || '', year: v.year || '' });
    setEditId(v.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, year: form.year ? parseInt(form.year) : null };
    try {
      if (editId) {
        await api.put(`/api/vehicles/${editId}`, { model: payload.model, brand: payload.brand, year: payload.year });
        toast.success('Vehicle updated!');
      } else {
        await api.post('/api/vehicles/', payload);
        toast.success('Vehicle added!');
      }
      closeForm();
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/vehicles/${deleteId}`);
      toast.success('Vehicle removed');
      setDeleteId(null);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">🏍️ My Vehicles</h3>
        <button className="btn btn-danger" onClick={openAdd}>+ Add Vehicle</button>
      </div>

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="card border-0 shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">{editId ? 'Edit Vehicle' : 'Add New Vehicle'}</h5>
            <button type="button" className="btn-close" onClick={closeForm} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Vehicle Number</label>
                <input className="form-control" placeholder="GJ01AB1234" required
                  value={form.vehicle_number} onChange={set('vehicle_number')}
                  disabled={!!editId} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Model</label>
                <input className="form-control" placeholder="Honda Activa 6G" required
                  value={form.model} onChange={set('model')} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Type</label>
                <select className="form-select" value={form.vehicle_type} onChange={set('vehicle_type')} disabled={!!editId}>
                  {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Brand</label>
                <input className="form-control" placeholder="Honda" value={form.brand} onChange={set('brand')} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Year</label>
                <input type="number" className="form-control" placeholder="2022" min="1990" max={new Date().getFullYear()}
                  value={form.year} onChange={set('year')} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-danger" disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Vehicle Cards ── */}
      <div className="row g-3">
        {vehicles.map(v => (
          <div className="col-md-4" key={v.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span style={{ fontSize: 32 }}>{VEHICLE_ICONS[v.vehicle_type] || '🏍️'}</span>
                    <h6 className="fw-bold mt-2 mb-1">{v.vehicle_number}</h6>
                    <p className="mb-1 text-muted">{v.model}{v.year ? ` (${v.year})` : ''}</p>
                    {v.brand && <p className="mb-1 small text-muted">Brand: {v.brand}</p>}
                    <span className="badge bg-danger">{v.vehicle_type}</span>
                    {v.last_service_date && (
                      <p className="text-muted small mt-2 mb-0">
                        Last service: {new Date(v.last_service_date).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(v)}>✏️ Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(v.id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && <p className="text-muted">No vehicles added yet.</p>}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Delete Vehicle?</h5>
                <button className="btn-close" onClick={() => setDeleteId(null)} />
              </div>
              <div className="modal-body text-muted">
                This will permanently remove the vehicle and all its service history.
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
