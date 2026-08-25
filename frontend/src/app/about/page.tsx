import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Sparkles, Shield, Award, Clock, Users, Phone, MessageCircle } from 'lucide-react';
import { fetchSettings } from '../../lib/api';

export const metadata: Metadata = {
  title: 'من نحن | نبذة عن إسماعيل للأفراح والمناسبات',
  description: 'تعرف على قصة وخبرة إسماعيل للأفراح في تأجير وتجهيز مستلزمات الأفراح والخيام الملكية.',
};

export default async function AboutPage() {
  const settings = await fetchSettings();

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-900 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span>قصتنا ورؤيتنا</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-obsidian-900">
            إسماعيل للأفراح والمناسبات
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            الرواد في تجهيز وتأجير مستلزمات المناسبات والأعراس الفاخرة بأعلى معايير الأصالة والفخامة.
          </p>
        </div>

        {/* Story & Image Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-12 rounded-3xl border border-gold-200 shadow-sm">
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold text-obsidian-900 border-r-4 border-gold-500 pr-3">
              من نحن وماذا نقدم؟
            </h2>
            <div className="text-sm text-gray-700 leading-loose space-y-4">
              <p>
                {settings.aboutUsText ||
                  'تأسست مؤسسة إسماعيل للأفراح والمناسبات لتقديم خدمات ضيافة وتجهيز متكاملة تجمع بين أصالة التراث العربي العريق وفخامة التجهيزات العصرية الحديثة.'}
              </p>
              <p>
                نحرص دائماً على توفير أرقى أنواع الخيام الملكية وبيوت الشعر التراثية، والطرابيل العازلة، وأطقم السجاد والمفارش الفندقية، وكراسي المناسبات الأنيقة، وترامس ودلال الشاي والقهوة المذهبة لضمان خروج مناسبتكم بأبهى صورة.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`tel:${settings.phone}`}
                className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>اتصل بنا مباشرة</span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-5 relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-gold-200">
            <Image
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
              alt="إسماعيل للأفراح والمناسبات"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gold-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-obsidian-900">الجودة والتميز</h3>
            <p className="text-xs text-obsidian-600 leading-relaxed">
              نعتمد أجود الخامات الكورية والألمانية في الخيام والطرابيل وأفخر أطقم الضيافة المذهبة.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gold-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-obsidian-900">الالتزام بالوقت</h3>
            <p className="text-xs text-obsidian-600 leading-relaxed">
              نحترم وقت العميل ونضمن إتمام كافة التجهيزات قبل موعد بدء المناسبة بوقت مريح.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gold-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-obsidian-900">الأسعار المنافسة</h3>
            <p className="text-xs text-obsidian-600 leading-relaxed">
              باقات مرنة تناسب مختلف الميزانيات مع عروض خاصة للحفلات الكبيرة والتجهيزات الدورية.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gold-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-obsidian-900">خدمة عملاء راقية</h3>
            <p className="text-xs text-obsidian-600 leading-relaxed">
              فريق متواجد لخدمتكم والإجابة عن استفساراتكم واقتراح أفضل الحلول لمناسبتكم.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
