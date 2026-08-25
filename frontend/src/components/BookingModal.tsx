'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Sparkles, 
  MessageCircle,
  Plus,
  Minus,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { useBookingCart, calculateDaysDifference } from './BookingCartProvider';
import { trackEvent } from '../lib/analytics';
import { submitBooking } from '../lib/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    id: string;
    name: string;
    slug?: string;
    price?: number | null;
    imagePath?: string;
  } | null;
  whatsapp?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  product,
  whatsapp = '777949658',
}: BookingModalProps) {
  const { customer, updateCustomerProfile, addToCart } = useBookingCart();

  // Today's date and default 3-day window
  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [location, setLocation] = useState(customer.location || '');
  const [eventType, setEventType] = useState('حفل زفاف');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(nextWeek);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<{ bookingNumber: string } | null>(null);

  useEffect(() => {
    if (customer.name) setCustomerName(customer.name);
    if (customer.phone) setPhone(customer.phone);
    if (customer.location) setLocation(customer.location);
  }, [customer]);

  if (!isOpen || !product) return null;

  const unitPrice = product.price ? Number(product.price) : 0;
  const daysCount = calculateDaysDifference(startDate, endDate);
  const totalCalculated = unitPrice * quantity * daysCount;

  const handleAddToCartAndClose = () => {
    if (!customerName.trim() || !phone.trim() || !location.trim()) {
      setError('يرجى تعبئة الاسم ورقم الجوال والموقع لحفظ بياناتك في الحافظة');
      return;
    }

    updateCustomerProfile({
      name: customerName.trim(),
      phone: phone.trim(),
      location: location.trim(),
    });

    addToCart({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug || product.id,
      imagePath: product.imagePath,
      unitPrice,
      quantity,
      rentalStartDate: startDate,
      rentalEndDate: endDate,
      eventType,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('يرجى إدخال اسم العميل');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('يرجى إدخال رقم هاتف صالح (8 أرقام على الأقل)');
      return;
    }
    if (!location.trim()) {
      setError('يرجى إدخال الموقع أو عنوان المناسبة');
      return;
    }

    setLoading(true);

    try {
      updateCustomerProfile({
        name: customerName.trim(),
        phone: phone.trim(),
        location: location.trim(),
      });

      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        customerLocation: location.trim(),
        eventType,
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        daysCount,
        totalEstimatedPrice: totalCalculated > 0 ? totalCalculated : undefined,
        notes: notes.trim() || undefined,
        items: [
          {
            productId: product.id,
            productName: product.name,
            quantity,
            unitPrice: unitPrice > 0 ? unitPrice : undefined,
            daysCount,
            lineTotal: totalCalculated > 0 ? totalCalculated : undefined,
            rentalStartDate: startDate,
            rentalEndDate: endDate,
            notes: notes.trim() || undefined,
          },
        ],
      };

      const result = await submitBooking(payload);

      if (result.success) {
        const bookingNumber = result.data.bookingNumber;
        setBookingSuccess({ bookingNumber });
        trackEvent('BOOKING_CREATED', bookingNumber);

        // Build WhatsApp message
        let waText = `🌟 *طلب حجز وتجهيز صنف من موقع إسماعيل للأفراح*\n`;
        waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
        waText += `📋 *رقم الحجز:* \`${bookingNumber}\`\n`;
        waText += `👤 *العميل:* ${customerName.trim()}\n`;
        waText += `📱 *الجوال:* ${phone.trim()}\n`;
        waText += `📍 *الموقع:* ${location.trim()}\n`;
        waText += `🎉 *المناسبة:* ${eventType}\n`;
        waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
        waText += `📦 *الصنف:* ${product.name}\n`;
        waText += `• الكمية: ${quantity}\n`;
        waText += `• مدة الحجز: ${daysCount} ${daysCount === 1 ? 'يوم' : daysCount === 2 ? 'يومان' : 'أيام'} (من ${startDate} إلى ${endDate})\n`;
        if (unitPrice > 0) {
          waText += `• السعر اليومي: ${unitPrice.toLocaleString('ar-YE')} ريال يمني\n`;
          waText += `• الإجمالي التقديري: ${totalCalculated.toLocaleString('ar-YE')} ريال يمني\n`;
        }
        if (notes.trim()) {
          waText += `📝 *ملاحظات:* ${notes.trim()}\n`;
        }
        waText += `━━━━━━━━━━━━━━━━━━━━━\n`;
        waText += `يرجى تأكيد الحجز وموعد التوصيل. شكراً لكم!`;

        const cleanWa = whatsapp.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(waText)}`, '_blank');
      } else {
        setError(result.message || 'حدث خطأ أثناء إرسال طلب الحجز');
      }
    } catch (err: any) {
      setError(err.message || 'تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gold-200 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 text-white p-5 border-b border-gold-500/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500 text-obsidian-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white line-clamp-1">
                حجز وتجهيز: {product.name}
              </h3>
              <p className="text-xs text-gold-300">
                حدد مدة الحجز والكمية لحساب التكلفة التلقائية بالريال اليمني
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-cream-200/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {bookingSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-obsidian-900">
                تم إرسال طلب الحجز بنجاح!
              </h4>
              <div className="bg-gold-50 border border-gold-300 rounded-2xl p-4 inline-block max-w-xs">
                <p className="text-xs text-obsidian-600 mb-1">رقم طلب الحجز:</p>
                <p className="text-xl font-mono font-bold text-gold-800 tracking-wider">
                  {bookingSuccess.bookingNumber}
                </p>
              </div>
              <p className="text-xs text-obsidian-600 leading-relaxed max-w-sm mx-auto">
                شكراً لكم! تم فتح تطبيق الواتساب لإرسال تفاصيل التجهيز مباشرة للمحل لمتابعة التأكيد وموقع التركيب.
              </p>

              <div className="pt-3 flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-obsidian-900 text-gold-300 font-bold rounded-xl text-xs hover:bg-obsidian-800 transition-colors"
                >
                  إغلاق ومتابعة التصفح
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDirectSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Customer Identification */}
              <div className="bg-cream-50/70 p-4 rounded-2xl border border-gold-200/80 space-y-3">
                <div className="flex items-center gap-2 text-gold-800 text-xs font-bold">
                  <User className="w-4 h-4" />
                  <span>بيانات العميل وموقع المناسبة</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                      الاسم الكريم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="اسم العميل"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gold-200 rounded-xl text-xs focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                      رقم الجوال / الواتساب <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="777949658"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gold-200 rounded-xl text-xs focus:ring-2 focus:ring-gold-500 outline-none text-left font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                    الموقع أو العنوان (المحافظة / الحي) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-obsidian-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="مثال: صنعاء - الأصبحي - جوار حديقة السبعين"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 bg-white border border-gold-200 rounded-xl text-xs focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Event Type & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                    نوع المناسبة
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gold-200 rounded-xl text-xs focus:ring-2 focus:ring-gold-500 outline-none"
                  >
                    <option value="حفل زفاف">حفل زفاف / عرس</option>
                    <option value="عقد قران">عقد قران / ملكة</option>
                    <option value="عقيقة">عقيقة / تميمة</option>
                    <option value="استقبال وضيافة">استقبال وضيافة</option>
                    <option value="مخيم عزاء">مخيم عزاء</option>
                    <option value="فعالية أو معرض">فعالية أو معرض</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                    العدد / الكمية
                  </label>
                  <div className="flex items-center gap-2 bg-white border border-gold-200 rounded-xl px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 text-obsidian-600 hover:text-gold-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full text-center text-xs font-bold font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1 text-obsidian-600 hover:text-gold-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Start & End Dates with Days Calculator */}
              <div className="bg-gold-50/50 p-3.5 rounded-2xl border border-gold-200 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-gold-800 text-xs font-bold">
                    <Calendar className="w-4 h-4" />
                    <span>تحديد مدة التأجير والتجهيز</span>
                  </div>
                  <span className="bg-gold-500 text-obsidian-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                    {daysCount} {daysCount === 1 ? 'يوم' : daysCount === 2 ? 'يومان' : 'أيام'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-obsidian-600 mb-1">
                      تاريخ بدء المناسبة / التركيب
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gold-200 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-obsidian-600 mb-1">
                      تاريخ انتهاء المناسبة / الاسترجاع
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gold-200 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Automatic Cost Calculator */}
              <div className="bg-obsidian-900 text-white p-4 rounded-2xl border border-gold-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs text-gold-200">
                  <span>سعر الصنف اليومي:</span>
                  <span className="font-bold font-mono">
                    {unitPrice > 0 ? `${unitPrice.toLocaleString('ar-YE')} ريال يمني` : 'حسب الاتفاق'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gold-200">
                  <span>حساب المدة والكمية:</span>
                  <span className="font-mono text-gold-300">
                    {quantity} صنف × {daysCount} أيام
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gold-500/20">
                  <span className="text-sm font-bold text-white">إجمالي المبلغ المحسوب:</span>
                  <div className="flex items-baseline gap-1.5 text-gold-400">
                    <span className="text-xl font-black font-mono">
                      {totalCalculated > 0 ? totalCalculated.toLocaleString('ar-YE') : 'استفسار'}
                    </span>
                    {totalCalculated > 0 && <span className="text-xs font-bold text-gold-200">ريال يمني</span>}
                  </div>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                  ملاحظات أو طلبات خاصة (اختياري)
                </label>
                <textarea
                  rows={2}
                  placeholder="أي تفاصيل ترغب بإخبارنا بها..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-cream-50/50 border border-gold-200 rounded-xl text-xs outline-none resize-none"
                />
              </div>

              {/* Dual Action Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCartAndClose}
                  className="w-full py-3.5 bg-gold-100 hover:bg-gold-200 text-gold-900 border border-gold-400 font-bold rounded-2xl transition-all text-xs flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-gold-700" />
                  <span>إضافة للحافظة ومتابعة التصفح</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>{loading ? 'جاري الإرسال...' : 'تأكيد وحجز الآن عبر WhatsApp'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
