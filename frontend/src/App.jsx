import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// User Pages
import HomePage from './pages/user/HomePage';
import ShopPage from './pages/user/ShopPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderSuccessPage from './pages/user/OrderSuccessPage';
import MyOrdersPage from './pages/user/MyOrdersPage';
import OrderTrackingPage from './pages/user/OrderTrackingPage';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';

const App = () => {
  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-white)',
            border: 'var(--border-gold-dim)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.85rem'
          },
          success: { iconTheme: { primary: 'var(--color-success)', secondary: '#0A0A0A' } },
          error: { iconTheme: { primary: 'var(--color-error)', secondary: '#0A0A0A' } }
        }} 
      />
      
      <Routes>
        {/* ─── Admin Routes ─────────────────────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>

        {/* ─── User Routes ──────────────────────────────────────────────── */}
        <Route element={
          <>
            <Navbar />
            <main style={{ minHeight: '80vh' }}>
              <Outlet />
            </main>
          </>
        }>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/my-orders/:orderId" element={<OrderTrackingPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
