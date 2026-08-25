'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Check } from 'lucide-react';
import { Category, Product, ProductImage, ServiceType, PriceType, AvailabilityStatus } from '../../types';
import { adminFetch } from '../../lib/admin/api';
import ImageUploader from './ImageUploader';

interface ProductFormProps {
  initialData?: Product | null;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [serviceType, setServiceType] = useState<ServiceType>(initialData?.serviceType || 'RENTAL');
  const [price, setPrice] = useState<string>(initialData?.price ? String(initialData.price) : '');
  const [priceType, setPriceType] = useState<PriceType>(initialData?.priceType || 'CONTACT');
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>(
    initialData?.availabilityStatus || 'AVAILABLE'
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured || false);
  const [isPublished, setIsPublished] = useState<boolean>(initialData?.isPublished ?? true);
  const [images, setImages] = useState<ProductImage[]>(initialData?.images || []);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await adminFetch('/categories');
        if (res.success) {
          setCategories(res.data);
          if (!categoryId && res.data.length > 0 && !isEditing) {
            setCategoryId(res.data[0].id);
          }
        }
      } catch {}
    };
    fetchCats();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val
        .trim()
        .toLowerCase()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug || `product-${Date.now().toString().slice(-4)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('يرجى إدخال اسم الصنف');
      return;
    }
    if (!categoryId) {
      setError('يرجى اختيار القسم التابع له الصنف');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        categoryId,
        name: name.trim(),
        slug: slug.trim() || undefined,
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim() || undefined,
        serviceType,
        price: price ? parseFloat(price) : undefined,
        priceType,
        availabilityStatus,
        isFeatured,
        isPublished,
        images: images.map((img, idx) => ({
          imagePath: img.imagePath,
          altText: img.altText || name,
          sortOrder: idx,
          isPrimary: img.isPrimary,
        })),
      };

      let res;
      if (isEditing && initialData) {
        res = await adminFetch(`/products/admin/${initialData.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await adminFetch('/products/admin', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        router.push('/admin/products');
      } else {
        setError(res.message || 'فشل حفظ الصنف، يرجى مراجعة البيانات');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ الصنف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-obsidian-900">
            {isEditing ? `تعديل صنف: ${initialData?.name}` : 'إضافة صنف جديد للكتالوج'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            أدخل مواصفات وتجهيزات الصنف وارفع الصور المرافقة له.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-obsidian-800 font-bold rounded-xl text-xs transition-colors"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-xs shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEditing ? 'حفظ التعديلات' : 'نشر الصنف الآن'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* Grid: Main Info + Images Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Basic & Pricing info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Core Info */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
              البيانات الأساسية للصنف
            </h2>

            <div>
              <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
                القسم التابع له <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
              >
                <option value="">-- اختر القسم المناسب --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
                اسم الصنف <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: خيمة ملكية VIP (12×6 متر)"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
                الاسم اللطيف للرابط (Slug) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="vip-royal-tent-12x6"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
                الوصف المختصر (يظهر في البطاقات والمعاينات)
              </label>
              <input
                type="text"
                placeholder="سطر يلخص أهم مميزات الصنف..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
                الوصف الكامل والمواصفات
              </label>
              <textarea
                rows={5}
                placeholder="اكتب مواصفات الخامة، الأبعاد، المقاسات، الملحقات، مناسبات الاستخدام..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none resize-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          {/* Card 2: Service & Price Type */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
              نوع الخدمة والتسعير
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
                  نوع الخدمة
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceType)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                >
                  <option value="RENTAL">للإيجار فقط</option>
                  <option value="SALE">للبيع فقط</option>
                  <option value="RENTAL_AND_SALE">للبيع والإيجار معاً</option>
                  <option value="INQUIRY">للاستفسار المباشر</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
                  طريقة عرض السعر
                </label>
                <select
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value as PriceType)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                >
                  <option value="STARTING_FROM">يبدأ من (Starting from)</option>
                  <option value="FIXED">سعر ثابت (Fixed)</option>
                  <option value="CONTACT">تواصل لمعرفة السعر</option>
                  <option value="HIDDEN">إخفاء السعر تماماً</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
                السعر اليومي التقديري (بالريال اليمني - اختياري)
              </label>
              <input
                type="number"
                step="1"
                placeholder="مثال: 25000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Images & Status Flags */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 3: Images Management */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
                صور الصنف والمعرض ({images.length})
              </h2>
              <span className="text-[11px] text-gray-500">الصورة الأولى هي المعاينة</span>
            </div>

            <ImageUploader images={images} onChange={setImages} />
          </div>

          {/* Card 4: Publishing & Feature Options */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
              حالة التوفر والنشر
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1.5">
                  حالة التوفر الحالية
                </label>
                <select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                >
                  <option value="AVAILABLE">متوفر وجاهز للتجهيز</option>
                  <option value="UNAVAILABLE">محجوز / غير متوفر حالياً</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-gold-600 rounded focus:ring-gold-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-obsidian-900 block">نشر في الموقع العام</span>
                    <span className="text-[11px] text-gray-500">سيظهر الصنف مباشرة للزوار في الكتالوج</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-gold-600 rounded focus:ring-gold-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-obsidian-900 block">تمييز في الصفحة الرئيسية</span>
                    <span className="text-[11px] text-gray-500">يظهر في قسم مختارات الأفراح الملكية</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
