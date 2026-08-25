'use client';

import React, { useState } from 'react';
import { User, Lock, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminFetch } from '../../lib/api';

export default function AccountPage() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError('كلمة المرور الجديدة غير متطابقة مع تأكيد كلمة المرور');
      return;
    }

    setSaving(true);
    try {
      const payload: any = { name, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await adminFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setSuccessMsg('تم تحديث بيانات الحساب بنجاح');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(res.message || 'فشل تحديث البيانات');
      }
    } catch {
      setError('حدث خطأ أثناء التحديث');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-obsidian-900">الملف الشخصي والحساب</h1>
        <p className="text-xs text-gray-500 mt-1">
          تعديل الاسم والبريد الإلكتروني وتغيير كلمة مرور المدير.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5 text-xs">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
            المعلومات الأساسية
          </h2>

          <div>
            <label className="block font-bold text-obsidian-800 mb-1">الاسم الكامل</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-obsidian-800 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white text-left"
              dir="ltr"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h2 className="text-sm font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
            تغيير كلمة المرور (اختياري)
          </h2>

          <div>
            <label className="block font-bold text-obsidian-800 mb-1">كلمة المرور الحالية</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white text-left"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-obsidian-800 mb-1">كلمة المرور الجديدة</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-bold text-obsidian-800 mb-1">تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </form>
    </div>
  );
}
