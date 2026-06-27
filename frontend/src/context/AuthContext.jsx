import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-authenticate from localStorage on load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('lida_user_token');
      if (!token) { setLoading(false); return; }

      try {
        const { data } = await axiosInstance.get('/auth/me');
        setUser(data);
      } catch {
        localStorage.removeItem('lida_user_token');
        localStorage.removeItem('lida_user');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    localStorage.setItem('lida_user_token', data.token);
    localStorage.setItem('lida_user', JSON.stringify(data.user));
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.fullName.split(' ')[0]}! 👑`);
    return data;
  };

  const register = async (formData) => {
    const { data } = await axiosInstance.post('/auth/register', formData);
    localStorage.setItem('lida_user_token', data.token);
    localStorage.setItem('lida_user', JSON.stringify(data.user));
    setUser(data.user);
    toast.success('Account created successfully! Welcome to LIDA 👑');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('lida_user_token');
    localStorage.removeItem('lida_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
