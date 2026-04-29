import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams(form);
      const { data } = await api.post('/api/auth/login', params);
      login(data.user, data.access_token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch {
      toast.error('Invalid phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h4 className="fw-bold text-danger mb-1">🔧 Service Station</h4>
            <p className="text-muted mb-4">New Ranip, Ahmedabad</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text">+91</span>
                  <input className="form-control" placeholder="9876543210" required
                    maxLength={10} value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <button className="btn btn-danger w-100" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="text-center mt-3 mb-0">
              New customer? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
