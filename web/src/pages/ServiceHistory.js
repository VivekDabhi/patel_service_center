import { useState, useEffect } from 'react';
import api from '../api';

export default function ServiceHistory() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/vehicles/').then(r => setVehicles(r.data));
  }, []);

  const fetchHistory = async vehicleId => {
    setSelectedVehicle(vehicleId);
    if (!vehicleId) { setRecords([]); return; }
    setLoading(true);
    try {
      const { data } = await api.get(`/api/service-records/vehicle/${vehicleId}`);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">🔍 Service History</h3>

      <div className="mb-4" style={{ maxWidth: 360 }}>
        <label className="form-label">Select Vehicle</label>
        <select className="form-select" value={selectedVehicle} onChange={e => fetchHistory(e.target.value)}>
          <option value="">-- Choose a vehicle --</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.vehicle_number} — {v.model}</option>
          ))}
        </select>
      </div>

      {loading && <div className="text-center py-4"><div className="spinner-border text-danger" /></div>}

      {!loading && selectedVehicle && records.length === 0 && (
        <div className="alert alert-info">No service records found for this vehicle.</div>
      )}

      {records.length > 0 && (
        <div className="timeline">
          {records.map((rec, i) => (
            <div key={rec.id} className="d-flex gap-3 mb-4">
              <div className="d-flex flex-column align-items-center">
                <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 36, height: 36, flexShrink: 0 }}>{i + 1}</div>
                {i < records.length - 1 && <div style={{ width: 2, flex: 1, background: '#dee2e6', marginTop: 4 }} />}
              </div>
              <div className="card border-0 shadow-sm flex-grow-1 mb-0">
                <div className="card-body py-3">
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <h6 className="fw-bold mb-1">
                      {new Date(rec.service_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h6>
                    {rec.total_cost && (
                      <span className="badge bg-success fs-6">₹{parseFloat(rec.total_cost).toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <p className="mb-1">{rec.service_description}</p>
                  {rec.parts_replaced && (
                    <p className="text-muted small mb-1">🔩 Parts: {rec.parts_replaced}</p>
                  )}
                  {rec.technician_name && (
                    <p className="text-muted small mb-1">👨‍🔧 Technician: {rec.technician_name}</p>
                  )}
                  {rec.odometer_reading && (
                    <p className="text-muted small mb-1">🏁 Odometer: {rec.odometer_reading.toLocaleString('en-IN')} km</p>
                  )}
                  {rec.next_service_due && (
                    <p className="text-muted small mb-0">
                      📅 Next service due: <strong>{new Date(rec.next_service_due).toLocaleDateString('en-IN')}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
