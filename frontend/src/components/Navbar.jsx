import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [isScrolled,     setIsScrolled]     = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [userDropOpen,   setUserDropOpen]   = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/',              label: 'Home' },
    { to: '/shop',          label: 'Shop' },
    { to: '/shop?category=Jerseys', label: 'Jerseys', highlight: true },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="container-lida">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

            {/* ── Logo ── */}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span className="font-display gold-text" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                LIDA FASHION WEAR
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div style={{ display: 'none', gap: '2.5rem', alignItems: 'center' }} className="desktop-nav">
              {navLinks.map(({ to, label, highlight }) => (
                <NavLink
                  key={to}
                  to={to}
                  style={({ isActive }) => ({
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive || highlight ? 'var(--color-gold)' : 'var(--color-muted)',
                    transition: 'var(--transition-base)',
                    borderBottom: highlight ? '1px solid var(--color-gold)' : 'none',
                    paddingBottom: highlight ? '2px' : '0',
                  })}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* ── Right Icons ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {/* Cart Icon */}
              <Link to="/cart" style={{ position: 'relative', color: 'var(--color-white)', textDecoration: 'none' }}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: 'var(--color-gold)', color: '#0A0A0A',
                    borderRadius: '50%', width: '18px', height: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-ui)',
                  }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Icon / Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  id="user-menu-btn"
                  onClick={() => setUserDropOpen(!userDropOpen)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: isAuthenticated ? 'var(--color-gold)' : 'var(--color-white)',
                    transition: 'var(--transition-base)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>

                {userDropOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '36px',
                    background: 'var(--color-surface)', border: 'var(--border-gold)',
                    borderRadius: '4px', minWidth: '180px', zIndex: 50,
                    boxShadow: 'var(--shadow-gold)',
                  }}>
                    {isAuthenticated ? (
                      <>
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(138,111,46,0.3)' }}>
                          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Signed in as</p>
                          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-white)', marginTop: '2px' }}>{user?.fullName}</p>
                        </div>
                        <Link to="/my-orders" onClick={() => setUserDropOpen(false)} style={{ display: 'block', padding: '0.7rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-white)', textDecoration: 'none', transition: 'var(--transition-base)' }}
                          onMouseEnter={(e) => e.target.style.color = 'var(--color-gold)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--color-white)'}
                        >
                          My Orders
                        </Link>
                        <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.7rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', borderTop: '1px solid rgba(138,111,46,0.2)' }}>
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setUserDropOpen(false)} style={{ display: 'block', padding: '0.7rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-gold)', textDecoration: 'none' }}>
                          Login
                        </Link>
                        <Link to="/register" onClick={() => setUserDropOpen(false)} style={{ display: 'block', padding: '0.7rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-white)', textDecoration: 'none', borderTop: '1px solid rgba(138,111,46,0.2)' }}>
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                id="mobile-menu-btn"
                className="mobile-only"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-white)', display: 'flex', flexDirection: 'column', gap: '5px' }}
              >
                {mobileOpen ? (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.97)',
          zIndex: 45, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '2rem',
        }}>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <Link to="/" className="font-display gold-text" style={{ fontSize: '1.4rem', textDecoration: 'none', marginBottom: '1rem' }} onClick={() => setMobileOpen(false)}>
            LIDA FASHION WEAR
          </Link>

          {navLinks.map(({ to, label, highlight }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: highlight ? 'var(--color-gold)' : 'var(--color-white)',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link to="/my-orders" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--color-muted)', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>My Orders</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={{ background: 'none', border: '1px solid var(--color-error)', color: 'var(--color-error)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 2rem', cursor: 'pointer', borderRadius: '2px' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-gold" style={{ marginTop: '1rem' }}>Login</Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-only { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
