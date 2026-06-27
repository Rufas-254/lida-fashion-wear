import { createContext, useContext, useState, useEffect } from 'react';
import { adminAxios } from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lida_admin_token');
    const saved = localStorage.getItem('lida_admin');
    if (token && saved) {
      try { setAdmin(JSON.parse(saved)); }
      catch { localStorage.removeItem('lida_admin'); }
    }
    setLoading(false);
  }, []);

  const adminLogin = async (email, password) => {
    const { data } = await adminAxios.post('/auth/admin/login', { email, password });
    localStorage.setItem('lida_admin_token', data.token);
    localStorage.setItem('lida_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    toast.success(`Welcome, ${data.admin.fullName}! 👑`);
    return data;
  };

  const adminLogout = () => {
    localStorage.removeItem('lida_admin_token');
    localStorage.removeItem('lida_admin');
    setAdmin(null);
    toast.success('Admin logged out');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, adminLogin, adminLogout, isAdminAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

export default AdminAuthContext;
