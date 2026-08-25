'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { useFavorites } from '../../components/FavoritesProvider';
import ProductCard from '../../components/ProductCard';

export default function FavoritesClient({ whatsapp }: { whatsapp: string }) {
  const { favorites, favoritesCount } = useFavorites();

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold border border-gold-300">
          <Heart className="w-3.5 h-3.5 fill-gold-600 text-gold-600" />
          <span>قائمتي الخاصة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-obsidian-900">
          الأصناف المفضلة ({favoritesCount})
        </h1>
        <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed">
          جميع الأصناف التي قمت باختيارها وحفظها أثناء التصفح.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gold-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-100 text-gold-600 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-obsidian-900">قائمة المفضلة فارغة حالياً</h2>
          <p className="text-xs text-obsidian-500 max-w-md mx-auto">
            تصفح الكتالوج واضغط على علامة القلب على أي صنف يعجبك لحفظه والرجوع إليه لاحقاً.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-xs shadow transition-all"
          >
            <span>استعراض الأصناف الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} whatsapp={whatsapp} />
          ))}
        </div>
      )}
    </div>
  );
}
