import { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_OPTIONS = ['pending', 'confirmed', 'in_progress', 'completed', 'ready_for_pickup', 'cancelled'];
const STATUS_COLORS = {
  pending: 'warning', confirmed: 'info', in_progress: 'primary',
  completed: 'success', ready_for_pickup: 'success', cancelled: 'secondary'
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [offerForm, setOfferForm] = useState({ title: '', description: '', discount_percent: '', valid_from: '', valid_until: '' });
  const [invoiceForm, setInvoiceForm] = useState({ appointment_id: '', items: [{ name: '', qty: 1, unit_price: '', total: '' }], tax: '', discount: '' });

  useEffect(() => {
    api.get('/api/dashboard/stats').then(r => setStats(r.data));
    api.get('/api/appointments/all').then(r => setAppointments(r.data));
    api.get('/api/customers/').then(r => setCustomers(r.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/api/appointments/${id}/status`, { status });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast.success('Status updated & customer notified via WhatsApp');
  };

  const createOffer = async e => {
    e.preventDefault();
    try {
      await api.post('/api/offers/', { ...offerForm, discount_percent: offerForm.discount_percent || null });
      toast.success('Offer created!');
      setOfferForm({ title: '', description: '', discount_percent: '', valid_from: '', valid_until: '' });
    } catch { toast.error('Failed to create offer'); }
  };

  const statCards = stats ? [
    { label: 'Total Customers', value: stats.total_customers, color: 'danger', icon: '👥' },
    { label: 'Total Appointments', value: stats.total_appointments, color: 'primary', icon: '📅' },
    { label: 'Pending', value: stats.pending_appointments, color: 'warning', icon: '⏳' },
    { label: 'In Progress', value: stats.in_progress, color: 'info', icon: '🔧' },
    { label: 'Completed Today', value: stats.completed_today, color: 'success', icon: '✅' },
    { label: 'Avg Rating', value: `${stats.average_rating} ⭐`, color: 'dark', icon: '🌟' },
  ] : [];

  const chartData = stats ? [
    { name: 'Pending', count: stats.pending_appointments },
    { name: 'In Progress', count: stats.in_progress },
    { name: 'Done Today', count: stats.completed_today },
  ] : [];

  return (
    <div className="container-fluid py-4 px-4">
      <h3 className="fw-bold mb-4">⚙️ Admin Dashboard</h3>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {['overview', 'appointments', 'customers', 'offers', 'invoices'].map(t => (
          <li className="nav-item" key={t}>
            <button className={`nav-link ${tab === t ? 'active fw-semibold' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Overview */}
      {tab === 'overview' && (
        <>
          <div className="row g-3 mb-4">
            {statCards.map(s => (
              <div className="col-6 col-md-2" key={s.label}>
                <div className={`card border-0 bg-${s.color} text-white text-center p-3`}>
                  <div style={{ fontSize: 28 }}>{s.icon}</div>
                  <h4 className="fw-bold mb-0">{s.value}</h4>
                  <small>{s.label}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="card border-0 shadow-sm p-3" style={{ height: 280 }}>
            <h6 className="fw-bold mb-3">Appointment Overview</h6>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" /><YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#dc3545" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Appointments */}
      {tab === 'appointments' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr><th>#</th><th>Customer</th><th>Service</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>ID: {a.customer_id}</td>
                  <td>{a.service_types?.map(s => s.replace(/_/g, ' ')).join(', ')}</td>
                  <td>{new Date(a.scheduled_date).toLocaleString('en-IN')}</td>
                  <td><span className={`badge bg-${STATUS_COLORS[a.status]}`}>{a.status.replace(/_/g, ' ')}</span></td>
                  <td>
                    <select className="form-select form-select-sm" style={{ width: 160 }}
                      value={a.status} onChange={e => updateStatus(a.id, e.target.value)}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customers */}
      {tab === 'customers' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email || '—'}</td>
                  <td>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Offers */}
      {tab === 'offers' && (
        <div style={{ maxWidth: 500 }}>
          <h5 className="fw-bold mb-3">Create New Offer</h5>
          <form onSubmit={createOffer} className="card border-0 shadow-sm p-4">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input className="form-control" required value={offerForm.title}
                onChange={e => setOfferForm({ ...offerForm, title: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={2} value={offerForm.description}
                onChange={e => setOfferForm({ ...offerForm, description: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Discount %</label>
              <input type="number" className="form-control" value={offerForm.discount_percent}
                onChange={e => setOfferForm({ ...offerForm, discount_percent: e.target.value })} />
            </div>
            <div className="row g-2 mb-3">
              <div className="col">
                <label className="form-label">Valid From</label>
                <input type="datetime-local" className="form-control" required value={offerForm.valid_from}
                  onChange={e => setOfferForm({ ...offerForm, valid_from: e.target.value })} />
              </div>
              <div className="col">
                <label className="form-label">Valid Until</label>
                <input type="datetime-local" className="form-control" required value={offerForm.valid_until}
                  onChange={e => setOfferForm({ ...offerForm, valid_until: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-danger">Create & Broadcast Offer</button>
          </form>
        </div>
      )}
      {/* Invoices */}
      {tab === 'invoices' && (
        <div style={{ maxWidth: 600 }}>
          <h5 className="fw-bold mb-3">Generate Invoice</h5>
          <div className="card border-0 shadow-sm p-4">
            <div className="mb-3">
              <label className="form-label">Appointment ID</label>
              <input type="number" className="form-control" value={invoiceForm.appointment_id}
                onChange={e => setInvoiceForm({ ...invoiceForm, appointment_id: e.target.value })} />
            </div>
            <label className="form-label">Line Items</label>
            {invoiceForm.items.map((item, idx) => (
              <div className="row g-2 mb-2" key={idx}>
                <div className="col-5">
                  <input className="form-control form-control-sm" placeholder="Service/Part name"
                    value={item.name} onChange={e => {
                      const items = [...invoiceForm.items];
                      items[idx].name = e.target.value;
                      setInvoiceForm({ ...invoiceForm, items });
                    }} />
                </div>
                <div className="col-2">
                  <input type="number" className="form-control form-control-sm" placeholder="Qty"
                    value={item.qty} onChange={e => {
                      const items = [...invoiceForm.items];
                      items[idx].qty = parseInt(e.target.value) || 1;
                      items[idx].total = (items[idx].qty * (parseFloat(items[idx].unit_price) || 0)).toFixed(2);
                      setInvoiceForm({ ...invoiceForm, items });
                    }} />
                </div>
                <div className="col-3">
                  <input type="number" className="form-control form-control-sm" placeholder="Unit ₹"
                    value={item.unit_price} onChange={e => {
                      const items = [...invoiceForm.items];
                      items[idx].unit_price = e.target.value;
                      items[idx].total = (items[idx].qty * (parseFloat(e.target.value) || 0)).toFixed(2);
                      setInvoiceForm({ ...invoiceForm, items });
                    }} />
                </div>
                <div className="col-2">
                  <input className="form-control form-control-sm bg-light" readOnly value={item.total ? `₹${item.total}` : ''} />
                </div>
              </div>
            ))}
            <button className="btn btn-outline-secondary btn-sm mb-3" type="button"
              onClick={() => setInvoiceForm({ ...invoiceForm, items: [...invoiceForm.items, { name: '', qty: 1, unit_price: '', total: '' }] })}>
              + Add Item
            </button>
            <div className="row g-2 mb-3">
              <div className="col">
                <label className="form-label">Tax (₹)</label>
                <input type="number" className="form-control" value={invoiceForm.tax}
                  onChange={e => setInvoiceForm({ ...invoiceForm, tax: e.target.value })} />
              </div>
              <div className="col">
                <label className="form-label">Discount (₹)</label>
                <input type="number" className="form-control" value={invoiceForm.discount}
                  onChange={e => setInvoiceForm({ ...invoiceForm, discount: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-danger" onClick={async () => {
              try {
                const payload = {
                  appointment_id: parseInt(invoiceForm.appointment_id),
                  line_items: invoiceForm.items.map(i => ({ name: i.name, qty: i.qty, unit_price: parseFloat(i.unit_price), total: parseFloat(i.total) })),
                  tax: parseFloat(invoiceForm.tax) || 0,
                  discount: parseFloat(invoiceForm.discount) || 0,
                };
                const { data } = await api.post('/api/invoices/', payload);
                toast.success(`Invoice ${data.invoice_number} created!`);
                window.open(`/api/invoices/${data.id}/pdf`, '_blank');
              } catch { toast.error('Failed to create invoice'); }
            }}>Create & Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}
