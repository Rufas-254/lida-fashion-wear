import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { formatCurrency } from '../../utils/formatCurrency';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod',   value: 'Cash on Delivery', desc: 'Pay when your order arrives' },
  { id: 'mpesa', value: 'M-Pesa',           desc: 'Mobile money payment' },
  { id: 'card',  value: 'Card',             desc: 'Credit or debit card' },
];

const STEPS = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const { cartItems, cartTotal, getOrderItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: user?.fullName || '',
    phone:    user?.phone    || '',
    street:   user?.address?.street  || '',
    city:     user?.address?.city    || '',
    country:  user?.address?.country || 'Kenya',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [errors, setErrors] = useState({});

  const validateShipping = () => {
    const e = {};
    if (!shipping.fullName.trim()) e.fullName = 'Full name is required';
    if (!shipping.phone.trim())    e.phone    = 'Phone number is required';
    if (!shipping.street.trim())   e.street   = 'Street address is required';
    if (!shipping.city.trim())     e.city     = 'City is required';
    if (!shipping.country.trim())  e.country  = 'Country is required';
    return e;
  };

  const handleNext = () => {
    if (step === 0) {
      const errs = validateShipping();
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        items: getOrderItems(),
        shippingAddress: { street: shipping.street, city: shipping.city, country: shipping.country },
        paymentMethod,
      };
      const { data } = await axiosInstance.post('/orders', payload);
      clearCart();
      navigate(`/order-success/${data.order._id}`, { state: { order: data.order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputField = (label, key, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label className="label-luxury" htmlFor={`checkout-${key}`}>{label}</label>
      <input
        id={`checkout-${key}`}
        type={type}
        className="input-luxury"
        placeholder={placeholder}
        value={shipping[key]}
        onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })}
      />
      {errors[key] && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-error)', marginTop: '0.3rem' }}>{errors[key]}</p>}
    </div>
  );

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page-enter">
      <div className="container-lida" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '860px' }}>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '2rem' }}>Checkout</h1>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '2.5rem' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: i <= step ? 'var(--color-gold)' : 'var(--color-surface-2)',
                  border: i <= step ? '1px solid var(--color-gold)' : 'var(--border-gold-dim)',
                  color: i <= step ? '#0A0A0A' : 'var(--color-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700,
                  transition: 'var(--transition-base)',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: i <= step ? 'var(--color-gold)' : 'var(--color-muted)' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: '1px', background: i < step ? 'var(--color-gold)' : 'rgba(138,111,46,0.3)', margin: '0 0.75rem', marginBottom: '1.5rem', transition: 'background 0.3s ease' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
          {/* ── Step Content ── */}
          <div className="card" style={{ padding: '2rem' }}>
            {step === 0 && (
              <>
                <h2 className="font-display" style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Shipping Details</h2>
                {inputField('Full Name',      'fullName', 'text', 'Your full name')}
                {inputField('Phone Number',   'phone',    'tel',  '+254 7XX XXX XXX')}
                {inputField('Street Address', 'street',   'text', '123 Main Street')}
                {inputField('City',           'city',     'text', 'Nairobi')}
                {inputField('Country',        'country',  'text', 'Kenya')}
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="font-display" style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Payment Method</h2>
                {PAYMENT_METHODS.map(({ id, value, desc }) => (
                  <label key={id} htmlFor={`pay-${id}`} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem', marginBottom: '0.75rem', cursor: 'pointer',
                    background: paymentMethod === value ? 'rgba(201,168,76,0.08)' : 'var(--color-surface-2)',
                    border: paymentMethod === value ? '1px solid var(--color-gold)' : 'var(--border-gold-dim)',
                    borderRadius: '4px', transition: 'var(--transition-base)',
                  }}>
                    <input id={`pay-${id}`} type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} style={{ accentColor: 'var(--color-gold)' }} />
                    <div>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-white)', fontWeight: 500 }}>{value}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>{desc}</p>
                    </div>
                  </label>
                ))}
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-display" style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Order Review</h2>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Shipping To</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-white)', lineHeight: 1.6 }}>
                    {shipping.fullName}<br/>{shipping.street}, {shipping.city}, {shipping.country}
                  </p>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Payment</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-white)' }}>{paymentMethod}</p>
                </div>
                <hr className="section-divider" />
                <div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Items</p>
                  {cartItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-muted)' }}>{item.productName} × {item.quantity}</span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-white)' }}>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Back</button>
              )}
              {step < 2 ? (
                <button id="checkout-next-btn" onClick={handleNext} className="btn-gold" style={{ flex: 1, justifyContent: 'center' }}>Continue</button>
              ) : (
                <button id="place-order-btn" onClick={handlePlaceOrder} disabled={loading} className="btn-gold" style={{ flex: 1, justifyContent: 'center' }}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 className="font-display" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Summary</h3>
            {cartItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--color-muted)' }}>{item.productName} ({item.size}) ×{item.quantity}</span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--color-white)' }}>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <hr className="section-divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="font-display" style={{ fontSize: '1rem' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(cartTotal)}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
