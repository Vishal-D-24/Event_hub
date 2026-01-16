import React from 'react';
import axios from 'axios';

export const AuthContext = React.createContext(null);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  withCredentials: true
});

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get('/api/auth/me')
      .then(r => setUser(r.data || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Normalize user object
  const normalizeUser = (data, role) => {
    if (!data) return null;
    return { ...data, role };
  };

  // Organization Login
  const loginOrganization = async (email, password) => {
    const r = await api.post('/api/organization/login', { email, password });
    const userData = normalizeUser(r.data, "organization");
    setUser(userData);
    return userData;
  };

  // Organization Signup
  const signupOrganization = async (data) => {
    const r = await api.post('/api/organization/signup', data);
    const userData = normalizeUser(r.data, "organization");
    setUser(userData);
    return userData;
  };

  // Event Manager Login
  const loginEventManager = async (email, password) => {
    const r = await api.post('/api/event-manager/login', { email, password });
    const userData = normalizeUser(r.data, "eventManager");
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginOrganization,
    signupOrganization,
    loginEventManager,
    logout,
    api
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
