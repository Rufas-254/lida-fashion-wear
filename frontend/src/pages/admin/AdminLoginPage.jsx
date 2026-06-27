import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const { adminLogin } = useAdminAuth();
  const navigate        = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email is required';
    if (!form.password)        e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
      {/* Left decorative panel */}
      <div style={{ flex: 1, background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', borderRight: '1px solid rgba(138,111,46,0.3)' }} className="admin-login-panel">
        <h1 className="font-display gold-text" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, textAlign: 'center', marginBottom: '1rem' }}>
          LIDA FASHION WEAR
        </h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-dim)', marginBottom: '3rem' }}>
          Admin Panel
        </p>
        <div style={{ maxWidth: '320px', textAlign: 'center' }}>
          <p className="font-body" style={{ fontSize: '1.1rem', color: 'var(--color-muted)', fontStyle: 'italic', lineHeight: 1.8 }}>
            "Manage your empire. Control your catalogue. Deliver excellence."
          </p>
        </div>
        <Link to="/" style={{ marginTop: '3rem', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'rgba(138,111,46,0.5)', textDecoration: 'none', letterSpacing: '0.06em' }}>
          ← Back to Storefront
        </Link>
      </div>

      {/* Right login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Admin Login</h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '2rem' }}>Sign in to your admin account</p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="label-luxury" htmlFor="admin-email">Admin Email</label>
              <input id="admin-email" type="email" className="input-luxury" placeholder="admin@lidafashion.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-error)', marginTop: '0.3rem' }}>{errors.email}</p>}
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label className="label-luxury" htmlFor="admin-password">Password</label>
              <input id="admin-password" type="password" className="input-luxury" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              {errors.password && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-error)', marginTop: '0.3rem' }}>{errors.password}</p>}
            </div>
            <button id="admin-login-submit" type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Signing in...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .admin-login-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
