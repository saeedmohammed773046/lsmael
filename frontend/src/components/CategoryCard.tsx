import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Layers } from 'lucide-react';
import { Category } from '../types';
import { getFullImageUrl } from '../lib/api';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gold-200/80 shadow-sm hover:shadow-xl hover:border-gold-400 transition-all duration-300 flex flex-col transform hover:-translate-y-1.5"
    >
      {/* Category Image */}
      <div className="relative w-full h-36 sm:h-56 overflow-hidden bg-cream-100">
        <Image
          src={getFullImageUrl(category.imagePath)}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/80 via-obsidian-900/20 to-transparent"></div>

        {/* Product count badge */}
        {category.productsCount !== undefined && (
          <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 bg-obsidian-900/85 backdrop-blur-md text-gold-300 text-[10px] sm:text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1 sm:gap-1.5 shadow-sm">
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{category.productsCount} صنف</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          <h3 className="text-sm sm:text-lg font-bold text-obsidian-900 group-hover:text-gold-600 transition-colors line-clamp-1">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-[11px] sm:text-xs text-obsidian-600 line-clamp-2 mt-1 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-cream-200 flex justify-between items-center text-[11px] sm:text-xs font-bold text-gold-600 group-hover:text-gold-700">
          <span>استعراض الأصناف</span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-cream-100 group-hover:bg-gold-500 group-hover:text-obsidian-900 flex items-center justify-center transition-all shrink-0">
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
