import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const NAV_ITEMS = [
  {
    to:    '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to:    '/admin/products',
    label: 'Products',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    to:    '/admin/categories',
    label: 'Categories',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    to:    '/admin/orders',
    label: 'Orders',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

const AdminSidebar = () => {
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: 'var(--color-surface)',
      borderRight: '1px solid rgba(138,111,46,0.3)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(138,111,46,0.2)' }}>
        <p className="font-display gold-text" style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3 }}>
          LIDA FASHION WEAR
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-gold-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>
          Admin Panel
        </p>
      </div>

      {/* Admin info */}
      {admin && (
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(138,111,46,0.15)' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-muted)', letterSpacing: '0.06em', marginBottom: '2px' }}>Signed in as</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--color-white)', fontWeight: 500 }}>{admin.fullName}</p>
        </div>
      )}

      {/* Nav Links */}
      <nav style={{ flex: 1, paddingTop: '0.5rem' }}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(138,111,46,0.2)' }}>
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          style={{
            width: '100%', padding: '0.75rem',
            background: 'none', border: '1px solid rgba(192,57,43,0.4)',
            color: 'var(--color-error)', fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', borderRadius: '2px',
            transition: 'var(--transition-base)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(192,57,43,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
