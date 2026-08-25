'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  CalendarCheck,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Phone,
  Calendar,
  X,
  CheckCircle,
  Clock,
  Sparkles,
  MapPin,
  Tag,
} from 'lucide-react';
import { adminFetch, getFullImageUrl } from '../../../lib/admin/api';
import { Booking, BookingStatus } from '../../../types';

export default function BookingsManagerPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal State
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedStatus) query.append('status', selectedStatus);
      if (search.trim()) query.append('search', search.trim());
      query.append('page', page.toString());
      query.append('limit', '20');

      const res = await adminFetch(`/bookings/admin/all?${query.toString()}`);
      if (res.success) {
        setBookings(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.pagination.total);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await adminFetch(`/bookings/admin/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.success) {
        if (detailBooking && detailBooking.id === bookingId) {
          setDetailBooking({ ...detailBooking, status: newStatus });
        }
        fetchBookings();
      } else {
        alert(res.message || 'فشل تحديث الحالة');
      }
    } catch {
      alert('حدث خطأ أثناء تحديث الحالة');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-xs">جديد</span>;
      case 'CONTACTED':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-xs">تم التواصل</span>;
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-800 font-bold px-2.5 py-1 rounded-full text-xs">قيد المراجعة</span>;
      case 'CONFIRMED':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs">مؤكد</span>;
      case 'COMPLETED':
        return <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full text-xs">مكتمل</span>;
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full text-xs">ملغي</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-900 flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-gold-600" />
            <span>إدارة طلبات الحجز والتجهيزات</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            متابعة طلبات الحجز الواردة من الموقع وحسابات التجهيز بالريال اليمني وتحديث حالاتها
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gold-50 px-4 py-2 rounded-2xl border border-gold-200">
          <span className="text-xs font-bold text-gold-800">إجمالي الطلبات:</span>
          <span className="text-sm font-bold text-obsidian-950 font-mono">{totalCount} طلب</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث برقم الحجز، اسم العميل، الهاتف، الموقع..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white"
            />
          </form>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => { setSelectedStatus(''); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedStatus === '' ? 'bg-obsidian-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              الكل ({totalCount})
            </button>
            <button
              onClick={() => { setSelectedStatus('NEW'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedStatus === 'NEW' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              جديد
            </button>
            <button
              onClick={() => { setSelectedStatus('CONFIRMED'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedStatus === 'CONFIRMED' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              مؤكد
            </button>
            <button
              onClick={() => { setSelectedStatus('COMPLETED'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedStatus === 'COMPLETED' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              مكتمل
            </button>
            <button
              onClick={() => { setSelectedStatus('CANCELLED'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedStatus === 'CANCELLED' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ملغي
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-500">جاري تحميل طلبات الحجز...</div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CalendarCheck className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-600">لا توجد طلبات حجز مطابقة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">رقم الحجز</th>
                  <th className="py-3.5 px-4 font-bold">اسم العميل</th>
                  <th className="py-3.5 px-4 font-bold">الهاتف والموقع</th>
                  <th className="py-3.5 px-4 font-bold">المناسبة والمدة</th>
                  <th className="py-3.5 px-4 font-bold">الأصناف والتكلفة</th>
                  <th className="py-3.5 px-4 font-bold">تاريخ الطلب</th>
                  <th className="py-3.5 px-4 font-bold">الحالة</th>
                  <th className="py-3.5 px-4 font-bold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gold-800">{b.bookingNumber}</td>
                    <td className="py-3 px-4 font-bold text-obsidian-900">{b.customerName}</td>
                    <td className="py-3 px-4">
                      <div className="text-gray-700 font-mono" dir="ltr">{b.phone}</div>
                      {b.customerLocation && (
                        <div className="text-[11px] text-gray-500 truncate max-w-[150px]">{b.customerLocation}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-800 font-semibold">{b.eventType || 'عام'}</div>
                      <div className="text-[10px] text-gold-700 font-bold">
                        {b.daysCount || 1} {b.daysCount === 1 ? 'يوم' : b.daysCount === 2 ? 'يومان' : 'أيام'}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="truncate text-gray-700 font-medium">
                        {b.items.map((it) => `${it.productName} (×${it.quantity})`).join(', ')}
                      </div>
                      {b.totalEstimatedPrice ? (
                        <div className="text-gold-700 font-bold font-mono text-[11px]">
                          {Number(b.totalEstimatedPrice).toLocaleString('ar-YE')} ر.ي
                        </div>
                      ) : null}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(b.createdAt).toLocaleDateString('ar-YE')}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(b.status)}</td>
                    <td className="py-3 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailBooking(b)}
                          className="px-3 py-1.5 bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>تفاصيل</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  p === page ? 'bg-gold-500 text-obsidian-950 shadow-sm' : 'bg-gray-100 text-obsidian-700 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {detailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-obsidian-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500 text-obsidian-950 flex items-center justify-center font-bold">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">تفاصيل طلب الحجز #{detailBooking.bookingNumber}</h3>
                  <span className="text-xs text-gold-300">
                    تاريخ الطلب: {new Date(detailBooking.createdAt).toLocaleString('ar-YE')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDetailBooking(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Customer Info Card */}
              <div className="bg-cream-50/60 rounded-2xl p-4 border border-gold-200 space-y-3">
                <h4 className="font-bold text-obsidian-900 text-sm">بيانات العميل والموقع</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 block">اسم العميل:</span>
                    <span className="font-bold text-obsidian-900 text-sm">{detailBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">رقم الهاتف:</span>
                    <span className="font-bold text-gold-800 text-sm" dir="ltr">{detailBooking.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">نوع المناسبة:</span>
                    <span className="font-semibold text-obsidian-800">{detailBooking.eventType || 'غير محدد'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">الموقع / العنوان:</span>
                    <span className="font-semibold text-obsidian-800">{detailBooking.customerLocation || 'غير محدد'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">مدة التجهيز / الأيام:</span>
                    <span className="font-bold text-gold-800">
                      {detailBooking.daysCount || 1} {detailBooking.daysCount === 1 ? 'يوم' : detailBooking.daysCount === 2 ? 'يومان' : 'أيام'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">التواريخ المحددة:</span>
                    <span className="font-medium text-obsidian-800">
                      {detailBooking.rentalStartDate ? `${new Date(detailBooking.rentalStartDate).toLocaleDateString('ar-YE')} إلى ${detailBooking.rentalEndDate ? new Date(detailBooking.rentalEndDate).toLocaleDateString('ar-YE') : ''}` : 'حسب الاتفاق'}
                    </span>
                  </div>
                </div>

                {/* Direct Contact Buttons */}
                <div className="pt-3 border-t border-gold-200/60 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/${detailBooking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `السلام عليكم أستاذ ${detailBooking.customerName}، بخصوص طلب حجزكم رقم (${detailBooking.bookingNumber}) لدى إسماعيل للأفراح والمناسبات، نود تأكيد تفاصيل التجهيز معكم.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>محادثة واتساب مع العميل</span>
                  </a>

                  <a
                    href={`tel:${detailBooking.phone}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 rounded-xl font-bold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>اتصال هاتفي</span>
                  </a>
                </div>
              </div>

              {/* Booked Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-obsidian-900 text-sm">الأصناف والتجهيزات المطلوبة</h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                  {detailBooking.items.map((item) => (
                    <div key={item.id} className="p-3.5 bg-white flex justify-between items-center">
                      <div>
                        <p className="font-bold text-obsidian-900 text-sm">{item.productName}</p>
                        {item.daysCount && (
                          <span className="text-[11px] text-gray-500">
                            المدة: {item.daysCount} أيام
                          </span>
                        )}
                        {item.notes && <p className="text-gray-500 text-[11px] mt-0.5">{item.notes}</p>}
                      </div>
                      <div className="text-left space-y-1">
                        <span className="font-bold text-gold-800 bg-gold-50 px-2.5 py-1 rounded-lg border border-gold-200 inline-block">
                          الكمية: {item.quantity}
                        </span>
                        {item.lineTotal ? (
                          <div className="text-xs font-bold text-obsidian-900 font-mono">
                            {Number(item.lineTotal).toLocaleString('ar-YE')} ر.ي
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Estimated Price Card */}
                {detailBooking.totalEstimatedPrice && (
                  <div className="bg-obsidian-900 text-white p-4 rounded-2xl flex justify-between items-center">
                    <span className="font-bold text-sm">إجمالي المبلغ المحسوب للطلب:</span>
                    <span className="text-lg font-black text-gold-400 font-mono">
                      {Number(detailBooking.totalEstimatedPrice).toLocaleString('ar-YE')} ريال يمني
                    </span>
                  </div>
                )}
              </div>

              {/* Customer Notes */}
              {detailBooking.notes && (
                <div className="space-y-1 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-obsidian-900">ملاحظات ومتطلبات العميل:</h4>
                  <p className="text-gray-700 leading-relaxed">{detailBooking.notes}</p>
                </div>
              )}

              {/* Status Change Control */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="font-bold text-obsidian-900 text-sm">تغيير وتحديث حالة الحجز</h4>
                <div className="flex flex-wrap gap-2">
                  {(['NEW', 'CONTACTED', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as BookingStatus[]).map((st) => (
                    <button
                      key={st}
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(detailBooking.id, st)}
                      className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                        detailBooking.status === st
                          ? 'bg-gold-500 text-obsidian-950 shadow-md ring-2 ring-gold-400'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {st === 'NEW' && 'جديد'}
                      {st === 'CONTACTED' && 'تم التواصل'}
                      {st === 'PENDING' && 'قيد المراجعة'}
                      {st === 'CONFIRMED' && 'تأكيد الحجز (Confirmed)'}
                      {st === 'COMPLETED' && 'مكتمل (Completed)'}
                      {st === 'CANCELLED' && 'إلغاء الحجز (Cancelled)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
              <button
                onClick={() => setDetailBooking(null)}
                className="px-5 py-2 bg-obsidian-900 text-white font-bold rounded-xl text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
