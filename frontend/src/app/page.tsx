import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowLeft, Layers, Star, Phone, MessageCircle, CheckCircle, Shield, Award, Clock } from 'lucide-react';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { fetchCategories, fetchProducts, fetchGallery, fetchOffers, fetchSettings, getFullImageUrl } from '../lib/api';

export default async function HomePage() {
  const [categories, { products: featuredProducts }, { products: latestProducts }, gallery, offers, settings] =
    await Promise.all([
      fetchCategories(),
      fetchProducts({ featured: true, limit: 6 }),
      fetchProducts({ limit: 8, sort: 'newest' }),
      fetchGallery(),
      fetchOffers(),
      fetchSettings(),
    ]);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <Hero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        whatsapp={settings.whatsapp}
      />

      {/* 2. Dynamic Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-gold-600 font-bold text-xs tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>أقسام المحل وتجهيزاته</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-obsidian-900">
              تصفح الأقسام الرئيسية
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1.5 group"
          >
            <span>عرض كافة الأقسام</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gold-200">
            <p className="text-obsidian-600 text-sm">جاري تحميل الأقسام وتحديث الكتالوج...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {categories.slice(0, 8).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-cream-100 via-white to-cream-100 rounded-3xl p-4 sm:p-10 border border-gold-300 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-gold-700 font-bold text-xs tracking-wider mb-2">
                  <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                  <span>مختارات مميزة</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-obsidian-900">
                  أبرز تجهيزات الأفراح الملكية
                </h2>
              </div>
              <Link
                href="/products?featured=true"
                className="text-xs sm:text-sm font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1.5 group"
              >
                <span>مشاهدة كل المميز</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsapp={settings.whatsapp}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Latest Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-gold-600 font-bold text-xs tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>جديد المستلزمات</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-obsidian-900">
              أحدث الأصناف المضافة للكتالوج
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1.5 group"
          >
            <span>استعراض الكتالوج بالكامل</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {latestProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsapp={settings.whatsapp}
            />
          ))}
        </div>
      </section>

      {/* 5. Special Offers Banner (If active offers exist) */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 text-white rounded-3xl p-8 sm:p-12 border-2 border-gold-500/50 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400 text-gold-300 text-xs font-bold">
                  {offers[0].discountText || 'عرض خاص ومحدود'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {offers[0].title}
                </h3>
                {offers[0].description && (
                  <p className="text-sm text-cream-200/80 leading-relaxed max-w-2xl">
                    {offers[0].description}
                  </p>
                )}
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `السلام عليكم، أرغب في الاستفادة من العرض: ${offers[0].title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
                  >
                    احجز العرض عبر واتساب
                  </a>
                  <Link
                    href="/offers"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-all border border-white/20"
                  >
                    استعراض كافة العروض
                  </Link>
                </div>
              </div>

              {offers[0].imagePath && (
                <div className="lg:col-span-4 relative h-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-gold-500/40">
                  <Image
                    src={getFullImageUrl(offers[0].imagePath)}
                    alt={offers[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 6. Gallery / Works Showcase Preview */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-gold-600 font-bold text-xs tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>معرض الأعمال الحية</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-obsidian-900">
                من تجهيزاتنا السابقة لأرقى المناسبات
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs sm:text-sm font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1.5 group"
            >
              <span>مشاهدة المعرض الكامل</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gallery.slice(0, 3).map((item) => {
              const primaryImg = item.images.find((i) => i.isPrimary) || item.images[0];
              return (
                <div
                  key={item.id}
                  className="group relative h-80 rounded-3xl overflow-hidden shadow-md border border-gold-200"
                >
                  <Image
                    src={getFullImageUrl(primaryImg?.imagePath)}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/30 to-transparent"></div>
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-1.5">
                    {item.categoryTag && (
                      <span className="inline-block text-[11px] font-bold text-gold-400 bg-gold-950/80 px-2.5 py-0.5 rounded-md border border-gold-600/30">
                        {item.categoryTag}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-cream-200/80 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. Why Ismail Store Section */}
      <section className="bg-cream-100 py-16 border-y border-gold-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-gold-700 bg-gold-200/60 px-3.5 py-1 rounded-full border border-gold-300">
              لماذا إسماعيل للأفراح والمناسبات؟
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-obsidian-900">
              خدمات احترافية تضمن تميز مناسبتكم
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed">
              نحرص على أدق التفاصيل لنقدم لكم تجربة استثنائية في تجهيز وتأثيث الأعراس والاحتفالات.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gold-200 shadow-sm space-y-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-obsidian-900">نظافة وخامات فاخرة</h3>
              <p className="text-xs text-obsidian-600 leading-relaxed">
                جميع الخيام والسجاد وأطقم الضيافة يتم غسيلها وتطهيرها وفحصها قبل كل مناسبة لضمان أبهى مظهر.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gold-200 shadow-sm space-y-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold shadow-inner">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-obsidian-900">انضباط في المواعيد</h3>
              <p className="text-xs text-obsidian-600 leading-relaxed">
                التزام كامل بساعات التسليم والتركيب قبل بدء المناسبة بوقت كافٍ لراحة واطمئنان العميل.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gold-200 shadow-sm space-y-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-obsidian-900">تجهيز متكامل شامل</h3>
              <p className="text-xs text-obsidian-600 leading-relaxed">
                من الخيمة والطرابيل حتى أدق فناجين القهوة والإنارة الترحيبية؛ نوفر كل ما يلزم تحت سقف واحد.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gold-200 shadow-sm space-y-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold shadow-inner">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-obsidian-900">فريق ميداني محترف</h3>
              <p className="text-xs text-obsidian-600 leading-relaxed">
                فنيون متخصصون في نصب الخيام وتمديد الإضاءات وفرش السجاد بسرعة ودقة عالية في مختلف المواقع.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call To Action Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 rounded-3xl p-8 sm:p-12 shadow-xl text-obsidian-950 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-2xl sm:text-3xl font-black">
              هل تخطط لمناسبة أو عرس قريباً؟
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-obsidian-900/80 max-w-xl">
              تواصل معنا مباشرة عبر الهاتف أو واتساب وسنقوم بمساعدتك في اختيار أنسب التجهيزات وبأفضل الأسعار.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="px-6 py-3.5 bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 font-bold rounded-2xl text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>اتصل بنا الآن</span>
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن باقات تجهيز المناسبات لديكم')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white hover:bg-cream-50 text-emerald-800 font-bold rounded-2xl text-sm shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>محادثة واتساب</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
