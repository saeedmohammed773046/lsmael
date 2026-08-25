'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Layers,
  CalendarCheck,
  MessageCircle,
  Phone,
  Eye,
  Plus,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';
import { adminFetch, getFullImageUrl } from '../../lib/admin/api';
import { Booking, Product } from '../../types';

interface StatsData {
  counts: {
    totalCategories: number;
    totalProducts: number;
    publishedProducts: number;
    totalBookings: number;
    newBookings: number;
    confirmedBookings: number;
    totalGalleryItems: number;
    whatsappClicks: number;
    phoneClicks: number;
  };
  topProducts: Product[];
  recentBookings: Booking[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminFetch('/analytics/admin/stats');
        if (res.success) {
          setStats(res.data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-gray-500">جاري تحميل لوحة المؤشرات...</p>
      </div>
    );
  }

  const counts = stats?.counts || {
    totalCategories: 0,
    totalProducts: 0,
    publishedProducts: 0,
    totalBookings: 0,
    newBookings: 0,
    confirmedBookings: 0,
    totalGalleryItems: 0,
    whatsappClicks: 0,
    phoneClicks: 0,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-xs">جديد</span>;
      case 'CONTACTED':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full text-xs">تم التواصل</span>;
      case 'CONFIRMED':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-xs">مؤكد</span>;
      case 'COMPLETED':
        return <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full text-xs">مكتمل</span>;
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full text-xs">ملغي</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 font-bold px-2.5 py-0.5 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-obsidian-900">
            لوحة الإحصائيات العامة
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            ملخص نشاط إسماعيل للأفراح، الحجوزات الواردة، والأصناف الأكثر طلباً.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صنف جديد</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-50 text-obsidian-800 border border-gray-200 font-bold rounded-xl text-xs transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>إدارة الأقسام</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500">إجمالي الأصناف</span>
            <div className="text-2xl font-black text-obsidian-900">{counts.totalProducts}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">{counts.publishedProducts} صنف منشور</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: New Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500">حجوزات جديدة بانتظار المراجعة</span>
            <div className="text-2xl font-black text-amber-600">{counts.newBookings}</div>
            <span className="text-[11px] text-gray-500">من إجمالي {counts.totalBookings} طلب</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: WhatsApp Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500">نقرات استفسار واتساب</span>
            <div className="text-2xl font-black text-emerald-600">{counts.whatsappClicks}</div>
            <span className="text-[11px] text-gray-500">تفاعل مباشر من الموقع</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Direct Calls */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500">نقرات الاتصال الهاتفي</span>
            <div className="text-2xl font-black text-gold-700">{counts.phoneClicks}</div>
            <span className="text-[11px] text-gray-500">من مستخدمي الجوال</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Bookings & Top Viewed Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Bookings Table (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-obsidian-900">آخر طلبات الحجز والاستفسار</h2>
              <p className="text-[11px] text-gray-500">أحدث الطلبات المستلمة من زوار الموقع</p>
            </div>
            <Link href="/admin/bookings" className="text-xs font-bold text-gold-700 hover:underline flex items-center gap-1">
              <span>عرض كل الحجوزات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats?.recentBookings.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-xs">لا توجد طلبات حجز مسجلة حتى الآن</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-bold">رقم الحجز</th>
                    <th className="pb-3 font-bold">اسم العميل</th>
                    <th className="pb-3 font-bold">الهاتف</th>
                    <th className="pb-3 font-bold">المناسبة</th>
                    <th className="pb-3 font-bold">الحالة</th>
                    <th className="pb-3 font-bold text-left">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats?.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 font-mono font-bold text-gold-800">{b.bookingNumber}</td>
                      <td className="py-3 font-bold text-obsidian-900">{b.customerName}</td>
                      <td className="py-3 text-gray-600" dir="ltr">{b.phone}</td>
                      <td className="py-3 text-gray-600">{b.eventType || 'عام'}</td>
                      <td className="py-3">{getStatusBadge(b.status)}</td>
                      <td className="py-3 text-left">
                        <Link
                          href={`/admin/bookings`}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gold-500 hover:text-obsidian-950 text-obsidian-800 font-bold rounded-lg text-[11px] transition-colors"
                        >
                          مراجعة
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-obsidian-900">الأصناف الأكثر مشاهدة</h2>
            <p className="text-[11px] text-gray-500">حسب تفاعل واهتمام الزوار</p>
          </div>

          {stats?.topProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-xs">لا توجد بيانات كافية</div>
          ) : (
            <div className="space-y-3">
              {stats?.topProducts.map((p) => {
                const img = p.images?.[0];
                return (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={getFullImageUrl(img?.imagePath)}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-obsidian-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-500">{p.category?.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gold-700 font-bold text-xs shrink-0">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{p.viewsCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
