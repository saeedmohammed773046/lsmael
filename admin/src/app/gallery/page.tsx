'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { adminFetch, getFullImageUrl } from '../../lib/api';
import { GalleryItem, ProductImage } from '../../types';
import ImageUploader from '../../components/ImageUploader';

export default function GalleryManagerPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryTag, setCategoryTag] = useState('أعراس');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = async () => {
    try {
      const res = await adminFetch('/gallery/admin/all');
      if (res.success) setItems(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setCategoryTag('أعراس');
    setImages([]);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setDescription(item.description || '');
    setCategoryTag(item.categoryTag || 'أعراس');
    setImages(item.images || []);
    setError(null);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingItem) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^\w\u0621-\u064A\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated || `work-${Date.now().toString().slice(-4)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (images.length === 0) {
        setError('يرجى رفع صورة واحدة على الأقل للعمل');
        setSubmitting(false);
        return;
      }

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        categoryTag: categoryTag.trim() || undefined,
        images: images.map((img, idx) => ({
          imagePath: img.imagePath,
          altText: img.altText || title.trim(),
          sortOrder: idx,
          isPrimary: img.isPrimary,
        })),
      };

      let res;
      if (editingItem) {
        res = await adminFetch(`/gallery/admin/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await adminFetch('/gallery/admin', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        setModalOpen(false);
        fetchGallery();
      } else {
        setError(res.message || 'فشل حفظ العمل');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل تريد حذف العمل "${title}"؟`)) return;
    try {
      const res = await adminFetch(`/gallery/admin/${id}`, { method: 'DELETE' });
      if (res.success) fetchGallery();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-obsidian-900">
            إدارة معرض الأعمال والتجهيزات ({items.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            إضافة وتوثيق صور تجهيزات الأفراح والمخيمات المنفذة على أرض الواقع.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة عمل جديد</span>
        </button>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-500">جاري تحميل أعمال المعرض...</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-gray-200">
          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-600">لا توجد أعمال منشورة في المعرض</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-gold-500 text-obsidian-950 text-xs font-bold rounded-xl"
          >
            إضافة أول عمل
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const primaryImg = item.images?.find((i) => i.isPrimary) || item.images?.[0];
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={getFullImageUrl(primaryImg?.imagePath)}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.categoryTag && (
                    <span className="absolute top-3 right-3 bg-obsidian-900/80 text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {item.categoryTag}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-obsidian-900">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-[11px] text-gray-400">{item.images?.length || 0} صور</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-gray-600 hover:text-gold-700 rounded-lg hover:bg-gold-50"
                        title="تعديل"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-obsidian-900 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-base">{editingItem ? 'تعديل العمل' : 'إضافة عمل جديد لمعرض التجهيزات'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-bold text-obsidian-800 mb-1">
                  عنوان العمل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="مثال: تجهيز زفاف ملكي في قاعة الخيام"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-obsidian-800 mb-1">
                    الاسم اللطيف (Slug) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-left outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-bold text-obsidian-800 mb-1">
                    تصنيف العمل
                  </label>
                  <input
                    type="text"
                    value={categoryTag}
                    onChange={(e) => setCategoryTag(e.target.value)}
                    placeholder="أعراس، ضيافة، مخيمات..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-obsidian-800 mb-1">
                  وصف مختصر للتجهيز
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="تفاصيل التجهيز، المساحة، نوع الفرش والإضاءات..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none"
                ></textarea>
              </div>

              {/* Images */}
              <div>
                <label className="block font-bold text-obsidian-800 mb-1">
                  صور العمل والتجهيز <span className="text-red-500">*</span>
                </label>
                <ImageUploader images={images} onChange={setImages} />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-obsidian-800 font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl shadow disabled:opacity-50"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ العمل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
