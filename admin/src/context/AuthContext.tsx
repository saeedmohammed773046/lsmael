'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '../types';
import { adminFetch } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('ismail_admin_token');
      if (!token) {
        setLoading(false);
        if (pathname !== '/login') {
          router.push('/login');
        }
        return;
      }

      try {
        const res = await adminFetch('/auth/me');
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('ismail_admin_token', token);
    localStorage.setItem('ismail_admin_user', JSON.stringify(userData));
    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('ismail_admin_token');
    localStorage.removeItem('ismail_admin_user');
    setUser(null);
    if (pathname !== '/login') {
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
