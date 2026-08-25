'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Copy, Search, Filter, Eye, EyeOff, Package, Star } from 'lucide-react';
import { adminFetch, getFullImageUrl } from '../../lib/api';
import { Category, Product } from '../../types';

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCategories = async () => {
    try {
      const res = await adminFetch('/categories/admin/all');
      if (res.success) setCategories(res.data);
    } catch {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search.trim()) query.append('search', search.trim());
      if (selectedCategory) query.append('categoryId', selectedCategory);
      if (selectedServiceType) query.append('serviceType', selectedServiceType);
      query.append('page', page.toString());
      query.append('limit', '20');

      const res = await adminFetch(`/products/admin/all?${query.toString()}`);
      if (res.success) {
        setProducts(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.pagination.total);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedServiceType, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDuplicate = async (id: string) => {
    if (!confirm('هل تريد تكرار هذا الصنف كمسودة جديدة؟')) return;
    try {
      const res = await adminFetch(`/products/admin/${id}/duplicate`, { method: 'POST' });
      if (res.success) {
        fetchProducts();
      } else {
        alert(res.message || 'فشل تكرار الصنف');
      }
    } catch {
      alert('حدث خطأ أثناء التكرار');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الصنف "${name}"؟`)) return;
    try {
      const res = await adminFetch(`/products/admin/${id}`, { method: 'DELETE' });
      if (res.success) {
        fetchProducts();
      } else {
        alert(res.message || 'فشل حذف الصنف');
      }
    } catch {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const togglePublish = async (prod: Product) => {
    try {
      await adminFetch(`/products/admin/${prod.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isPublished: !prod.isPublished }),
      });
      fetchProducts();
    } catch {}
  };

  const getServiceBadge = (type: string) => {
    switch (type) {
      case 'RENTAL':
        return <span className="bg-gold-50 text-gold-800 border border-gold-200 px-2 py-0.5 rounded-md text-[11px] font-bold">للإيجار</span>;
      case 'SALE':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] font-bold">للبيع</span>;
      case 'RENTAL_AND_SALE':
        return <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md text-[11px] font-bold">إيجار وبيـع</span>;
      default:
        return <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md text-[11px] font-bold">للاستفسار</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-obsidian-900">
            إدارة الأصناف والمستلزمات ({totalCount})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            إضافة، تعديل، رفع صور، وتسعير كافة معدات المناسبات.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة صنف جديد</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث باسم الصنف أو الرابط..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-obsidian-900 text-gold-300 rounded-xl text-xs font-bold"
          >
            بحث
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
          >
            <option value="">جميع الأقسام</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedServiceType}
            onChange={(e) => {
              setSelectedServiceType(e.target.value);
              setPage(1);
            }}
            className="p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
          >
            <option value="">نوع الخدمة (الكل)</option>
            <option value="RENTAL">للإيجار</option>
            <option value="SALE">للبيع</option>
            <option value="RENTAL_AND_SALE">إيجار وبيع</option>
            <option value="INQUIRY">للاستفسار</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-500">جاري جلب الأصناف...</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-600">لا توجد أصناف مطابقة</p>
            <Link
              href="/products/new"
              className="inline-block px-4 py-2 bg-gold-500 text-obsidian-950 text-xs font-bold rounded-xl"
            >
              إضافة صنف الآن
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">الصورة</th>
                  <th className="py-3.5 px-4 font-bold">اسم الصنف</th>
                  <th className="py-3.5 px-4 font-bold">القسم</th>
                  <th className="py-3.5 px-4 font-bold">نوع الخدمة</th>
                  <th className="py-3.5 px-4 font-bold">السعر</th>
                  <th className="py-3.5 px-4 font-bold">المشاهدات</th>
                  <th className="py-3.5 px-4 font-bold">الحالة</th>
                  <th className="py-3.5 px-4 font-bold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => {
                  const primaryImg = prod.images.find((i) => i.isPrimary) || prod.images[0];
                  return (
                    <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                          <Image
                            src={getFullImageUrl(primaryImg?.imagePath)}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-obsidian-900 flex items-center gap-1.5">
                          <span>{prod.name}</span>
                          {prod.isFeatured && (
                            <span title="صنف مميز">
                              <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 block">{prod.slug}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-semibold">{prod.category?.name}</td>
                      <td className="py-3 px-4">{getServiceBadge(prod.serviceType)}</td>
                      <td className="py-3 px-4 font-bold text-obsidian-900 font-mono">
                        {prod.price ? `${Number(prod.price).toLocaleString('ar-YE')} ر.ي` : 'حسب الطلب'}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-semibold">{prod.viewsCount}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => togglePublish(prod)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            prod.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {prod.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{prod.isPublished ? 'منشور' : 'مسودة'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${prod.id}`}
                            className="p-2 text-gray-600 hover:text-gold-700 hover:bg-gold-50 rounded-lg transition-colors"
                            title="تعديل الصنف"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDuplicate(prod.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تكرار الصنف كمسودة"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف الصنف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  p === page
                    ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                    : 'bg-gray-100 text-obsidian-700 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
