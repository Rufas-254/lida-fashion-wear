import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { FullPageLoader } from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';
import Footer from '../../components/Footer';

const MyOrdersPage = () => {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page,   setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/orders/my-orders?page=${page}`);
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [page]);

  if (loading) return <FullPageLoader text="Loading orders..." />;

  return (
    <div className="page-enter">
      <div className="container-lida" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '900px' }}>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.25rem' }}>My Orders</h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '2.5rem' }}>Track and manage your LIDA Fashion Wear orders</p>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p className="font-display" style={{ fontSize: '1.5rem', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>No orders yet</p>
            <p className="font-body" style={{ color: 'var(--color-muted)', marginBottom: '1.5rem' }}>Start shopping and your orders will appear here.</p>
            <Link to="/shop" className="btn-gold">Shop Now</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((order) => (
                <div key={order._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-muted)', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="font-display gold-text" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      {order.orderNumber}
                    </p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--color-white)' }}>
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <OrderStatusBadge status={order.status} />
                    <Link
                      to={`/my-orders/${order._id}`}
                      id={`view-order-${order._id}`}
                      className="btn-outline"
                      style={{ fontSize: '0.7rem', padding: '0.5rem 1rem' }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width: '36px', height: '36px', borderRadius: '2px', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', cursor: 'pointer',
                      background: p === page ? 'var(--color-gold)' : 'transparent',
                      color: p === page ? '#0A0A0A' : 'var(--color-muted)',
                      border: p === page ? '1px solid var(--color-gold)' : 'var(--border-gold-dim)',
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrdersPage;
