'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Eye, MessageCircle, Phone, CalendarCheck } from 'lucide-react';
import { adminFetch } from '../../lib/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminFetch('/analytics/admin/stats');
        if (res.success) setStats(res.data);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-gray-500">جاري تحميل الإحصائيات...</div>;
  }

  const counts = stats?.counts || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-obsidian-900">
          إحصائيات وتفاعل الزوار
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          رصد معدلات المشاهدة، نقرات الواتساب، والاتصالات الواردة.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold">نقرات الواتساب</span>
            <MessageCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{counts.whatsappClicks || 0}</div>
          <p className="text-[11px] text-gray-400">استفسارات مباشرة من العملاء</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold">نقرات الاتصال</span>
            <Phone className="w-5 h-5 text-gold-600" />
          </div>
          <div className="text-3xl font-black text-gold-700">{counts.phoneClicks || 0}</div>
          <p className="text-[11px] text-gray-400">اتصال مباشر عبر رقم الهاتف</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold">إجمالي الحجوزات</span>
            <CalendarCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-600">{counts.totalBookings || 0}</div>
          <p className="text-[11px] text-gray-400">{counts.confirmedBookings || 0} حجز مؤكد</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold">الأصناف المنشورة</span>
            <Eye className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-600">{counts.publishedProducts || 0}</div>
          <p className="text-[11px] text-gray-400">من إجمالي {counts.totalProducts || 0} صنف</p>
        </div>
      </div>
    </div>
  );
}
