'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminFetch } from '../../lib/admin/api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EDITOR';
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (token: string, user: AdminUser) => void;
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
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      // If we are on admin login page, don't force redirect
      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      if (pathname.startsWith('/admin')) {
        const token = localStorage.getItem('ismail_admin_token');
        if (!token) {
          setUser(null);
          setLoading(false);
          router.replace('/admin/login');
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
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const login = (token: string, userData: AdminUser) => {
    localStorage.setItem('ismail_admin_token', token);
    localStorage.setItem('ismail_admin_user', JSON.stringify(userData));
    setUser(userData);
    router.push('/admin');
  };

  const logout = () => {
    localStorage.removeItem('ismail_admin_token');
    localStorage.removeItem('ismail_admin_user');
    setUser(null);
    if (pathname !== '/admin/login') {
      router.push('/admin/login');
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
