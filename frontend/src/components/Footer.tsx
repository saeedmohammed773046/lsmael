import React from 'react';
import Link from 'next/link';
import { Sparkles, Phone, MessageCircle, Mail, MapPin, Clock, Heart } from 'lucide-react';
import { SiteSettings } from '../types';

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const storeName = settings?.storeName || 'إسماعيل للأفراح والمناسبات';
  const storeDescription = settings?.storeDescription || 'الوجهة الأولى لتجهيز وتأجير مستلزمات الأفراح والمناسبات الملكية بأعلى معايير الفخامة والتميز.';
  const phone = settings?.phone || '777949658';
  const whatsapp = settings?.whatsapp || '777949658';
  const email = settings?.email || 'info@ismail-events.com';
  const address = settings?.address || 'اليمن - خدمات التوصيل والتجهيز لكافة المحافظات والمناسبات';
  const mapUrl = settings?.googleMapsUrl || 'https://maps.google.com';

  return (
    <footer className="bg-obsidian-900 text-cream-100 pt-16 pb-24 lg:pb-12 border-t-2 border-gold-500/40 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-obsidian-700">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-gold-500 to-gold-300 flex items-center justify-center text-obsidian-900 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white font-sans">
                {storeName}
              </span>
            </div>
            <p className="text-sm text-cream-200/80 leading-relaxed">
              {storeDescription}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-gold-950/80 text-gold-400 border border-gold-800">
                <span className="w-2 h-2 rounded-full bg-gold-400"></span>
                خدمة وضيافة تليق بأفراحكم
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-base font-bold text-gold-400 mb-4 border-r-2 border-gold-400 pr-3">
              روابط سريعة
            </h3>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li>
                <Link href="/" className="hover:text-gold-300 transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-gold-300 transition-colors">الأقسام والتصنيفات</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gold-300 transition-colors">كتالوج الأصناف الكامل</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold-300 transition-colors">معرض التجهيزات والأعمال</Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-gold-300 transition-colors">العروض والباقات الخاصة</Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-gold-300 transition-colors">أصنافي المفضلة</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Business Hours & Support */}
          <div>
            <h3 className="text-base font-bold text-gold-400 mb-4 border-r-2 border-gold-400 pr-3">
              أوقات العمل والتجهيز
            </h3>
            <div className="space-y-3 text-sm text-cream-200/80">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">السبت - الخميس:</p>
                  <p className="text-xs text-cream-200/60">من 08:00 صباحاً حتى 11:30 مساءً</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">الجمعة:</p>
                  <p className="text-xs text-cream-200/60">من 02:00 ظهراً حتى 12:00 منتصف الليل</p>
                </div>
              </div>
              <p className="text-xs text-gold-300/80 pt-1">
                * فرق التركيب والتجهيز الميداني متوفرة على مدار 24 ساعة حسب موعد المناسبة.
              </p>
            </div>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h3 className="text-base font-bold text-gold-400 mb-4 border-r-2 border-gold-400 pr-3">
              بيانات التواصل
            </h3>
            <ul className="space-y-3 text-sm text-cream-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors text-xs leading-relaxed">
                  {address} (عرض على الخريطة)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-gold-300 transition-colors" dir="ltr">
                  +{phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 text-emerald-400 transition-colors font-medium"
                >
                  مراسلة فورية عبر واتساب
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold-300 transition-colors text-xs">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-cream-200/60">
          <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.</p>
          
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gold-400/80 hover:text-gold-300 transition-colors flex items-center gap-1.5 font-bold"
            >
              <span>🔒 دخول لوحة تحكم الإدارة</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
