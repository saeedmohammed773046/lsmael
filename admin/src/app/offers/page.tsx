'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Tag, X, Eye, EyeOff } from 'lucide-react';
import { adminFetch, getFullImageUrl, uploadSingleFile } from '../../lib/api';
import { Offer } from '../../types';

export default function OffersManagerPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountText, setDiscountText] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      const res = await adminFetch('/offers/admin/all');
      if (res.success) setOffers(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openAddModal = () => {
    setEditingOffer(null);
    setTitle('');
    setDescription('');
    setDiscountText('');
    setImagePath('');
    setIsActive(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setTitle(offer.title);
    setDescription(offer.description || '');
    setDiscountText(offer.discountText || '');
    setImagePath(offer.imagePath || '');
    setIsActive(offer.isActive);
    setError(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const path = await uploadSingleFile(e.target.files[0]);
      setImagePath(path);
    } catch (err: any) {
      alert(err.message || 'فشل رفع الصورة');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        discountText: discountText.trim() || undefined,
        imagePath: imagePath || undefined,
        isActive,
      };

      let res;
      if (editingOffer) {
        res = await adminFetch(`/offers/admin/${editingOffer.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await adminFetch('/offers/admin', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        setModalOpen(false);
        fetchOffers();
      } else {
        setError(res.message || 'فشل حفظ العرض');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ العرض');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل تريد حذف العرض "${title}"؟`)) return;
    try {
      const res = await adminFetch(`/offers/admin/${id}`, { method: 'DELETE' });
      if (res.success) fetchOffers();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-obsidian-900">
            إدارة العروض والباقات الترويجية ({offers.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            إضافة وتفعيل باقات الأفراح والخصومات الموسمية للمحل.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة عرض جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-gray-500">جاري تحميل العروض...</div>
      ) : offers.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-gray-200">
          <Tag className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-600">لا توجد عروض مسجلة حالياً</p>
          <button onClick={openAddModal} className="px-4 py-2 bg-gold-500 text-obsidian-950 text-xs font-bold rounded-xl">
            إضافة أول عرض
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-3 py-1 rounded-full">
                    {offer.discountText || 'عرض خاص'}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    offer.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {offer.isActive ? 'مفعل في الموقع' : 'معطل'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-obsidian-900">{offer.title}</h3>
                {offer.description && (
                  <p className="text-xs text-gray-600 leading-relaxed">{offer.description}</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="text-[11px] text-gray-400">تاريخ الإنشاء: {new Date(offer.createdAt).toLocaleDateString('ar-SA')}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(offer)}
                    className="p-1.5 text-gray-600 hover:text-gold-700 rounded-lg hover:bg-gold-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id, offer.title)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-5 bg-obsidian-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">{editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-bold text-obsidian-800 mb-1">
                  عنوان العرض / الباقة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: باقة الفخامة المتكاملة للأفراح"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-obsidian-800 mb-1">
                  نص الخصم أو التميز
                </label>
                <input
                  type="text"
                  value={discountText}
                  onChange={(e) => setDiscountText(e.target.value)}
                  placeholder="مثال: خصم 25% للحجوزات المبكرة"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-obsidian-800 mb-1">
                  تفاصيل ومكونات العرض
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب تفاصيل الباقة والملحقات المشمولة..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-obsidian-800 mb-1">صورة العرض</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-gold-600 rounded"
                  />
                  <span className="font-bold text-obsidian-800">تفعيل ونشر العرض في الموقع</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
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
                  {submitting ? 'جاري الحفظ...' : 'حفظ العرض'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
