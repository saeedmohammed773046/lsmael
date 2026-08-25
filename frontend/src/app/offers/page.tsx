import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Tag, Sparkles, MessageCircle } from 'lucide-react';
import { fetchOffers, fetchSettings, getFullImageUrl } from '../../lib/api';

export const metadata: Metadata = {
  title: 'العروض والباقات الخاصة',
  description: 'اكتشف أقوى عروض وباقات تأجير مستلزمات الأفراح والخيام الملكية من محل إسماعيل.',
};

export default async function OffersPage() {
  const [offers, settings] = await Promise.all([
    fetchOffers(),
    fetchSettings(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold border border-gold-300">
          <Tag className="w-3.5 h-3.5 text-gold-600" />
          <span>توفير وجودة عالية</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-obsidian-900">
          العروض والباقات الموسمية
        </h1>
        <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed">
          باقات متكاملة لتجهيز الأفراح والمخيمات ومناسبات الضيافة بأسعار مخفضة وخدمات تركيب مجانية.
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gold-200 space-y-3">
          <Sparkles className="w-8 h-8 text-gold-500 mx-auto" />
          <p className="text-base font-bold text-obsidian-800">لا توجد عروض موسمية نشطة حالياً</p>
          <p className="text-xs text-obsidian-500">تابعونا باستمرار للاطلاع على أحدث الباقات والخصومات</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl overflow-hidden border border-gold-300 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {offer.imagePath && (
                <div className="relative w-full h-64 overflow-hidden bg-cream-100">
                  <Image
                    src={getFullImageUrl(offer.imagePath)}
                    alt={offer.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {offer.discountText && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md">
                      {offer.discountText}
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-bold text-obsidian-900 leading-snug">
                  {offer.title}
                </h3>
                {offer.description && (
                  <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed">
                    {offer.description}
                  </p>
                )}

                <div className="pt-4 border-t border-cream-200 flex flex-wrap justify-between items-center gap-3">
                  <span className="text-xs font-bold text-gold-700">عرض متاح لفترة محدودة</span>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `السلام عليكم، أرغب في حجز والاستفسار عن العرض: ${offer.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>حجز العرض واتساب</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
