import { Link } from 'react-router-dom';

const services = [
  { icon: '🛢️', title: 'Oil Change', desc: 'Engine oil & filter replacement' },
  { icon: '🔧', title: 'General Service', desc: 'Full vehicle checkup & tune-up' },
  { icon: '🛞', title: 'Tyre Service', desc: 'Puncture repair & tyre replacement' },
  { icon: '🔋', title: 'Battery', desc: 'Battery testing & replacement' },
  { icon: '🛑', title: 'Brake Service', desc: 'Brake pad & disc inspection' },
  { icon: '🔩', title: 'Repairs', desc: 'Engine, electrical & body repairs' },
];

const whyUs = [
  { icon: '🔧', title: 'Expert Technicians' },
  { icon: '😊', title: 'Customer Satisfaction' },
  { icon: '🎯', title: 'Personalized Attention' },
  { icon: '⭐', title: 'Quality Service' },
  { icon: '🔩', title: 'Genuine Parts' },
  { icon: '💰', title: 'Affordable Prices' },
];

const gallery = [
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    label: 'Royal Enfield',
  },
  {
    url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80',
    label: 'Honda Activa',
  },
  {
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80',
    label: 'Sport Bike',
  },
  {
    url: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80',
    label: 'Classic Scooter',
  },
];

const stats = [
  { value: '5000+', label: 'Happy Customers' },
  { value: '30+', label: 'Years Experience' },
  { value: '10000+', label: 'Services Done' },
  { value: '100%', label: 'Genuine Parts' },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="gs-hero">
        <div className="gs-hero-overlay" />
        <div className="container gs-hero-content text-white text-center">
          <span className="gs-badge mb-3">🏍️ Ahmedabad's Trusted Garage</span>
          <h1 className="display-4 fw-bold">Patel Service Station</h1>
          <p className="lead mb-1 opacity-75">New Ranip Two-Wheeler Service Station</p>
          <p className="mb-4 opacity-50 small">Bikes · Scooters · Activa · All Brands</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/book" className="btn btn-danger btn-lg fw-semibold px-4">
              🔧 Book Service Now
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="gs-stats-bar">
        {stats.map(s => (
          <div className="gs-stat" key={s.label}>
            <span className="gs-stat-value">{s.value}</span>
            <span className="gs-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Vehicle Gallery ── */}
      <div className="container py-5">
        <p className="text-danger fw-semibold text-center text-uppercase small letter-spacing mb-1">We Service</p>
        <h2 className="text-center fw-bold mb-4">All Two-Wheelers</h2>
        <div className="row g-3">
          {gallery.map(g => (
            <div className="col-6 col-md-3" key={g.label}>
              <div className="gs-gallery-card">
                <img src={g.url} alt={g.label} className="gs-gallery-img" />
                <div className="gs-gallery-label">{g.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <div className="gs-services-bg py-5">
        <div className="container">
          <p className="text-danger fw-semibold text-center text-uppercase small mb-1">What We Do</p>
          <h2 className="text-center fw-bold mb-4">Our Services</h2>
          <div className="row g-4">
            {services.map(s => (
              <div className="col-6 col-md-4" key={s.title}>
                <div className="gs-service-card">
                  <div className="gs-service-icon">{s.icon}</div>
                  <h6 className="fw-bold mt-3 mb-1">{s.title}</h6>
                  <p className="text-muted small mb-0">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div className="gs-why-bg py-5">
        <div className="container">
          <p className="text-danger fw-semibold text-center text-uppercase small mb-1">Our Promise</p>
          <h2 className="text-center fw-bold mb-4">Why Choose Us</h2>
          <div className="row g-4 text-center">
            {whyUs.map(w => (
              <div className="col-6 col-md-4" key={w.title}>
                <div className="gs-why-card">
                  <div className="gs-why-icon">{w.icon}</div>
                  <h6 className="fw-bold mt-3 mb-0">{w.title}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Online Features Strip ── */}
      <div className="container py-5">
        <p className="text-danger fw-semibold text-center text-uppercase small mb-1">Digital Garage</p>
        <h2 className="text-center fw-bold mb-4">Manage Everything Online</h2>
        <div className="row g-3 text-center">
          {[
            ['📅', 'Easy Online Booking', 'Book appointments anytime, anywhere'],
            ['📲', 'WhatsApp Updates', 'Real-time service status on WhatsApp'],
            ['🧾', 'Digital Invoices', 'Paperless billing sent directly to you'],
            ['⏰', 'Service Reminders', 'Auto reminders every 3 months'],
          ].map(([icon, title, desc]) => (
            <div className="col-6 col-md-3" key={title}>
              <div className="gs-feature-card">
                <div style={{ fontSize: 34 }}>{icon}</div>
                <h6 className="fw-bold mt-2 mb-1">{title}</h6>
                <p className="text-muted small mb-0">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact ── */}
      <div className="gs-contact-bg py-5">
        <div className="container">
          <p className="text-danger fw-semibold text-center text-uppercase small mb-1">Find Us</p>
          <h2 className="text-center fw-bold mb-4">Contact Details</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-5">
              <div className="gs-contact-card text-center h-100">
                <div className="gs-contact-icon">📞</div>
                <h6 className="fw-bold mt-3">Phone Number</h6>
                <a href="tel:08511100434" className="text-danger fw-bold text-decoration-none fs-4">
                  085111 00434
                </a>
                <p className="text-muted small mt-1 mb-0">Mon – Sat · 9 AM – 7 PM</p>
              </div>
            </div>
            <div className="col-12 col-md-5">
              <div className="gs-contact-card text-center h-100">
                <div className="gs-contact-icon">📍</div>
                <h6 className="fw-bold mt-3">Workshop Location</h6>
                <p className="text-muted small mb-3">
                  Shop no.1, Shlok Residency, near Bank of Baroda,<br />
                  opp. Navnirman Bank, New Ranip,<br />
                  Ahmedabad, Gujarat 382470
                </p>
                <a
                  href="https://share.google/tzE9CUZbmJ3uOvq5p"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-danger btn-sm px-4"
                >
                  📍 Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="gs-footer">
        <div className="container text-center">
          <p className="fw-bold mb-1">🏍️ Patel Service Station</p>
          <p className="small opacity-50 mb-0">© 2025 New Ranip Two-Wheeler Service Station, Ahmedabad · Gujarat</p>
        </div>
      </footer>
    </>
  );
}
