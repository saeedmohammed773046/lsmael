'use client';

import React, { useEffect, useState } from 'react';
import { Save, Settings, CheckCircle2, Phone, MessageCircle, MapPin } from 'lucide-react';
import { adminFetch } from '../../lib/api';

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [aboutUsText, setAboutUsText] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminFetch('/settings');
        if (res.success && res.data) {
          const s = res.data;
          setStoreName(s.storeName || '');
          setStoreDescription(s.storeDescription || '');
          setPhone(s.phone || '');
          setWhatsapp(s.whatsapp || '');
          setSecondaryPhone(s.secondaryPhone || '');
          setEmail(s.email || '');
          setAddress(s.address || '');
          setGoogleMapsUrl(s.googleMapsUrl || '');
          setAboutUsText(s.aboutUsText || '');
          setHeroTitle(s.heroTitle || '');
          setHeroSubtitle(s.heroSubtitle || '');
        }
      } catch {} finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        storeName,
        storeDescription,
        phone,
        whatsapp,
        secondaryPhone,
        email,
        address,
        googleMapsUrl,
        aboutUsText,
        heroTitle,
        heroSubtitle,
      };

      const res = await adminFetch('/settings/admin', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(res.message || 'فشل حفظ الإعدادات');
      }
    } catch {
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-gray-500">جاري تحميل إعدادات الموقع...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-obsidian-900">إعدادات وبيانات الموقع</h1>
          <p className="text-xs text-gray-500 mt-1">
            التحكم في اسم المحل، أرقام التواصل والواتساب، والعنوان المعروض للعملاء.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-xs shadow-sm transition-all disabled:opacity-50"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>حفظ جميع الإعدادات</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ وتحديث إعدادات الموقع بنجاح!</span>
        </div>
      )}

      {/* Identity Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
          بيانات المحل والهوية
        </h2>

        <div>
          <label className="block font-bold text-obsidian-800 mb-1">اسم المحل الرسمي</label>
          <input
            type="text"
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gold-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-obsidian-800 mb-1">الوصف التعريفي العام (SEO)</label>
          <textarea
            rows={2}
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-obsidian-800 mb-1">عنوان الهيرو الرئيسي</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-obsidian-800 mb-1">النص الفرعي للهيرو</label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-obsidian-800 mb-1">نبذة من نحن</label>
          <textarea
            rows={3}
            value={aboutUsText}
            onChange={(e) => setAboutUsText(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none"
          ></textarea>
        </div>
      </div>

      {/* Contact Details Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
          بيانات التواصل والموقع الجغرافي
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-obsidian-800 mb-1">رقم الهاتف الأساسي (tel)</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="966500000000"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-left outline-none font-mono"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block font-bold text-obsidian-800 mb-1">رقم الواتساب الرسمي (بدون + أو مسافات)</label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="966500000000"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-left outline-none font-mono"
              dir="ltr"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-obsidian-800 mb-1">رقم هاتف إضافي (اختياري)</label>
            <input
              type="text"
              value={secondaryPhone}
              onChange={(e) => setSecondaryPhone(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-left outline-none font-mono"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block font-bold text-obsidian-800 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-left outline-none"
              dir="ltr"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-obsidian-800 mb-1">العنوان النصي</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-obsidian-800 mb-1">رابط خرائط جوجل (Google Maps URL)</label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-left outline-none"
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
