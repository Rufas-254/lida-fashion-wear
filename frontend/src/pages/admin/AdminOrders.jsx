import { useState, useEffect } from 'react';
import { adminAxios } from '../../api/axiosInstance';
import AdminSidebar from '../../components/AdminSidebar';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { FullPageLoader } from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders,      setOrders]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [selOrder,    setSelOrder]    = useState(null);
  const [updating,    setUpdating]    = useState(false);
  
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [statusFilter,setStatusFilter]= useState('');
  
  const [updateForm,  setUpdateForm]  = useState({ status: '', trackingNote: '' });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await adminAxios.get('/orders', { params });
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (e) { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const openUpdateModal = (order) => {
    setSelOrder(order);
    setUpdateForm({ status: order.status, trackingNote: order.trackingNote || '' });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await adminAxios.put(`/orders/${selOrder._id}/status`, updateForm);
      toast.success('Order updated successfully');
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.8rem' }}>Orders</h1>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>Manage customer orders and shipments</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '1.5rem' }}>
          <select className="input-luxury" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ width: 'auto', minWidth: '180px' }}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <FullPageLoader text="Loading orders..." />
        ) : (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(138,111,46,0.2)' }}>
                  {['Order #', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} style={{ borderBottom: '1px solid rgba(138,111,46,0.08)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 600 }}>{o.orderNumber}</td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                      {new Date(o.createdAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-white)' }}>
                      {o.shippingAddress.fullName || o.user?.fullName || '—'}<br/>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>{o.shippingAddress.phone}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-white)' }}>{o.items.reduce((acc, curr) => acc + curr.quantity, 0)}</td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 600 }}>{formatCurrency(o.totalAmount)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}><OrderStatusBadge status={o.status} /></td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className="badge" style={{ color: o.paymentStatus === 'Paid' ? 'var(--color-success)' : 'var(--color-error)', background: o.paymentStatus === 'Paid' ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)', border: `1px solid ${o.paymentStatus === 'Paid' ? 'rgba(39,174,96,0.3)' : 'rgba(192,57,43,0.3)'}`, fontSize: '0.6rem' }}>
                        {o.paymentMethod} · {o.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button id={`update-order-${o._id}`} onClick={() => openUpdateModal(o)} className="btn-outline" style={{ fontSize: '0.65rem', padding: '0.3rem 0.7rem' }}>Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-muted)' }}>No orders found.</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', borderRadius: '2px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', cursor: 'pointer', background: p === page ? 'var(--color-gold)' : 'transparent', color: p === page ? '#0A0A0A' : 'var(--color-muted)', border: p === page ? '1px solid var(--color-gold)' : 'var(--border-gold-dim)' }}>{p}</button>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && selOrder && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(138,111,46,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="font-display" style={{ fontSize: '1.3rem' }}>Update Order {selOrder.orderNumber}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '1.2rem' }}>✕</button>
            </div>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(138,111,46,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
               <div>
                 <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Customer Details</p>
                 <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-white)', lineHeight: 1.5 }}>
                   {selOrder.shippingAddress.fullName}<br/>
                   {selOrder.shippingAddress.phone}<br/>
                   {selOrder.shippingAddress.street}, {selOrder.shippingAddress.city}
                 </p>
               </div>
               <div>
                 <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Order Info</p>
                 <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-white)', lineHeight: 1.5 }}>
                   Total: {formatCurrency(selOrder.totalAmount)}<br/>
                   Payment: {selOrder.paymentMethod} ({selOrder.paymentStatus})<br/>
                   Items: {selOrder.items.length}
                 </p>
               </div>
            </div>

            <form onSubmit={handleUpdate} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label-luxury">Order Status</label>
                <select className="input-luxury" value={updateForm.status} onChange={e => setUpdateForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label-luxury">Tracking Note (Visible to Customer)</label>
                <textarea className="input-luxury" value={updateForm.trackingNote} onChange={e => setUpdateForm(f => ({ ...f, trackingNote: e.target.value }))} placeholder="e.g. Package dispatched via Fargo Courier, Tracking #123456" rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline" style={{ fontSize: '0.78rem' }}>Cancel</button>
                <button id="save-order-btn" type="submit" className="btn-gold" disabled={updating} style={{ fontSize: '0.78rem' }}>
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
