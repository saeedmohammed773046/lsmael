#  «إسماعيل للأفراح والمناسبات ومستلزمات الأفراح»
### Production-Ready Web Application & Management System

مشروع ويب متكامل واحترافي تم تطويره خصيصاً لنشاط **«إسماعيل للأفراح والمناسبات ومستلزمات الأفراح»**، يجمع بين:
1. **الموقع العام للعملاء والزوار (Public Showcase & Catalog)**: تصميم عربي فاخر (RTL)، كتالوج أصناف ديناميكي بالكامل، بحث شامل، فلاتر متعددة، معرض صور تفاعلي مع تكبير Lightbox، استفسار عبر WhatsApp، اتصال هاتفي مباشر، ونظام طلبات حجز إلكتروني.
2. **لوحة التحكم الإدارية (Admin Dashboard)**: إدارة كاملة للأقسام، الأصناف، الصور المتعددة، الحجوزات ودورة حياتها، معرض الأعمال، العروض، الإحصائيات، وإعدادات الموقع.
3. **الخادم وقاعدة البيانات (REST API & PostgreSQL)**: خادم متين بقاعدة بيانات علائقية كاملة باستخدام Prisma ORM و PostgreSQL مع مصادقة JWT وحماية متقدمة.

---

## 📁 هيكل المجلدات الرئيسي (Folder Structure)

تم تنظيم المشروع بدقة واحترافية في 3 مجلدات رئيسية ومستقلة:

```text
d:\lsmael/
├── backend/    # خادم الـ REST API، اتصال PostgreSQL، نماذج Prisma، والمصادقة
├── frontend/   # موقع الزوار والعملاء العام (Next.js 15 App Router - Port 3000)
├── admin/      # لوحة تحكم الإدارة المستقلة (Next.js 15 App Router - Port 3001)
└── README.md   # دليل التشغيل والتوثيق
```

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

* **الواجهة الأمامية للزوار (`frontend/`)**: Next.js 15 (App Router, SSR, TypeScript, Tailwind CSS, Lucide Icons).
* **لوحة التحكم (`admin/`)**: Next.js 15 (TypeScript, Tailwind CSS, Lucide Icons, Drag & Drop Multi-Image Upload).
* **الخادم البرمجي (`backend/`)**: Node.js & Express (TypeScript, Zod Validation, JWT Auth, Multer, Helmet, Morgan).
* **قاعدة البيانات (`Database`)**: PostgreSQL 18 مع **Prisma ORM** لدعم المعاملات والعلاقات الكاملة وفهارس البحث.

---

## 🚀 بيانات الدخول الافتراضية للوحة التحكم

* **رابط لوحة التحكم**: `http://localhost:3001/login`
* **البريد الإلكتروني**: `admin@ismail-events.com`
* **كلمة المرور**: `admin123456`

---

## ⚙️ متطلبات التشغيل والتهيئة (Installation & Setup)

### 1. إعداد قاعدة بيانات PostgreSQL
تأكد من تشغيل خادم PostgreSQL على جهازك ثم إنشاء قاعدة البيانات:
```sql
CREATE DATABASE ismael_db;
```

### 2. تشغيل الـ Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run db:seed     # زرع البيانات التجريبية للأقسام والأصناف
npm run dev         # يعمل على المنفذ http://localhost:5000
```

### 3. تشغيل موقع الزوار العام (Frontend)
```bash
cd frontend
npm install
npm run dev         # يعمل على المنفذ http://localhost:3000
```

### 4. تشغيل لوحة التحكم (Admin Dashboard)
```bash
cd admin
npm install
npm run dev         # يعمل على المنفذ http://localhost:3001
```

---

## 🌐 المنافذ والروابط المحلية (URLs)

* **موقع الزوار العام**: [http://localhost:3000](http://localhost:3000)
* **لوحة التحكم الإدارية**: [http://localhost:3001](http://localhost:3001)
* **واجهة الـ API**: [http://localhost:5000/api](http://localhost:5000/api)
* **ملفات الصور المرفوعة**: [http://localhost:5000/uploads](http://localhost:5000/uploads)

---

## 🧪 اختبار السيناريو الرئيسي (Automated End-to-End Test)

لتشغيل فحص القبول الشامل للسيناريو الكامل:
```bash
cd backend
node test-e2e.js
```

يختبر السيناريو الآتي آلياً:
1. فحص صحة الخادم `GET /api/health`.
2. تسجيل دخول المدير والحصول على رمز JWT.
3. إنشاء قسم جديد في قاعدة البيانات.
4. إنشاء صنف ورفع الصور وتحديد نوع الخدمة.
5. تصفح العميل للقسم والصنف من الـ Public API.
6. إرسال العميل طلب حجز برقم تسلسلي تلقائي `ISM-2026-XXXX`.
7. ظهور الحجز في لوحة الإدارة ومراجعته.
8. تأكيد وتغيير حالة الحجز إلى `CONFIRMED`.
9. حذف وتصفية البيانات التجريبية بأمان.

---

## 🔒 الأمان وجودة الإنتاج (Security & Production Readiness)

* ✅ تشفير كلمات المرور باستخدام `bcryptjs`.
* ✅ حماية مسارات الإدارة عبر `Authorization: Bearer <JWT>`.
* ✅ التحقق من صحة المدخلات في الخادم باستخدام `Zod`.
* ✅ فحص أنواع وامتدادات الصور وحجم الملفات المرفوعة.
* ✅ Soft Deletes لحماية البيانات التاريخية للحجوزات عند حذف الأصناف.
* ✅ تهيئة SEO كاملة تشمل Dynamic Metadata, OpenGraph, JSON-LD Schema, Sitemap.xml, Robots.txt.
