import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, Filter, Layers } from 'lucide-react';
import ProductCard from '../../../components/ProductCard';
import { fetchCategoryBySlug, fetchProducts, fetchSettings, getFullImageUrl } from '../../../lib/api';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) return { title: 'القسم غير موجود' };

  return {
    title: `${category.name} | مستلزمات وتجهيزات الأفراح`,
    description: category.description || `استعرض أصناف وتجهيزات ${category.name} في محل إسماعيل للأفراح.`,
    openGraph: {
      title: category.name,
      description: category.description || undefined,
      images: category.imagePath ? [getFullImageUrl(category.imagePath)] : undefined,
    },
  };
}

export default async function CategoryDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const category = await fetchCategoryBySlug(slug);
  if (!category) notFound();

  const serviceType = typeof resolvedSearchParams.serviceType === 'string' ? resolvedSearchParams.serviceType : undefined;
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'newest';
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;

  const [{ products, pagination }, settings] = await Promise.all([
    fetchProducts({
      categorySlug: slug,
      serviceType,
      sort,
      page,
      limit: 12,
    }),
    fetchSettings(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-obsidian-500">
        <Link href="/" className="hover:text-gold-600 transition-colors">الرئيسية</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <Link href="/categories" className="hover:text-gold-600 transition-colors">الأقسام</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="text-gold-700 font-bold">{category.name}</span>
      </nav>

      {/* Category Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-obsidian-900 text-white min-h-[220px] flex items-center border border-gold-400/40 shadow-lg">
        {category.imagePath && (
          <Image
            src={getFullImageUrl(category.imagePath)}
            alt={category.name}
            fill
            className="object-cover opacity-25"
            priority
          />
        )}
        <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>{category.productsCount ?? products.length} صنف متوفر</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gold-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-obsidian-800 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-gold-600" />
            <span>نوع الخدمة:</span>
          </span>
          <Link
            href={`/categories/${slug}`}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              !serviceType ? 'bg-gold-500 text-obsidian-950 font-bold' : 'bg-cream-100 text-obsidian-700 hover:bg-cream-200'
            }`}
          >
            الكل
          </Link>
          <Link
            href={`/categories/${slug}?serviceType=RENTAL`}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              serviceType === 'RENTAL' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'bg-cream-100 text-obsidian-700 hover:bg-cream-200'
            }`}
          >
            للإيجار
          </Link>
          <Link
            href={`/categories/${slug}?serviceType=SALE`}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              serviceType === 'SALE' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'bg-cream-100 text-obsidian-700 hover:bg-cream-200'
            }`}
          >
            للبيع
          </Link>
          <Link
            href={`/categories/${slug}?serviceType=RENTAL_AND_SALE`}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              serviceType === 'RENTAL_AND_SALE' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'bg-cream-100 text-obsidian-700 hover:bg-cream-200'
            }`}
          >
            إيجار وبيـع
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-obsidian-600 font-medium">الترتيب:</span>
          <Link
            href={`/categories/${slug}?sort=newest${serviceType ? `&serviceType=${serviceType}` : ''}`}
            className={`px-2.5 py-1 rounded-md ${sort === 'newest' ? 'text-gold-700 font-bold' : 'text-obsidian-600'}`}
          >
            الأحدث
          </Link>
          <span className="text-cream-300">|</span>
          <Link
            href={`/categories/${slug}?sort=popular${serviceType ? `&serviceType=${serviceType}` : ''}`}
            className={`px-2.5 py-1 rounded-md ${sort === 'popular' ? 'text-gold-700 font-bold' : 'text-obsidian-600'}`}
          >
            الأكثر طلباً
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gold-200 space-y-3">
          <p className="text-base font-bold text-obsidian-800">لا توجد أصناف تطابق الفلتر المحدد حالياً</p>
          <Link href={`/categories/${slug}`} className="inline-block text-xs font-bold text-gold-600 hover:underline">
            إعادة تعيين الفلاتر
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} whatsapp={settings.whatsapp} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pt-8 flex justify-center items-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/categories/${slug}?page=${p}${serviceType ? `&serviceType=${serviceType}` : ''}&sort=${sort}`}
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
