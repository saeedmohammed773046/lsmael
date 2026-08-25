import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';

export const metadata: Metadata = {
  title: 'لوحة تحكم إسماعيل للأفراح والمناسبات',
  description: 'نظام إدارة الأصناف والحجوزات والمعرض ومستلزمات الأفراح',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#F8F9FA] antialiased">
        <AuthProvider>
          <AdminLayout>{children}</AdminLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
