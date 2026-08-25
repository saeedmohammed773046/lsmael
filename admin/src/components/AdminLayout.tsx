'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Package,
  CalendarCheck,
  Image as ImageIcon,
  Tag,
  BarChart3,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page or loading auth, render children directly
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-obsidian-700">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'الرئيسية', href: '/', icon: LayoutDashboard },
    { label: 'الأقسام والتصنيفات', href: '/categories', icon: Layers },
    { label: 'إدارة الأصناف', href: '/products', icon: Package },
    { label: 'طلبات الحجز', href: '/bookings', icon: CalendarCheck },
    { label: 'معرض الأعمال', href: '/gallery', icon: ImageIcon },
    { label: 'العروض والباقات', href: '/offers', icon: Tag },
    { label: 'الإحصائيات والزيارات', href: '/analytics', icon: BarChart3 },
    { label: 'إعدادات الموقع', href: '/settings', icon: Settings },
    { label: 'الملف الشخصي', href: '/account', icon: User },
  ];

  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ismael-w3h7.onrender.com';

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row text-obsidian-900 font-sans">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-white text-gray-900 px-4 py-3.5 flex justify-between items-center border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-500 text-black flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm text-black">لوحة تحكم إسماعيل للأفراح</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-700 hover:text-black"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 right-0 z-50 h-screen w-64 bg-white text-gray-900 flex flex-col justify-between border-l border-gray-200 shadow-sm transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Brand */}
          <div className="flex items-center gap-3 pb-5 border-b border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-500 to-gold-400 text-black flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-black">إسماعيل للأفراح</h2>
              <span className="text-[12px] text-gray-700 block font-bold">لوحة الإدارة والتحكم</span>
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gold-500 text-black shadow-sm font-extrabold'
                      : 'text-black hover:text-black hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-gray-800'}`} />
                  <span className="text-black">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User Details & Logout */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-xs font-extrabold text-black truncate max-w-[120px]">{user?.name || 'المدير'}</p>
              <span className="text-[10px] text-gray-600 font-bold">{user?.role === 'ADMIN' ? 'مدير النظام' : 'مشرف'}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <a
            href={frontendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-gray-100 text-black rounded-xl text-xs font-bold transition-colors border border-gray-300 shadow-xs"
          >
            <span className="text-black">زيارة الموقع العام</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-700" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
          <div className="text-sm font-semibold text-obsidian-700">
            مرحباً بك، <span className="font-bold text-obsidian-900">{user?.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={frontendUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 bg-gold-50 hover:bg-gold-100 border border-gold-200 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              <span>معاينة الموقع كعميل</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
