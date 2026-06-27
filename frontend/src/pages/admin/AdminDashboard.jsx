import { useState, useEffect } from 'react';
import { adminAxios } from '../../api/axiosInstance';
import AdminSidebar from '../../components/AdminSidebar';
import { FullPageLoader } from '../../components/LoadingSpinner';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const StatCard = ({ label, value, sub, icon, color = 'var(--color-gold)' }) => (
  <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
    <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }}>
      {icon}
    </div>
    <div>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>{sub}</p>}
    </div>
  </div>
);

const STATUS_COLORS = {
  'Pending':          '#C9A84C',
  'Confirmed':        '#E8C97A',
  'Processing':       '#4A90D9',
  'Shipped':          '#9B59B6',
  'Out for Delivery': '#E67E22',
  'Delivered':        '#27AE60',
  'Cancelled':        '#C0392B',
};

const AdminDashboard = () => {
  const [stats,   setStats]   = useState(null);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          adminAxios.get('/orders/admin/stats'),
          adminAxios.get('/orders?limit=10'),
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data.orders);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FullPageLoader text="Loading dashboard..." />
      </div>
    </div>
  );

  const chartData = stats?.statusBreakdown?.map(item => ({
    name:  item._id,
    count: item.count,
    fill:  STATUS_COLORS[item._id] || '#7A7A7A',
  })) || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="font-display" style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
            {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <StatCard label="Orders Today"    value={stats?.todayOrders ?? 0}       icon="📦" color="var(--color-gold)" />
          <StatCard label="Total Revenue"   value={formatCurrency(stats?.totalRevenue ?? 0)} icon="💰" color="var(--color-success)" sub="All paid orders" />
          <StatCard label="Pending Orders"  value={stats?.pendingOrders ?? 0}      icon="⏳" color="#E67E22" sub="Awaiting action" />
          <StatCard label="Active Orders"   value={orders.length}                   icon="🚚" color="#4A90D9" sub="Recently placed" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Chart */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Orders by Status</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontFamily: 'Montserrat', fontSize: 10, fill: '#7A7A7A' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: 'Montserrat', fontSize: 10, fill: '#7A7A7A' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #8A6F2E', borderRadius: '4px', fontFamily: 'Montserrat', fontSize: '12px', color: '#F5F0E8' }}
                    cursor={{ fill: 'rgba(201,168,76,0.05)' }}
                  />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {chartData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem' }}>No order data yet</div>
            )}
          </div>

          {/* Quick actions */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Manage Products',   to: '/admin/products',   icon: '👕' },
                { label: 'Manage Categories', to: '/admin/categories', icon: '📂' },
                { label: 'View All Orders',   to: '/admin/orders',     icon: '📋' },
                { label: 'View Storefront',   to: '/',                 icon: '🌐' },
              ].map(({ label, to, icon }) => (
                <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-surface-2)', border: 'var(--border-gold-dim)', borderRadius: '4px', textDecoration: 'none', color: 'var(--color-white)', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', transition: 'var(--transition-base)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.color = 'var(--color-gold)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(138,111,46,0.6)'; e.currentTarget.style.color = 'var(--color-white)'; }}
                >
                  <span>{icon}</span>{label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.1rem' }}>Recent Orders</h2>
            <Link to="/admin/orders" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-gold)', textDecoration: 'none', letterSpacing: '0.06em' }}>View All →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(138,111,46,0.2)' }}>
                  {['Order #', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid rgba(138,111,46,0.1)' }}>
                    <td style={{ padding: '0.75rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-gold)' }}>{o.orderNumber}</td>
                    <td style={{ padding: '0.75rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-white)' }}>{o.user?.fullName || '—'}</td>
                    <td style={{ padding: '0.75rem', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-white)' }}>{formatCurrency(o.totalAmount)}</td>
                    <td style={{ padding: '0.75rem' }}><OrderStatusBadge status={o.status} /></td>
                    <td style={{ padding: '0.75rem', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
