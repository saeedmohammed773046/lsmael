'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { getFullImageUrl } from '../lib/api';
import { useFavorites } from './FavoritesProvider';
import { trackEvent } from '../lib/analytics';

interface ProductCardProps {
  product: Product;
  whatsapp?: string;
  onOpenBooking?: (product: Product) => void;
}

export default function ProductCard({ product, whatsapp = '966500000000', onOpenBooking }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const imageSrc = getFullImageUrl(primaryImage?.imagePath);

  // Service Type Label
  const getServiceTypeBadge = () => {
    switch (product.serviceType) {
      case 'RENTAL':
        return <span className="bg-gold-500 text-obsidian-950 font-bold px-2.5 py-1 rounded-lg text-[11px] shadow-sm">للإيجار</span>;
      case 'SALE':
        return <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] shadow-sm">للبيع</span>;
      case 'RENTAL_AND_SALE':
        return <span className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] shadow-sm">إيجار وبيـع</span>;
      default:
        return <span className="bg-purple-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] shadow-sm">للاستفسار</span>;
    }
  };

  // Price Display Helper
  const renderPrice = () => {
    if (product.priceType === 'HIDDEN' || !product.price) {
      return <span className="text-xs font-semibold text-gold-700">تواصل لمعرفة السعر</span>;
    }
    if (product.priceType === 'STARTING_FROM') {
      return (
        <div className="flex items-baseline gap-1 text-obsidian-900">
          <span className="text-[10px] text-obsidian-500">يبدأ من</span>
          <span className="text-base font-bold text-gold-700 font-mono">{Number(product.price).toLocaleString('ar-YE')}</span>
          <span className="text-[10px] text-obsidian-600 font-semibold">ريال يمني</span>
        </div>
      );
    }
    if (product.priceType === 'FIXED') {
      return (
        <div className="flex items-baseline gap-1 text-obsidian-900">
          <span className="text-base font-bold text-gold-700 font-mono">{Number(product.price).toLocaleString('ar-YE')}</span>
          <span className="text-[10px] text-obsidian-600 font-semibold">ريال يمني</span>
        </div>
      );
    }
    return <span className="text-xs font-semibold text-gold-700">حسب مدة وتفاصيل التجهيز</span>;
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gold-200/80 shadow-sm hover:shadow-xl hover:border-gold-400 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Section */}
      <div className="relative w-full h-60 bg-cream-100 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={imageSrc}
            alt={primaryImage?.altText || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Floating Top Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {getServiceTypeBadge()}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product);
          }}
          className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md shadow-sm transition-all z-10 ${
            favorite
              ? 'bg-red-50 text-red-500 border border-red-200'
              : 'bg-white/80 text-obsidian-700 hover:text-red-500 hover:bg-white'
          }`}
          aria-label="حفظ في المفضلة"
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-red-500' : ''}`} />
        </button>

        {/* Availability tag */}
        <div className="absolute bottom-2.5 right-2.5">
          {product.availabilityStatus === 'AVAILABLE' ? (
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              جاهز للتجهيز
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              محجوز حالياً
            </span>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {product.category && (
            <span className="text-[11px] font-semibold text-gold-700 bg-gold-50 px-2.5 py-0.5 rounded-md inline-block mb-1.5">
              {product.category.name}
            </span>
          )}

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-base font-bold text-obsidian-900 group-hover:text-gold-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-xs text-obsidian-600 line-clamp-2 mt-1.5 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-cream-200 space-y-3">
          <div className="flex justify-between items-center">
            {renderPrice()}
            <Link
              href={`/products/${product.slug}`}
              className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1 group/link"
            >
              <span>التفاصيل</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover/link:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `السلام عليكم، أرغب في الاستفسار عن صنف: ${product.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                trackEvent('WHATSAPP_CLICK', product.id, { productName: product.name });
                const currentOrigin = window.location.origin;
                const fullUrl = `${currentOrigin}/products/${product.slug}`;
                const text = `السلام عليكم، أرغب في الاستفسار عن صنف: ${product.name}\nرابط الصنف: ${fullUrl}`;
                window.open(
                  `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`,
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>استفسر واتساب</span>
            </a>

            {onOpenBooking ? (
              <button
                onClick={() => onOpenBooking(product)}
                className="flex items-center justify-center py-2.5 px-3 bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                طلب حجز
              </button>
            ) : (
              <Link
                href={`/products/${product.slug}?booking=true`}
                className="flex items-center justify-center py-2.5 px-3 bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                طلب حجز
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
