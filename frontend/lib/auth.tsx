import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { api } from './api';
import { deleteStoredToken, getStoredToken, setStoredToken } from './tokenStorage';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'STAFF' | 'USER' | 'VEHICLE_OWNER' | 'HOTEL_OWNER';
  status?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  updateProfile: (payload: { name: string; phone?: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const response = await api.get('/auth/me');
    setUser(response.data.user);
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        const storedToken = await getStoredToken();
        if (storedToken) {
          setToken(storedToken);
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        }
      } catch {
        await deleteStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    await setStoredToken(response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }

  async function register(payload: { name: string; email: string; phone: string; password: string }) {
    const response = await api.post('/auth/register', payload);
    await setStoredToken(response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
  }

  async function updateProfile(payload: { name: string; phone?: string }) {
    const response = await api.put('/auth/profile', payload);
    setUser(response.data.user);
    return response.data.user;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout is client-owned for bearer tokens.
    }
    await deleteStoredToken();
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAdmin: user?.role === 'ADMIN' || user?.role === 'STAFF',
      login,
      register,
      updateProfile,
      logout,
      refreshUser,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
