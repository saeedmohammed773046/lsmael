import React from 'react';
import { Metadata } from 'next';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send } from 'lucide-react';
import { fetchSettings } from '../../lib/api';
import ContactFormClient from './ContactFormClient';

export const metadata: Metadata = {
  title: 'تواصل معنا | إسماعيل للأفراح والمناسبات',
  description: 'تواصل مع إسماعيل للأفراح والمناسبات عبر الهاتف، واتساب، أو نموذج الحجز الإلكتروني المباشر.',
};

export default async function ContactPage() {
  const settings = await fetchSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold border border-gold-300">
          <Phone className="w-3.5 h-3.5 text-gold-600" />
          <span>خدمة الضيوف والعملاء</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-obsidian-900">
          تواصل معنا أو اطلب حجزك الآن
        </h1>
        <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed">
          يسعدنا استقبال استفساراتكم وحجوزاتكم وتزويدكم بكافة التفاصيل والأسعار مباشرة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Details Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
              بيانات التواصل المباشر
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-obsidian-900">الاتصال المباشر:</p>
                  <a href={`tel:${settings.phone}`} className="text-xs text-gold-700 font-semibold hover:underline" dir="ltr">
                    +{settings.phone}
                  </a>
                  {settings.secondaryPhone && (
                    <p className="text-xs text-obsidian-500" dir="ltr">+{settings.secondaryPhone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-obsidian-900">مراسلة واتساب:</p>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 font-bold hover:underline"
                  >
                    فتح محادثة واتساب فورية
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-obsidian-900">الموقع والعنوان:</p>
                  <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-obsidian-600 hover:text-gold-700 leading-relaxed block">
                    {settings.address} (عرض على الخريطة)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-obsidian-900">البريد الإلكتروني:</p>
                  <a href={`mailto:${settings.email}`} className="text-xs text-obsidian-600 hover:underline">
                    {settings.email || 'info@ismail-events.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking & Inquiry Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
                نموذج طلب الحجز والاستفسار
              </h2>
              <p className="text-xs text-obsidian-600 mt-1">
                املأ النموذج وسيقوم مسؤول الحجوزات بالتواصل معكم فوراً لتأكيد التفاصيل.
              </p>
            </div>

            <ContactFormClient whatsapp={settings.whatsapp} />
          </div>
        </div>
      </div>
    </div>
  );
}
