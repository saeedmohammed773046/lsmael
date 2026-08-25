import React from 'react';
import { Metadata } from 'next';
import { Layers } from 'lucide-react';
import CategoryCard from '../../components/CategoryCard';
import { fetchCategories } from '../../lib/api';

export const metadata: Metadata = {
  title: 'أقسام وتجهيزات المناسبات',
  description: 'استعرض جميع أقسام محل إسماعيل للأفراح: خيام ملكية، طرابيل، سجاد، ترامس ودلال، فناجين وضيافة، وكراسي وطاولات.',
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold border border-gold-300">
          <Layers className="w-3.5 h-3.5" />
          <span>كتالوج الأقسام المتكامل</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-obsidian-900">
          أقسام مستلزمات الأفراح والمناسبات
        </h1>
        <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed">
          اختر القسم الذي يناسب متطلبات مناسبتكم واستكشف التشكيلة الواسعة من الخيام، المفارش، ومعدات الضيافة الملكية.
        </p>
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gold-200">
          <p className="text-obsidian-600 text-sm">لا توجد أقسام منشورة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
