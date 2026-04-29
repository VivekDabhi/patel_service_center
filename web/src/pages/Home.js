import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const services = [
  { icon: '🛢️', title: 'Oil Change', desc: 'Engine oil & filter replacement' },
  { icon: '🔧', title: 'General Service', desc: 'Full vehicle checkup & tune-up' },
  { icon: '🛞', title: 'Tyre Service', desc: 'Puncture repair & tyre replacement' },
  { icon: '🔋', title: 'Battery', desc: 'Battery testing & replacement' },
  { icon: '🛑', title: 'Brake Service', desc: 'Brake pad & disc inspection' },
  { icon: '🔩', title: 'Repairs', desc: 'Engine, electrical & body repairs' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {/* Hero */}
      <div className="bg-danger text-white py-5">
        <div className="container text-center py-4">
          <h1 className="display-5 fw-bold">New Ranip Two-Wheeler Service Station</h1>
          <p className="lead mb-4">Trusted bike, scooter & Activa service in Ahmedabad</p>
          <Link to={user ? '/book' : '/register'} className="btn btn-light btn-lg fw-semibold me-3">
            Book Service Now
          </Link>
          {user && (
            <Link to="/appointments" className="btn btn-outline-light btn-lg">
              Track My Service
            </Link>
          )}
        </div>
      </div>

      {/* Services */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-4">Our Services</h2>
        <div className="row g-4">
          {services.map(s => (
            <div className="col-6 col-md-4" key={s.title}>
              <div className="card h-100 border-0 shadow-sm text-center p-3">
                <div style={{ fontSize: 40 }}>{s.icon}</div>
                <h6 className="fw-bold mt-2">{s.title}</h6>
                <p className="text-muted small mb-0">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Us */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">Why Choose Us?</h2>
          <div className="row g-3 text-center">
            {[
              ['📅', 'Easy Online Booking', 'Book appointments anytime, anywhere'],
              ['📲', 'WhatsApp Updates', 'Real-time service status on WhatsApp'],
              ['🧾', 'Digital Invoices', 'Paperless billing sent directly to you'],
              ['⏰', 'Service Reminders', 'Auto reminders every 3 months'],
            ].map(([icon, title, desc]) => (
              <div className="col-6 col-md-3" key={title}>
                <div style={{ fontSize: 36 }}>{icon}</div>
                <h6 className="fw-bold mt-2">{title}</h6>
                <p className="text-muted small">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2025 New Ranip Two-Wheeler Service Station, Ahmedabad | New Ranip, Gujarat</small>
      </footer>
    </>
  );
}
