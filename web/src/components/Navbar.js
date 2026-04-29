import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => { logout(); navigate('/'); };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🔧 Patel Service Station</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {user ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/book">Book Service</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/appointments">My Appointments</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/vehicles">My Vehicles</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/history">Service History</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/feedback">Feedback</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/offers">Offers</Link></li>
                {isAdmin && <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>}

                {/* Profile Dropdown */}
                <li className="nav-item" ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: '2px solid rgba(255,255,255,0.5)',
                      borderRadius: '50px',
                      padding: '4px 12px 4px 4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      color: 'white',
                    }}
                  >
                    {/* Avatar circle */}
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'white', color: '#dc3545',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: 13, flexShrink: 0,
                    }}>
                      {getInitials(user.name)}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: 10 }}>▼</span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      minWidth: 220, zIndex: 1000, overflow: 'hidden',
                    }}>
                      {/* Profile Header */}
                      <div style={{ background: '#dc3545', padding: '16px', textAlign: 'center' }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: '50%',
                          background: 'white', color: '#dc3545',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: 20, margin: '0 auto 8px',
                        }}>
                          {getInitials(user.name)}
                        </div>
                        <div style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>{user.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{user.phone}</div>
                        {user.email && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{user.email}</div>}
                        <span style={{
                          display: 'inline-block', marginTop: 6,
                          background: isAdmin ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
                          color: 'white', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600,
                        }}>
                          {isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div style={{ padding: '8px 0' }}>
                        <Link to="/vehicles" onClick={() => setDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: 14 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          🏍️ My Vehicles
                        </Link>
                        <Link to="/appointments" onClick={() => setDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: 14 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          📅 My Appointments
                        </Link>
                        <Link to="/history" onClick={() => setDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#333', textDecoration: 'none', fontSize: 14 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          🔍 Service History
                        </Link>
                        <hr style={{ margin: '4px 0', borderColor: '#eee' }} />
                        <button onClick={handleLogout}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#dc3545', background: 'none', border: 'none', width: '100%', textAlign: 'left', fontSize: 14, cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
}
