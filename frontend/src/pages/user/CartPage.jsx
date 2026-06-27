import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/CartItem';
import { formatCurrency } from '../../utils/formatCurrency';
import Footer from '../../components/Footer';

const CartPage = () => {
  const { cartItems, cartTotal, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page-enter">
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '3rem' }}>
          <svg width="60" height="60" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="1.2" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <h2 className="font-display" style={{ fontSize: '1.8rem', color: 'var(--color-muted)' }}>Your Cart is Empty</h2>
          <p className="font-body" style={{ color: 'var(--color-muted)', fontSize: '1.05rem' }}>Discover our premium collection and add your favourites.</p>
          <Link to="/shop" className="btn-gold" id="browse-shop-btn">Browse the Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="container-lida" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.25rem' }}>Your Cart</h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '2.5rem' }}>
          {cartCount} item{cartCount !== 1 ? 's' : ''}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
          {/* ── Items List ── */}
          <div style={{ minWidth: 0 }}>
            {cartItems.map((item, i) => <CartItem key={i} item={item} />)}
          </div>

          {/* ── Order Summary ── */}
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <h3 className="font-display" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--color-muted)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--color-white)' }}>{formatCurrency(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(138,111,46,0.2)' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--color-muted)' }}>Shipping</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>To be confirmed</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-white)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.2rem', color: 'var(--color-gold)', fontWeight: 700 }}>{formatCurrency(cartTotal)}</span>
            </div>

            <Link id="checkout-btn" to="/checkout" className="btn-gold" style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: '0.8rem' }}>
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="btn-outline" style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
