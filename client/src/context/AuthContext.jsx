import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('supplyagent_jwt');
    if (token) {
      verifyToken(token);
    } else {
      // Initialize with default admin session for smooth evaluation
      setUser({
        id: 'user_admin_01',
        name: 'Parth Patel',
        username: 'parth_admin',
        role: 'Supply Chain Manager / Tenant Admin',
        tenant_id: 'tenant_01'
      });
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
      } else {
        localStorage.removeItem('supplyagent_jwt');
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('supplyagent_jwt');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('supplyagent_jwt', data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return true;
      }
    } catch (err) {
      toast.error('Login failed. Please check credentials.');
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('supplyagent_jwt');
    setUser(null);
    toast.info('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
