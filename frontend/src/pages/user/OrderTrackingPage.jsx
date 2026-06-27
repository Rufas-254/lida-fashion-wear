import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import TrackingTimeline from '../../components/TrackingTimeline';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { FullPageLoader } from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';
import Footer from '../../components/Footer';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [orderId]);

  if (loading) return <FullPageLoader text="Loading order..." />;
  if (!order) return (
    <div style={{ textAlign: 'center', padding: '5rem', minHeight: '60vh' }}>
      <p className="font-display" style={{ fontSize: '1.5rem', color: 'var(--color-muted)' }}>Order not found</p>
      <Link to="/my-orders" className="btn-outline" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>My Orders</Link>
    </div>
  );

  return (
    <div className="page-enter">
      <div className="container-lida" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '900px' }}>
        {/* Header */}
        <Link to="/my-orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)', textDecoration: 'none', marginBottom: '2rem', letterSpacing: '0.06em' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-muted)'}
        >
          ← My Orders
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '0.3rem' }}>
              {new Date(order.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="font-display gold-text" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>{order.orderNumber}</h1>
          </div>
          <OrderStatusBadge status={order.status} size="lg" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          {/* ── Tracking Timeline ── */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Order Tracking</h2>
            <TrackingTimeline status={order.status} trackingNote={order.trackingNote} />
          </div>

          {/* ── Order Details ── */}
          <div>
            {/* Items */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h2 className="font-display" style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Items Ordered</h2>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: i < order.items.length - 1 ? '1rem' : '0', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '3px', overflow: 'hidden', background: 'var(--color-surface-2)', flexShrink: 0 }}>
                    {item.productImage && <img src={item.productImage} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-white)' }}>{item.productName}</p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                      Size: {item.size} {item.color && `· ${item.color}`} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
              <hr className="section-divider" style={{ margin: '1.25rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="font-display" style={{ fontSize: '1rem' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-gold)', fontWeight: 700, fontSize: '1rem' }}>
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Shipping + Payment */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Shipping Address</p>
                <p className="font-body" style={{ fontSize: '0.95rem', color: 'var(--color-white)', lineHeight: 1.6 }}>
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Payment Method</p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-white)' }}>{order.paymentMethod}</p>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Payment Status</p>
                  <span className="badge" style={{ color: order.paymentStatus === 'Paid' ? 'var(--color-success)' : 'var(--color-error)', background: order.paymentStatus === 'Paid' ? 'rgba(39,174,96,0.12)' : 'rgba(192,57,43,0.12)', border: `1px solid ${order.paymentStatus === 'Paid' ? 'rgba(39,174,96,0.3)' : 'rgba(192,57,43,0.3)'}` }}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
