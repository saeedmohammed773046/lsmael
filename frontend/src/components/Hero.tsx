'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, MessageCircle, ArrowLeft, ShieldCheck, Award, Clock } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface HeroProps {
  title?: string;
  subtitle?: string;
  whatsapp?: string;
  onOpenBooking?: () => void;
}

export default function Hero({
  title = 'أفراحكم تكتمل بأرقى التجهيزات والخيام الملكية',
  subtitle = 'نوفر أحدث الخيام، الطرابيل، السجاد، مستلزمات الضيافة العربية، والجلسات لجميع المناسبات بأفضل الأسعار وأعلى جودة.',
  whatsapp = '777949658',
  onOpenBooking,
}: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-white to-cream-50 pt-12 pb-20 border-b border-gold-200">
      {/* Background Graphic Accents */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Content Column */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gold-100 border border-gold-300 text-gold-950 text-[11px] sm:text-sm font-black shadow-xs max-w-full">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-600 shrink-0" />
              <span className="truncate sm:whitespace-normal">إسماعيل للأفراح والمناسبات ومستلزماتها</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-obsidian-900 leading-snug sm:leading-tight tracking-tight">
              {title}
            </h1>

            <p className="text-sm sm:text-lg text-obsidian-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {subtitle}
            </p>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/products"
                className="w-full sm:w-auto justify-center px-6 py-3.5 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:to-gold-600 text-obsidian-950 font-black rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 text-sm sm:text-base"
              >
                <span>تصفح كتالوج الأصناف</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              {onOpenBooking ? (
                <button
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto justify-center px-6 py-3.5 bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 font-bold rounded-xl sm:rounded-2xl shadow-md transition-all active:scale-95 text-sm sm:text-base border border-gold-500/30"
                >
                  طلب حجز وتجهيز
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="w-full sm:w-auto justify-center px-6 py-3.5 bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 font-bold rounded-xl sm:rounded-2xl shadow-md transition-all active:scale-95 text-sm sm:text-base border border-gold-500/30 flex items-center"
                >
                  طلب حجز وتجهيز
                </Link>
              )}

              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، أرغب في الاستفسار عن باقات تجهيز المناسبات لديكم')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('WHATSAPP_CLICK')}
                className="w-full sm:w-auto justify-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl sm:rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4" />
                <span>استفسار واتساب</span>
              </a>
            </div>

            {/* Highlights Pillars */}
            <div className="pt-6 border-t border-gold-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-right">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gold-700 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>تجهيز فاخر</span>
                </div>
                <p className="text-[11px] text-obsidian-500">نظافة وخامات عالية</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gold-700 font-bold text-xs sm:text-sm">
                  <Clock className="w-4 h-4" />
                  <span>دقة المواعيد</span>
                </div>
                <p className="text-[11px] text-obsidian-500">توصيل وتركيب فوري</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gold-700 font-bold text-xs sm:text-sm">
                  <Award className="w-4 h-4" />
                  <span>أسعار منافسة</span>
                </div>
                <p className="text-[11px] text-obsidian-500">باقات مناسبة للجميع</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase Gallery Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Featured Image Card */}
              <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80"
                  alt="تجهيز خيام وأفراح ملكية"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 right-4 left-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-gold-200 shadow-lg">
                  <p className="text-xs font-bold text-obsidian-900">تجهيز خيام ملكية VIP وضيافة متكاملة</p>
                  <p className="text-[11px] text-gold-700 font-semibold">جاهزون لكافة الحفلات والأعراس والمناسبات</p>
                </div>
              </div>

              {/* Floating Small Accent Image */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 w-44 h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20">
                <Image
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
                  alt="دلال وضيافة عربية"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
