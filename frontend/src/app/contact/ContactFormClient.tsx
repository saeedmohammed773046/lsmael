'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle, MessageCircle } from 'lucide-react';
import { submitBooking } from '../../lib/api';
import { trackEvent } from '../../lib/analytics';

export default function ContactFormClient({ whatsapp }: { whatsapp: string }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('حفل زفاف');
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        eventType,
        eventDate: eventDate || undefined,
        notes: notes.trim() || undefined,
        items: [
          {
            productName: productName.trim() || 'طلب تجهيز مناسبة متكامل',
            quantity: 1,
            notes: notes.trim() || undefined,
          },
        ],
      };

      const result = await submitBooking(payload);
      if (result.success) {
        setBookingSuccess(result.data.bookingNumber);
        trackEvent('BOOKING_CREATED', result.data.bookingNumber);
      } else {
        setError(result.message || 'حدث خطأ أثناء إرسال الطلب');
      }
    } catch (err: any) {
      setError(err.message || 'تعذر إرسال الطلب، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="text-center py-10 space-y-4 bg-cream-50 rounded-2xl p-6 border border-gold-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-obsidian-900">تم إرسال طلب الحجز بنجاح!</h3>
        <p className="text-sm text-obsidian-600">
          رقم طلبكم للمتابعة: <strong className="text-gold-700">{bookingSuccess}</strong>
        </p>
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>شكراً لتواصلكم مع إسماعيل للأفراح والمناسبات. سيقوم فريقنا بالتواصل معكم في أقرب وقت.</span>
        </div>
        <div className="pt-2">
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `السلام عليكم، قمت بإرسال طلب حجز برقم: ${bookingSuccess}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>متابعة فورية عبر واتساب</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
            الاسم الكريم <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="اسم العميل"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-3 bg-cream-50/50 border border-gold-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
            رقم الجوال <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="05XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 bg-cream-50/50 border border-gold-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none text-right"
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
            نوع المناسبة
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full p-3 bg-cream-50/50 border border-gold-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
          >
            <option value="حفل زفاف">حفل زفاف</option>
            <option value="عقد قران / ملكة">عقد قران / ملكة</option>
            <option value="عزيمة / وليمة">عزيمة / وليمة</option>
            <option value="تجهيز مخيم بري">تجهيز مخيم بري</option>
            <option value="حفل تخرج">حفل تخرج</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
            تاريخ المناسبة
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full p-3 bg-cream-50/50 border border-gold-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
          الأصناف أو التجهيزات المطلوبة
        </label>
        <input
          type="text"
          placeholder="مثال: خيمة ملكية 12×6 مع 50 كرسي وسجاد أحمر"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-3 bg-cream-50/50 border border-gold-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
          ملاحظات وتفاصيل إضافية (موقع المناسبة وساعات التجهيز)
        </label>
        <textarea
          rows={3}
          placeholder="اكتب هنا أي متطلبات خاصة..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 bg-cream-50/50 border border-gold-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:to-gold-600 text-obsidian-950 font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin"></span>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>إرسال طلب الحجز الآن</span>
          </>
        )}
      </button>
    </form>
  );
}
