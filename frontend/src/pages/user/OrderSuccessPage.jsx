import { useParams, useLocation, Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import Footer from '../../components/Footer';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { state }   = useLocation();
  const order       = state?.order;

  return (
    <div className="page-enter">
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '560px', width: '100%' }}>
          {/* Checkmark */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(39,174,96,0.1)', border: '2px solid var(--color-success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem', fontSize: '2rem',
          }}>
            ✓
          </div>

          <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.75rem' }}>
            Order Placed Successfully!
          </h1>
          <p className="font-body" style={{ color: 'var(--color-muted)', fontSize: '1.1rem', marginBottom: '2rem', fontStyle: 'italic' }}>
            Thank you for shopping with LIDA FASHION WEAR. Your order is confirmed.
          </p>

          {/* Order Number */}
          {order?.orderNumber && (
            <div style={{ background: 'var(--color-surface)', border: 'var(--border-gold)', borderRadius: '4px', padding: '1.5rem', marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Order Number
              </p>
              <p className="font-display gold-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {order.orderNumber}
              </p>
              {order.totalAmount && (
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
                  Total: <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{formatCurrency(order.totalAmount)}</span>
                </p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link id="track-order-btn" to={`/my-orders/${orderId}`} className="btn-gold" style={{ fontSize: '0.8rem' }}>
              Track My Order
            </Link>
            <Link id="continue-shopping-btn" to="/shop" className="btn-outline" style={{ fontSize: '0.8rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
