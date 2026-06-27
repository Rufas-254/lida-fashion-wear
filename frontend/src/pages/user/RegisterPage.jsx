import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())                      e.fullName        = 'Full name is required';
    if (!form.email.trim())                          e.email           = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))       e.email           = 'Enter a valid email';
    if (!form.password)                              e.password        = 'Password is required';
    else if (form.password.length < 6)               e.password        = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)      e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password });
      navigate('/shop');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (id, label, type, key, placeholder) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label className="label-luxury" htmlFor={id}>{label}</label>
      <input id={id} type={type} className="input-luxury" placeholder={placeholder}
        value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      {errors[key] && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-error)', marginTop: '0.3rem' }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--color-bg)' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="font-display gold-text" style={{ fontSize: '1.6rem', fontWeight: 700 }}>LIDA FASHION WEAR</h1>
          </Link>
          <p className="font-body" style={{ color: 'var(--color-muted)', fontSize: '1rem', fontStyle: 'italic', marginTop: '0.25rem' }}>Dressed in Excellence.</p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '0.25rem', textAlign: 'center' }}>Create Account</h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-muted)', textAlign: 'center', marginBottom: '2rem' }}>Join the LIDA family today</p>

          <form onSubmit={handleSubmit} noValidate>
            {field('reg-name',    'Full Name',        'text',     'fullName',        'Your full name')}
            {field('reg-email',   'Email Address',    'email',    'email',           'you@example.com')}
            {field('reg-phone',   'Phone Number',     'tel',      'phone',           '+254 7XX XXX XXX')}
            {field('reg-pass',    'Password',         'password', 'password',        '••••••••')}
            {field('reg-confirm', 'Confirm Password', 'password', 'confirmPassword', '••••••••')}

            <button id="register-submit-btn" type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-muted)', textAlign: 'center', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
