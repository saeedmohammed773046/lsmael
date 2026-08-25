'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Layers, Check, X, Eye, EyeOff } from 'lucide-react';
import { adminFetch, getFullImageUrl, uploadSingleFile } from '../../../lib/admin/api';
import { Category } from '../../../types';

export default function CategoriesManagerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await adminFetch('/categories/admin/all');
      if (res.success) {
        setCategories(res.data);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImagePath('');
    setSortOrder(categories.length + 1);
    setIsActive(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImagePath(cat.imagePath || '');
    setSortOrder(cat.sortOrder);
    setIsActive(cat.isActive);
    setError(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      // Auto generate slug from Arabic/English name
      const generatedSlug = val
        .trim()
        .toLowerCase()
        .replace(/[^\w\u0621-\u064A\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug || `cat-${Date.now().toString().slice(-4)}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const path = await uploadSingleFile(e.target.files[0]);
      setImagePath(path);
    } catch (err: any) {
      alert(err.message || 'فشل رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        imagePath: imagePath || undefined,
        sortOrder,
        isActive,
      };

      let res;
      if (editingCategory) {
        res = await adminFetch(`/categories/admin/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await adminFetch('/categories/admin', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        setModalOpen(false);
        fetchCategories();
      } else {
        setError(res.message || 'حدث خطأ أثناء حفظ القسم');
      }
    } catch (err: any) {
      setError(err.message || 'تعذر حفظ القسم');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف قسم "${name}"؟`)) return;

    try {
      const res = await adminFetch(`/categories/admin/${id}`, { method: 'DELETE' });
      if (res.success) {
        fetchCategories();
      } else {
        alert(res.message || 'فشل حذف القسم');
      }
    } catch {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const toggleStatus = async (cat: Category) => {
    try {
      await adminFetch(`/categories/admin/${cat.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      fetchCategories();
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-obsidian-900">
            إدارة أقسام وتصنيفات المحل
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            إضافة وتعديل وترتيب أقسام المستلزمات المعروضة في الموقع العام.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-500">جاري تحميل الأقسام...</div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Layers className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-600">لا توجد أقسام مسجلة حتى الآن</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-gold-500 text-obsidian-950 text-xs font-bold rounded-xl"
            >
              إضافة أول قسم
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">صورة القسم</th>
                  <th className="py-3.5 px-4 font-bold">اسم القسم</th>
                  <th className="py-3.5 px-4 font-bold">الاسم اللطيف (Slug)</th>
                  <th className="py-3.5 px-4 font-bold">عدد الأصناف</th>
                  <th className="py-3.5 px-4 font-bold">الترتيب</th>
                  <th className="py-3.5 px-4 font-bold">الحالة</th>
                  <th className="py-3.5 px-4 font-bold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <Image
                          src={getFullImageUrl(cat.imagePath)}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-obsidian-900">{cat.name}</td>
                    <td className="py-3 px-4 font-mono text-gray-500">{cat.slug}</td>
                    <td className="py-3 px-4">
                      <span className="bg-gold-50 text-gold-800 font-bold px-2 py-0.5 rounded-md border border-gold-200">
                        {cat.productsCount ?? 0} صنف
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-bold">{cat.sortOrder}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(cat)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {cat.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{cat.isActive ? 'منشور' : 'مخفي'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-gray-600 hover:text-gold-700 hover:bg-gold-50 rounded-lg transition-colors"
                          title="تعديل القسم"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف القسم"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-5 bg-obsidian-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">
                {editingCategory ? 'تعديل بيانات القسم' : 'إضافة قسم جديد'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  اسم القسم <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="مثال: الخيام الملكية"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  الاسم اللطيف (Slug للرابط) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="royal-tents"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  وصف القسم
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="نبذة مختصرة عن المستلزمات المتوفرة في هذا القسم..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  صورة القسم
                </label>
                <div className="flex items-center gap-3">
                  {imagePath && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      <Image
                        src={getFullImageUrl(imagePath)}
                        alt="صورة القسم"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold-50 file:text-gold-800 hover:file:bg-gold-100"
                  />
                </div>
                {uploadingImage && <p className="text-[11px] text-gold-700 mt-1">جاري رفع الصورة...</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-obsidian-800 mb-1">
                    ترتيب الظهور
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-gold-600 rounded focus:ring-gold-500"
                    />
                    <span className="text-xs font-bold text-obsidian-800">نشر القسم وتفعيله</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-obsidian-800 font-bold rounded-xl text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ القسم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
