import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/register', form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = field => e => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container" style={{ maxWidth: 460 }}>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h4 className="fw-bold text-danger mb-1">Create Account</h4>
            <p className="text-muted mb-4">New Ranip Two-Wheeler Service Station</p>
            <form onSubmit={handleSubmit}>
              {[
                { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Your name' },
                { label: 'Phone Number', field: 'phone', type: 'text', placeholder: '+919876543210' },
                { label: 'Email (optional)', field: 'email', type: 'email', placeholder: 'you@example.com' },
                { label: 'Password', field: 'password', type: 'password', placeholder: 'Min 8 characters' },
              ].map(({ label, field, type, placeholder }) => (
                <div className="mb-3" key={field}>
                  <label className="form-label">{label}</label>
                  <input className="form-control" type={type} placeholder={placeholder}
                    required={field !== 'email'} value={form[field]} onChange={set(field)} />
                </div>
              ))}
              <button className="btn btn-danger w-100" disabled={loading}>
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>
            <p className="text-center mt-3 mb-0">
              Already registered? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
