import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid rgba(138,111,46,0.3)', paddingTop: '3rem', paddingBottom: '2rem', marginTop: '5rem' }}>
    <div className="container-lida">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>

        {/* Brand */}
        <div>
          <h3 className="font-display gold-text" style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>LIDA FASHION WEAR</h3>
          <p className="font-body" style={{ color: 'var(--color-muted)', fontSize: '1rem', lineHeight: 1.7, fontStyle: 'italic' }}>
            Dressed in Excellence. Where bold style meets timeless quality.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem' }}>Shop</h4>
          {[
            ['All Products', '/shop'],
            ['Jerseys', '/shop?category=Jerseys'],
            ['T-Shirts', '/shop?category=T-Shirts'],
            ['Hoodies', '/shop?category=Hoodies'],
            ['Jackets', '/shop?category=Jackets'],
          ].map(([label, to]) => (
            <Link key={to} to={to} style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--color-muted)', textDecoration: 'none', marginBottom: '0.5rem', transition: 'var(--transition-base)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-gold)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-muted)'}
            >{label}</Link>
          ))}
        </div>

        {/* Account Links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem' }}>Account</h4>
          {[
            ['Login', '/login'],
            ['Create Account', '/register'],
            ['My Orders', '/my-orders'],
            ['Cart', '/cart'],
          ].map(([label, to]) => (
            <Link key={to} to={to} style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--color-muted)', textDecoration: 'none', marginBottom: '0.5rem', transition: 'var(--transition-base)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-gold)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-muted)'}
            >{label}</Link>
          ))}
        </div>

        {/* Social */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem' }}>Connect</h4>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" style={{ color: 'var(--color-muted)', transition: 'var(--transition-base)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="#" aria-label="WhatsApp" style={{ color: 'var(--color-muted)', transition: 'var(--transition-base)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" aria-label="Facebook" style={{ color: 'var(--color-muted)', transition: 'var(--transition-base)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
          </div>
          <Link to="/admin/login" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'rgba(138,111,46,0.5)', textDecoration: 'none', letterSpacing: '0.06em' }}>
            Admin Panel
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(138,111,46,0.2)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)', letterSpacing: '0.05em' }}>
          © {new Date().getFullYear()} LIDA FASHION WEAR. All rights reserved.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(138,111,46,0.6)', fontStyle: 'italic' }}>
          Dressed in Excellence.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
