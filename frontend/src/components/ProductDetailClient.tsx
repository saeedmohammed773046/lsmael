'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Share2,
  MessageCircle,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  Copy,
  Check,
  Maximize2,
} from 'lucide-react';
import { Product, SiteSettings } from '../types';
import { getFullImageUrl } from '../lib/api';
import { useFavorites } from './FavoritesProvider';
import { trackEvent } from '../lib/analytics';
import BookingModal from './BookingModal';
import ImageLightbox from './ImageLightbox';
import ProductCard from './ProductCard';

interface ProductDetailClientProps {
  product: Product;
  settings: SiteSettings;
  initialOpenBooking?: boolean;
}

export default function ProductDetailClient({
  product,
  settings,
  initialOpenBooking = false,
}: ProductDetailClientProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(initialOpenBooking);
  const [copied, setCopied] = useState(false);

  const images = product.images.length > 0
    ? product.images
    : [{ id: '1', productId: product.id, imagePath: '', altText: product.name, sortOrder: 0, isPrimary: true }];

  const activeImage = images[activeImageIndex] || images[0];

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || product.name,
          url,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {}
    }
  };

  const whatsappMessage = `السلام عليكم، أرغب في الاستفسار عن صنف:\n*${product.name}*\n\nرابط الصنف:\n${typeof window !== 'undefined' ? window.location.href : ''}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-obsidian-500">
        <Link href="/" className="hover:text-gold-600 transition-colors">الرئيسية</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-gold-600 transition-colors">الأصناف</Link>
        {product.category && (
          <>
            <ChevronLeft className="w-3.5 h-3.5" />
            <Link href={`/categories/${product.category.slug}`} className="hover:text-gold-600 transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="text-gold-700 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Images Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative w-full h-80 sm:h-[450px] bg-cream-100 rounded-3xl overflow-hidden border border-gold-300 shadow-md group">
            <Image
              src={getFullImageUrl(activeImage.imagePath)}
              alt={activeImage.altText || product.name}
              fill
              className="object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
              onClick={() => setLightboxOpen(true)}
              priority
            />

            {/* Floating Enlarge Icon */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-obsidian-900/80 backdrop-blur-md text-gold-300 hover:text-white transition-all shadow-md"
              title="تكبير الصورة"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Service Type Tag */}
            <div className="absolute top-4 right-4">
              <span className="bg-gold-500 text-obsidian-950 font-bold px-3 py-1 rounded-xl text-xs shadow-md">
                {product.serviceType === 'RENTAL' && 'للإيجار'}
                {product.serviceType === 'SALE' && 'للبيع'}
                {product.serviceType === 'RENTAL_AND_SALE' && 'إيجار وبيـع'}
                {product.serviceType === 'INQUIRY' && 'للاستفسار'}
              </span>
            </div>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    idx === activeImageIndex
                      ? 'border-gold-500 ring-2 ring-gold-400 scale-95 shadow-md'
                      : 'border-cream-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={getFullImageUrl(img.imagePath)}
                    alt={img.altText || product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Status */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {product.category && (
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="text-xs font-bold text-gold-700 bg-gold-50 hover:bg-gold-100 px-3 py-1 rounded-lg transition-colors"
                >
                  {product.category.name}
                </Link>
              )}

              {/* Status Badge */}
              <div>
                {product.availabilityStatus === 'AVAILABLE' ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    جاهز للحجز والتجهيز
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    محجوز حالياً (تواصل للاستفسار)
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-obsidian-900 leading-tight">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="bg-cream-50 p-4 rounded-2xl border border-gold-200 inline-block">
              <span className="text-xs text-obsidian-600 block mb-1">السعر التقديري:</span>
              {product.priceType === 'FIXED' && product.price ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-gold-700 font-mono">
                    {Number(product.price).toLocaleString('ar-YE')}
                  </span>
                  <span className="text-xs font-bold text-obsidian-700">ريال يمني</span>
                </div>
              ) : product.priceType === 'STARTING_FROM' && product.price ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-obsidian-600">يبدأ من</span>
                  <span className="text-2xl font-black text-gold-700 font-mono">
                    {Number(product.price).toLocaleString('ar-YE')}
                  </span>
                  <span className="text-xs font-bold text-obsidian-700">ريال يمني</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-gold-800">
                  تواصل معنا لمعرفة السعر والتفاصيل حسب مدة المناسبة
                </span>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4 pt-4 border-t border-cream-200">
            {product.shortDescription && (
              <p className="text-sm sm:text-base font-semibold text-obsidian-800 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {product.description && (
              <div className="bg-white p-5 rounded-2xl border border-gold-200 shadow-sm space-y-2">
                <h3 className="text-xs font-bold text-gold-700 tracking-wider">تفاصيل ومواصفات الصنف:</h3>
                <p className="text-xs sm:text-sm text-obsidian-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-cream-200">
            {/* Direct Booking CTA */}
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:to-gold-600 text-obsidian-950 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] text-base flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>طلب حجز وتجهيز هذا الصنف</span>
            </button>

            {/* Contact Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `السلام عليكم، أرغب في الاستفسار عن صنف:\n*${product.name}*`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent('WHATSAPP_CLICK', product.id, { productName: product.name });
                  const currentUrl = window.location.href;
                  const text = `السلام عليكم، أرغب في الاستفسار عن صنف:\n*${product.name}*\n\nرابط الصنف:\n${currentUrl}`;
                  window.open(
                    `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
                className="flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>استفسر عبر WhatsApp</span>
              </a>

              {/* Direct Call Button */}
              <a
                href={`tel:${settings.phone}`}
                onClick={() => trackEvent('PHONE_CLICK', product.id)}
                className="flex items-center justify-center gap-2 py-3.5 px-4 bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 border border-gold-500/30"
              >
                <Phone className="w-5 h-5" />
                <span>اتصال مباشر بالمحل</span>
              </a>
            </div>

            {/* Utility Actions (Favorite & Share) */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => toggleFavorite(product)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  favorite
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-white text-obsidian-700 hover:bg-cream-50 border-gold-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-red-600' : ''}`} />
                <span>{favorite ? 'محفوظ في المفضلة' : 'إضافة للمفضلة'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-cream-50 text-obsidian-700 border border-gold-200 rounded-xl text-xs font-bold transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-gold-600" />}
                <span>{copied ? 'تم نسخ الرابط' : 'مشاركة الصنف'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Showcase */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-gold-200 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-gold-700 tracking-wider">تشكيلات مقترحة</span>
              <h2 className="text-xl sm:text-2xl font-black text-obsidian-900">
                أصناف مشابهة من نفس القسم
              </h2>
            </div>
            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-xs font-bold text-gold-600 hover:text-gold-700"
              >
                عرض المزيد
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} whatsapp={settings.whatsapp} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        currentIndex={activeImageIndex}
        onNavigate={setActiveImageIndex}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          imagePath: activeImage?.imagePath,
        }}
        whatsapp={settings.whatsapp}
      />
    </div>
  );
}
