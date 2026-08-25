'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MessageCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useBookingCart } from './BookingCartProvider';
import { getFullImageUrl, submitBooking } from '../lib/api';
import { trackEvent } from '../lib/analytics';

interface BookingCartDrawerProps {
  storeWhatsApp?: string;
  storePhone?: string;
}

export default function BookingCartDrawer({
  storeWhatsApp = '777949658',
  storePhone = '777949658',
}: BookingCartDrawerProps) {
  const {
    items,
    customer,
    isDrawerOpen,
    closeDrawer,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    updateCustomerProfile,
    cartCount,
    cartGrandTotal,
  } = useBookingCart();

  const [eventType, setEventType] = useState('زفاف');
  const [generalNotes, setGeneralNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<{ bookingNumber: string } | null>(null);
  const [formError, setFormError] = useState('');

  if (!isDrawerOpen) return null;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (items.length === 0) {
      setFormError('يرجى إضافة صنف واحد على الأقل للحجز');
      return;
    }

    if (!customer.name.trim()) {
      setFormError('يرجى إدخال اسم العميل الكريم');
      return;
    }

    if (!customer.phone.trim() || customer.phone.trim().length < 8) {
      setFormError('يرجى إدخال رقم هاتف / واتساب صالح (8 أرقام على الأقل)');
      return;
    }

    if (!customer.location.trim()) {
      setFormError('يرجى إدخال موقع أو عنوان المناسبة (المحافظة / الحي)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Find overall start and end dates
      const startDates = items.map((i) => i.rentalStartDate).filter(Boolean);
      const endDates = items.map((i) => i.rentalEndDate).filter(Boolean);
      const earliestStart = startDates.length > 0 ? startDates.sort()[0] : undefined;
      const latestEnd = endDates.length > 0 ? endDates.sort().reverse()[0] : undefined;
      const maxDays = Math.max(...items.map((i) => i.daysCount || 1));

      // 1. Submit to Backend Database
      const payload = {
        customerName: customer.name.trim(),
        phone: customer.phone.trim(),
        customerLocation: customer.location.trim(),
        eventType,
        rentalStartDate: earliestStart,
        rentalEndDate: latestEnd,
        daysCount: maxDays,
        totalEstimatedPrice: cartGrandTotal,
        notes: generalNotes.trim() || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          daysCount: item.daysCount,
          lineTotal: item.lineTotal,
          rentalStartDate: item.rentalStartDate,
          rentalEndDate: item.rentalEndDate,
          notes: item.notes,
        })),
      };

      const result = await submitBooking(payload);
      const bookingNumber = result.data?.bookingNumber || `ISM-${Date.now().toString().slice(-4)}`;

      trackEvent('BOOKING_CREATED', undefined, {
        bookingNumber,
        itemsCount: items.length,
        total: cartGrandTotal,
      });

      // 2. Build Formatted WhatsApp Message in Yemeni Dialect/Professional Tone
      let waMessage = `🌟 *طلب حجز وتجهيز جديد من موقع إسماعيل للأفراح*\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `📋 *رقم الحجز:* \`${bookingNumber}\`\n`;
      waMessage += `👤 *اسم العميل:* ${customer.name.trim()}\n`;
      waMessage += `📱 *رقم الجوال:* ${customer.phone.trim()}\n`;
      waMessage += `📍 *الموقع / العنوان:* ${customer.location.trim()}\n`;
      waMessage += `🎉 *نوع المناسبة:* ${eventType}\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `📦 *الأصناف والتجهيزات المطلوبة (${items.length}):*\n\n`;

      items.forEach((item, index) => {
        waMessage += `*${index + 1}. ${item.productName}*\n`;
        waMessage += `   • الكمية: ${item.quantity}\n`;
        waMessage += `   • مدة الحجز: ${item.daysCount} ${item.daysCount === 1 ? 'يوم' : item.daysCount === 2 ? 'يومان' : 'أيام'} (من ${item.rentalStartDate} إلى ${item.rentalEndDate})\n`;
        if (item.unitPrice > 0) {
          waMessage += `   • السعر اليومي: ${item.unitPrice.toLocaleString('ar-YE')} ريال يمني\n`;
          waMessage += `   • الإجمالي: ${item.lineTotal.toLocaleString('ar-YE')} ريال يمني\n`;
        } else {
          waMessage += `   • السعر: استفسار وتفاوض\n`;
        }
        if (item.notes) {
          waMessage += `   • ملاحظة خاصة: ${item.notes}\n`;
        }
        waMessage += `\n`;
      });

      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      if (cartGrandTotal > 0) {
        waMessage += `💰 *إجمالي المبلغ التقديري:* ${cartGrandTotal.toLocaleString('ar-YE')} ريال يمني\n`;
      }
      if (generalNotes.trim()) {
        waMessage += `📝 *ملاحظات عامة:* ${generalNotes.trim()}\n`;
      }
      waMessage += `\nيرجى تأكيد التوفر والحجز والاتفاق على موعد التوصيل والتركيب. شكراً لكم!`;

      // 3. Clear cart and set success state
      clearCart();
      setSuccessBooking({ bookingNumber });

      // 4. Direct redirect to WhatsApp
      const cleanWa = storeWhatsApp.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'حدث خطأ أثناء إرسال طلب الحجز، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-obsidian-950/70 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-5 bg-obsidian-900 text-white flex items-center justify-between border-b border-gold-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gold-500/10 text-gold-400 rounded-2xl border border-gold-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>حافظة طلبات الحجز والتجهيز</span>
                  {cartCount > 0 && (
                    <span className="bg-gold-500 text-obsidian-950 text-xs px-2 py-0.5 rounded-full font-bold">
                      {cartCount} أصناف
                    </span>
                  )}
                </h2>
                <p className="text-xs text-gold-200/80">إسماعيل للأفراح والمناسبات ومستلزمات الأفراح</p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-xl text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {successBooking ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-obsidian-900">تم إرسال طلب الحجز بنجاح!</h3>
                <p className="text-sm text-obsidian-600 max-w-md mx-auto">
                  رقم طلبكم هو <span className="font-bold text-gold-700 font-mono">{successBooking.bookingNumber}</span>. تم فتح تطبيق الواتساب لإرسال تفاصيل التجهيز مباشرة إلى إدارة المحل.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSuccessBooking(null);
                      closeDrawer();
                    }}
                    className="px-6 py-3 bg-obsidian-900 text-gold-300 font-bold rounded-xl text-sm hover:bg-obsidian-800 transition-colors"
                  >
                    العودة لتصفح الكتالوج
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-cream-100 text-gold-600 rounded-3xl flex items-center justify-center mx-auto border border-gold-200">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="text-lg font-bold text-obsidian-900">حافظة الحجز فارغة حالياً</h3>
                <p className="text-xs text-obsidian-600 max-w-sm mx-auto leading-relaxed">
                  تصفح أقسام الخيام والترابيل والفرش ومستلزمات الضيافة وأضف الأصناف المطلوبة مع تحديد عدد الأيام والكمية لحساب التكلفة الإجمالية.
                </p>
                <button
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <span>تصفح كافة الأصناف</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Booked Items List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-cream-200">
                    <span className="text-xs font-bold text-gold-800 tracking-wider">الأصناف المحددة ({items.length})</span>
                    <button
                      onClick={clearCart}
                      className="text-[11px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>تفريغ الحافظة</span>
                    </button>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-cream-50/70 border border-gold-200/80 rounded-2xl p-3.5 space-y-3 hover:border-gold-400 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0 border border-gold-200">
                          {item.imagePath ? (
                            <Image
                              src={getFullImageUrl(item.imagePath)}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-obsidian-400">
                              صورة
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <Link
                              href={`/products/${item.productSlug}`}
                              onClick={closeDrawer}
                              className="text-sm font-bold text-obsidian-900 hover:text-gold-700 transition-colors line-clamp-1"
                            >
                              {item.productName}
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-obsidian-400 hover:text-red-500 transition-colors p-1"
                              title="حذف من الحافظة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-obsidian-600">
                            <span className="bg-gold-100 text-gold-800 px-2 py-0.5 rounded-md font-bold">
                              {item.daysCount} {item.daysCount === 1 ? 'يوم' : item.daysCount === 2 ? 'يومان' : 'أيام'}
                            </span>
                            <span className="text-[10px] text-obsidian-500">
                              ({item.rentalStartDate} إلى {item.rentalEndDate})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Qty row */}
                      <div className="flex justify-between items-center pt-2 border-t border-gold-200/50">
                        {/* Qty Controls */}
                        <div className="flex items-center gap-2 bg-white border border-gold-200 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 text-obsidian-600 hover:text-gold-700 disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-obsidian-900 px-2 font-mono">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-obsidian-600 hover:text-gold-700"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Total in YER */}
                        <div className="text-left">
                          {item.lineTotal > 0 ? (
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-black text-gold-700 font-mono">
                                {item.lineTotal.toLocaleString('ar-YE')}
                              </span>
                              <span className="text-[10px] font-bold text-obsidian-600">ريال يمني</span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-gold-700">تواصل لمعرفة السعر</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Information Form */}
                <form onSubmit={handleSubmitBooking} className="space-y-4 pt-4 border-t border-cream-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-600" />
                    <h3 className="text-xs font-bold text-gold-800 tracking-wider">بيانات العميل وموقع المناسبة</h3>
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                        الاسم الكامل <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-obsidian-400 absolute right-3 top-3" />
                        <input
                          type="text"
                          required
                          value={customer.name}
                          onChange={(e) => updateCustomerProfile({ name: e.target.value })}
                          placeholder="مثال: يحيى إسماعيل الأهدل"
                          className="w-full pr-9 pl-3 py-2 text-xs bg-white border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                          رقم الجوال / الواتساب <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-obsidian-400 absolute right-3 top-3" />
                          <input
                            type="tel"
                            required
                            dir="ltr"
                            value={customer.phone}
                            onChange={(e) => updateCustomerProfile({ phone: e.target.value })}
                            placeholder="777949658"
                            className="w-full pr-9 pl-3 py-2 text-xs bg-white border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500 text-left font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                          نوع المناسبة <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500"
                        >
                          <option value="زفاف">حفل زفاف / عرس</option>
                          <option value="عقد قران">عقد قران / ملكة</option>
                          <option value="عقيقة">عقيقة / تميمة</option>
                          <option value="استقبال وضيافة">استقبال وضيافة خاصة</option>
                          <option value="مخيم عزاء">مخيم عزاء</option>
                          <option value="مؤتمر أو مهرجان">مؤتمر / مهرجان / فعالية</option>
                          <option value="أخرى">مناسبة أخرى</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                        الموقع / المحافظة / الحي للتوصيل والتركيب <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-obsidian-400 absolute right-3 top-3" />
                        <input
                          type="text"
                          required
                          value={customer.location}
                          onChange={(e) => updateCustomerProfile({ location: e.target.value })}
                          placeholder="مثال: صنعاء - حدة - جوار صالة الأندلس"
                          className="w-full pr-9 pl-3 py-2 text-xs bg-white border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-obsidian-700 mb-1">
                        ملاحظات إضافية أو طلبات خاصة (اختياري)
                      </label>
                      <textarea
                        rows={2}
                        value={generalNotes}
                        onChange={(e) => setGeneralNotes(e.target.value)}
                        placeholder="أي تفاصيل ترغب بإخبارنا بها (مثل موعد التركيب المفضل، ألوان الزينة...)"
                        className="w-full px-3 py-2 text-xs bg-white border border-gold-200 rounded-xl focus:outline-none focus:border-gold-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Pricing Breakdown Summary */}
                  <div className="bg-gradient-to-br from-obsidian-900 to-obsidian-950 text-white p-4 rounded-2xl border border-gold-500/30 space-y-2 mt-4">
                    <div className="flex justify-between items-center text-xs text-gold-200">
                      <span>إجمالي عدد الأصناف:</span>
                      <span className="font-bold font-mono">{cartCount} قطعة</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gold-500/20">
                      <span className="text-sm font-bold text-white">المبلغ التقديري الإجمالي:</span>
                      <div className="flex items-baseline gap-1.5 text-gold-400">
                        <span className="text-xl font-black font-mono">
                          {cartGrandTotal > 0 ? cartGrandTotal.toLocaleString('ar-YE') : 'حسب الاتفاق'}
                        </span>
                        {cartGrandTotal > 0 && <span className="text-xs font-bold text-gold-200">ريال يمني</span>}
                      </div>
                    </div>

                    <p className="text-[10px] text-obsidian-300 leading-relaxed pt-1">
                      * الأسعار المحسوبة تشمل مدة الأيام المحددة لكل صنف. يتم تأكيد السعر النهائي مع الخصومات عند التواصل.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <MessageCircle className="w-5 h-5 text-white" />
                    <span>{isSubmitting ? 'جاري إرسال الحجز...' : 'تأكيد وإرسال طلب الحجز عبر WhatsApp'}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
