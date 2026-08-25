import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Sparkles, Calendar, Tag } from 'lucide-react';
import { fetchGallery, fetchSettings, getFullImageUrl } from '../../lib/api';

export const metadata: Metadata = {
  title: 'معرض الأعمال والتجهيزات السابقة',
  description: 'شاهد بالصور الحقيقية تجهيزات محل إسماعيل للأفراح: خيام ملكية، مجالس ضيافة، ساحات احتفالات، وممرات استقبال.',
};

export default async function GalleryPage() {
  const [gallery, settings] = await Promise.all([
    fetchGallery(),
    fetchSettings(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold border border-gold-300">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>توثيق حقيقي للتجهيزات</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-obsidian-900">
          معرض أعمال وتجهيزات المحل
        </h1>
        <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed">
          نفخر بتقديم نماذج حية من تجهيزاتنا لأرقى حفلات الزفاف، مجالس الضيافة والمخيمات الرسمية.
        </p>
      </div>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gold-200">
          <p className="text-obsidian-600 text-sm">جاري تحديث معرض الأعمال وإضافة التجهيزات الجديدة...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery.map((item) => {
            const primaryImg = item.images.find((i) => i.isPrimary) || item.images[0];
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-gold-200 shadow-sm hover:shadow-xl hover:border-gold-400 transition-all duration-300 flex flex-col group"
              >
                <div className="relative w-full h-64 overflow-hidden bg-cream-100">
                  <Image
                    src={getFullImageUrl(primaryImg?.imagePath)}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.categoryTag && (
                    <div className="absolute top-3.5 right-3.5 bg-obsidian-900/85 backdrop-blur-md text-gold-300 text-xs font-bold px-3 py-1 rounded-full border border-gold-500/30 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{item.categoryTag}</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-obsidian-900 leading-snug">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-obsidian-600 line-clamp-3 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-cream-200 flex justify-between items-center text-xs">
                    {item.eventDate ? (
                      <div className="flex items-center gap-1 text-obsidian-500">
                        <Calendar className="w-3.5 h-3.5 text-gold-600" />
                        <span>{new Date(item.eventDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                    ) : (
                      <span className="text-gold-700 font-semibold">تجهيز احترافي معتمد</span>
                    )}

                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `السلام عليكم، شاهدت تجهيز "${item.title}" في معرض الأعمال وأود الاستفسار عن باقة مشابهة`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      طلب تجهيز مماثل
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
