import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Search, Filter, Sparkles, Layers } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { fetchProducts, fetchCategories, fetchSettings } from '../../lib/api';

export const metadata: Metadata = {
  title: 'كتالوج الأصناف والمستلزمات الكامل',
  description: 'تصفح جميع مستلزمات الأفراح والمناسبات: خيام، طرابيل، سجاد، ترامس، فناجين، كراسي، طاولات، وديكورات بأسعار مناسبة.',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;
  const categorySlug = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const serviceType = typeof resolvedParams.serviceType === 'string' ? resolvedParams.serviceType : undefined;
  const featured = typeof resolvedParams.featured === 'string' ? resolvedParams.featured === 'true' : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'newest';
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;

  const [categories, { products, pagination }, settings] = await Promise.all([
    fetchCategories(),
    fetchProducts({
      search,
      categorySlug,
      serviceType,
      featured,
      sort,
      page,
      limit: 12,
    }),
    fetchSettings(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold border border-gold-300">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>الكتالوج الإلكتروني الشامل</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-obsidian-900">
          أصناف وتجهيزات الأفراح والمناسبات
        </h1>
        <p className="text-xs sm:text-sm text-obsidian-600">
          ابحث وتصفح كافة الأصناف والمعدات المتوفرة للإيجار والبيع لدى محل إسماعيل.
        </p>
      </div>

      {/* Global Search & Filters Bar */}
      <div className="bg-white rounded-3xl p-5 border border-gold-200 shadow-sm space-y-4">
        {/* Search Input Form */}
        <form method="GET" action="/products" className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gold-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="ابحث بالاسم، الوصف، أو نوع التجهيز..."
              className="w-full pr-10 pl-4 py-2.5 bg-cream-50/60 border border-gold-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
            />
          </div>
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          {serviceType && <input type="hidden" name="serviceType" value={serviceType} />}
          <button
            type="submit"
            className="px-6 py-2.5 bg-obsidian-900 hover:bg-obsidian-800 text-gold-300 rounded-xl text-xs sm:text-sm font-bold transition-colors"
          >
            بحث
          </button>
        </form>

        {/* Categories Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <Link
            href={`/products${search ? `?search=${search}` : ''}`}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              !categorySlug
                ? 'bg-gold-500 text-obsidian-950 font-bold shadow-sm'
                : 'bg-cream-100 text-obsidian-700 hover:bg-cream-200'
            }`}
          >
            جميع الأقسام ({pagination.total})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}${search ? `&search=${search}` : ''}${
                serviceType ? `&serviceType=${serviceType}` : ''
              }`}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                categorySlug === cat.slug
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-sm'
                  : 'bg-cream-100 text-obsidian-700 hover:bg-cream-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Service Type & Sorting Sub-Bar */}
        <div className="pt-3 border-t border-cream-200 flex flex-wrap justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-obsidian-600 font-bold">نوع الخدمة:</span>
            <Link
              href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}${search ? `search=${search}&` : ''}`}
              className={`px-2.5 py-1 rounded-md ${!serviceType ? 'bg-gold-100 text-gold-900 font-bold' : 'text-obsidian-600'}`}
            >
              الكل
            </Link>
            <Link
              href={`/products?serviceType=RENTAL${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}
              className={`px-2.5 py-1 rounded-md ${serviceType === 'RENTAL' ? 'bg-gold-100 text-gold-900 font-bold' : 'text-obsidian-600'}`}
            >
              للإيجار
            </Link>
            <Link
              href={`/products?serviceType=SALE${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}
              className={`px-2.5 py-1 rounded-md ${serviceType === 'SALE' ? 'bg-gold-100 text-gold-900 font-bold' : 'text-obsidian-600'}`}
            >
              للبيع
            </Link>
            <Link
              href={`/products?serviceType=RENTAL_AND_SALE${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}`}
              className={`px-2.5 py-1 rounded-md ${serviceType === 'RENTAL_AND_SALE' ? 'bg-gold-100 text-gold-900 font-bold' : 'text-obsidian-600'}`}
            >
              إيجار وبيـع
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-obsidian-600 font-bold">الترتيب:</span>
            <Link
              href={`/products?sort=newest${categorySlug ? `&category=${categorySlug}` : ''}${serviceType ? `&serviceType=${serviceType}` : ''}`}
              className={`px-2 py-1 rounded ${sort === 'newest' ? 'text-gold-700 font-bold' : 'text-obsidian-600'}`}
            >
              الأحدث
            </Link>
            <Link
              href={`/products?sort=popular${categorySlug ? `&category=${categorySlug}` : ''}${serviceType ? `&serviceType=${serviceType}` : ''}`}
              className={`px-2 py-1 rounded ${sort === 'popular' ? 'text-gold-700 font-bold' : 'text-obsidian-600'}`}
            >
              الأكثر مشاهدة
            </Link>
          </div>
        </div>
      </div>

      {/* Active Search/Filter Notification */}
      {(search || categorySlug || serviceType) && (
        <div className="flex items-center justify-between text-xs text-obsidian-700 bg-gold-50 p-3 rounded-2xl border border-gold-200">
          <p>
            نتائج البحث: تم العثور على <strong>{pagination.total}</strong> صنف
            {search && <span> لكلمة &quot;{search}&quot;</span>}
          </p>
          <Link href="/products" className="text-gold-700 font-bold hover:underline">
            إلغاء جميع الفلاتر
          </Link>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gold-200 space-y-3">
          <p className="text-base font-bold text-obsidian-800">لم يتم العثور على أي أصناف مطابقة</p>
          <p className="text-xs text-obsidian-500">جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً</p>
          <Link href="/products" className="inline-block mt-2 px-5 py-2 bg-gold-500 text-obsidian-950 font-bold rounded-xl text-xs">
            عرض جميع الأصناف
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} whatsapp={settings.whatsapp} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pt-8 flex justify-center items-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/products?page=${p}${categorySlug ? `&category=${categorySlug}` : ''}${serviceType ? `&serviceType=${serviceType}` : ''}${search ? `&search=${search}` : ''}&sort=${sort}`}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                p === pagination.page
                  ? 'bg-gold-500 text-obsidian-950 shadow-md'
                  : 'bg-white text-obsidian-700 hover:bg-cream-100 border border-gold-200'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
