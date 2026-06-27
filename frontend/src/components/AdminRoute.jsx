import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { FullPageLoader } from './LoadingSpinner';

const AdminRoute = () => {
  const { isAdminAuthenticated, loading } = useAdminAuth();

  if (loading) return <FullPageLoader />;

  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
