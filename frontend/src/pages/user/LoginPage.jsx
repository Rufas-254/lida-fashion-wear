import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim())                   e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email  = 'Enter a valid email';
    if (!form.password)                        e.password = 'Password is required';
    else if (form.password.length < 6)         e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/shop');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--color-bg)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="font-display gold-text" style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              LIDA FASHION WEAR
            </h1>
          </Link>
          <p className="font-body" style={{ color: 'var(--color-muted)', fontSize: '1rem', fontStyle: 'italic', marginTop: '0.25rem' }}>
            Dressed in Excellence.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '0.25rem', textAlign: 'center' }}>Welcome Back</h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-muted)', textAlign: 'center', marginBottom: '2rem' }}>
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="label-luxury" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input-luxury"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-error)', marginTop: '0.3rem' }}>{errors.email}</p>}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="label-luxury" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="input-luxury"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-error)', marginTop: '0.3rem' }}>{errors.password}</p>}
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-muted)', textAlign: 'center', marginTop: '1.5rem' }}>
            New here?{' '}
            <Link to="/register" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
