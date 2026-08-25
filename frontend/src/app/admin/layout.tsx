'use client';

import React from 'react';
import { AuthProvider } from '../../context/admin/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}
