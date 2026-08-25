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
import { useAuth } from '../../context/admin/AuthContext';
import IsmailLogo from '../IsmailLogo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page or loading auth, render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-obsidian-700">جاري التحقق وتوجيهك لصفحة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'الرئيسية والإحصائيات', href: '/admin', icon: LayoutDashboard },
    { label: 'الأقسام والتصنيفات', href: '/admin/categories', icon: Layers },
    { label: 'إدارة الأصناف والخيام', href: '/admin/products', icon: Package },
    { label: 'طلبات الحجز', href: '/admin/bookings', icon: CalendarCheck },
    { label: 'معرض الأعمال الواقعية', href: '/admin/gallery', icon: ImageIcon },
    { label: 'العروض والتخفيضات', href: '/admin/offers', icon: Tag },
    { label: 'الزيارات والتحليلات', href: '/admin/analytics', icon: BarChart3 },
    { label: 'إعدادات وأرقام الموقع', href: '/admin/settings', icon: Settings },
    { label: 'الملف الشخصي', href: '/admin/account', icon: User },
  ];

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
          <div className="flex items-center pb-4 border-b border-gray-200">
            <IsmailLogo variant="horizontal" size="sm" theme="light" />
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
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

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-700 flex items-center justify-center font-bold text-xs border border-gold-500/40">
                {user?.name ? user.name.slice(0, 1) : 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-extrabold text-black truncate">{user?.name || 'المدير العام'}</p>
                <p className="text-[10px] text-gray-600 font-mono truncate">{user?.email || 'admin@ismail.com'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="تسجيل الخروج"
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* View Website Button */}
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-gray-100 text-black text-xs font-bold rounded-xl border border-gray-300 transition-colors shadow-xs"
          >
            <span className="text-black">معاينة الموقع العام</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-700" />
          </Link>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
