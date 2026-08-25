import { PrismaClient, Role, ServiceType, PriceType, AvailabilityStatus, BookingStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting and Seeding Ismail Events Database with Official Data...');

  // Clear existing items and reset cleanly
  await prisma.bookingItem.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.analyticsEvent.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.galleryImage.deleteMany({});
  await prisma.galleryItem.deleteMany({});
  await prisma.offer.deleteMany({});
  await prisma.siteSetting.deleteMany({});

  // 1. Create Default Admin User
  const passwordHash = await bcrypt.hash('admin123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ismail-events.com' },
    update: {
      name: 'إدارة إسماعيل للأفراح',
      passwordHash,
      isActive: true,
    },
    create: {
      name: 'إدارة إسماعيل للأفراح',
      email: 'admin@ismail-events.com',
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('Admin User ready:', admin.email);

  // 2. Official Settings
  const settingsData: Record<string, string> = {
    storeName: 'إسماعيل للأفراح والمناسبات ومستلزمات الأفراح',
    storeDescription: 'الوجهة الأولى لتأجير وتجهيز مستلزمات الأفراح والمناسبات الفاخرة - خيام ملكية، طرابيل، سجاد، دلال وضيافة، كراسي وطاولات، وجلسات تراثية وحديثة بأعلى معايير الجودة والتميز.',
    phone: '777949658',
    whatsapp: '777949658',
    secondaryPhone: '771446446',
    email: 'info@ismail-events.com',
    address: 'اليمن - خدمات التوصيل والتجهيز الميداني لكافة المحافظات والمناسبات',
    googleMapsUrl: 'https://maps.google.com',
    aboutUsText: 'إسماعيل للأفراح والمناسبات ومستلزمات الأفراح خياركم الأول لتجهيز أرقى المناسبات والاحتفالات والخيام الملكية ومستلزمات الضيافة العربية الأصيلة. بخبرة تمتد لسنوات، نقدم خدمات متكاملة تضمن راحة عملائنا ونجاح مناسباتهم بأعلى درجات الفخامة والإتقان.',
    workingHours: JSON.stringify({
      saturday: { open: '08:00', close: '23:00', isClosed: false },
      sunday: { open: '08:00', close: '23:00', isClosed: false },
      monday: { open: '08:00', close: '23:00', isClosed: false },
      tuesday: { open: '08:00', close: '23:00', isClosed: false },
      wednesday: { open: '08:00', close: '23:00', isClosed: false },
      thursday: { open: '08:00', close: '00:00', isClosed: false },
      friday: { open: '14:00', close: '00:00', isClosed: false },
    }),
    socialLinks: JSON.stringify({
      instagram: 'https://instagram.com',
      tiktok: 'https://tiktok.com',
      snapchat: 'https://snapchat.com',
      facebook: 'https://facebook.com',
    }),
    heroTitle: 'أفراحكم تكتمل بأرقى التجهيزات والخيام الملكية',
    heroSubtitle: 'نوفر أحدث الخيام، الطرابيل، السجاد، مستلزمات الضيافة العربية، والجلسات لجميع المناسبات بأفضل الأسعار وأعلى جودة.',
  };

  for (const [key, value] of Object.entries(settingsData)) {
    await prisma.siteSetting.create({
      data: { key, value },
    });
  }
  console.log('Site Settings Seeded with Official Numbers (777949658 / 771446446)');

  // 3. Official Categories
  const categoriesData = [
    {
      name: 'الخيام الملكية والتراثية',
      slug: 'royal-tents',
      description: 'أفخم الخيام الملكية والعربية وبيوت الشعر المقاومة للعوامل الجوية بمختلف المقاسات والتجهيزات.',
      imagePath: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
    },
    {
      name: 'الطرابيل والمظلات',
      slug: 'tarpaulins-shades',
      description: 'طرابيل كورية وألمانية عالية الجودة ومظلات ضد المطر والشمس لتغطية الساحات والمناسبات.',
      imagePath: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
    },
    {
      name: 'السجاد والمفارش الفاخرة',
      slug: 'carpets-rugs',
      description: 'سجاد ومفارش وممرات ملكية باللونين الأحمر والذهبي لإضفاء طابع الفخامة والأناقة.',
      imagePath: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
    },
    {
      name: 'الترامس ودِبَب الشاي والقهوة',
      slug: 'thermoses-tea-pots',
      description: 'ترامس فاخرة تحفظ الحرارة ودلال قهوة ودبب شاي استيل ونحاس بأحجام متعددة.',
      imagePath: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
    },
    {
      name: 'الفناجين وأدوات الضيافة',
      slug: 'hospitality-sets',
      description: 'أطقم فناجين قهوة عربية وبيالات شاي وصواني تقديم فاخرة ومباخر ومباخر استقبال.',
      imagePath: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      sortOrder: 5,
    },
    {
      name: 'الكراسي والطاولات والجلسات',
      slug: 'chairs-tables-majlis',
      description: 'كراسي فندقية، كراسي نابليون، طاولات بوفيه مستديرة ومستطيلة، وجلسات أرضية عربية مطرزة.',
      imagePath: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      sortOrder: 6,
    },
    {
      name: 'مستلزمات الإنارة والديكور',
      slug: 'lighting-decor',
      description: 'عقود إنارة، كشافات ليد، ثريات خيام، كوشات ومداخل استقبال ترحيبية.',
      imagePath: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
      sortOrder: 7,
    },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.create({
      data: { ...cat, isActive: true },
    });
    catMap[cat.slug] = c.id;
  }
  console.log('Seeded Categories:', Object.keys(catMap).length);

  // 4. Products
  const productsData = [
    {
      categoryId: catMap['royal-tents'],
      name: 'خيمة ملكية VIP مجهزة بالكامل (12×6 متر)',
      slug: 'vip-royal-tent-12x6',
      shortDescription: 'خيمة ملكية فخمة مبطنة بالقماش السدو الفاخر مع تكييف وإنارة وديكورات متكاملة.',
      description: 'خيمة ملكية مقاس 12 في 6 أمتار مجهزة بأفخم أنواع القماش العازل للحرارة والماء، مبطنة من الداخل بقماش تراثي ملكي فاخر، تشمل أعمدة قوية، فتحات مكيفات، إنارة مخفية وثريات، وتتسع لأكثر من 60 شخصاً براحة تامة. مناسبة لحفلات الأعراس، العزائم الرسمية، والمناسبات الكبرى.',
      serviceType: ServiceType.RENTAL,
      price: 85000,
      priceType: PriceType.STARTING_FROM,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      isFeatured: true,
      isPublished: true,
      images: [
        { imagePath: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80', isPrimary: true, altText: 'خيمة ملكية VIP من الخارج' },
        { imagePath: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80', isPrimary: false, altText: 'الخيمة الملكية من الداخل مع التجهيز' },
        { imagePath: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80', isPrimary: false, altText: 'جلسة داخل الخيمة' },
      ],
    },
    {
      categoryId: catMap['royal-tents'],
      name: 'بيت شعر تراثي أصيل (8×5 متر)',
      slug: 'traditional-hair-tent-8x5',
      shortDescription: 'بيت شعر عربي تراثي متين بتجهيزات الضيافة والشبة وجلسة السدو.',
      description: 'بيت شعر تقليدي أصيل مصنوع من خامات عالية الجودة ومقاومة للعواصف والأمطار، مجهز بوجار مشب قهوة، مساند متكأ فخمة، فرش سجاد سدو ملكي، مناسب للمخيمات والمناسبات العائلية واحتفالات الأعياد.',
      serviceType: ServiceType.RENTAL_AND_SALE,
      price: 55000,
      priceType: PriceType.FIXED,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      isFeatured: true,
      isPublished: true,
      images: [
        { imagePath: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', isPrimary: true, altText: 'بيت شعر تراثي' },
        { imagePath: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80', isPrimary: false, altText: 'تفاصيل السدو في بيت الشعر' },
      ],
    },
    {
      categoryId: catMap['tarpaulins-shades'],
      name: 'طرابيل كورية عازلة للماء والشمس (مقاسات متعددة)',
      slug: 'korean-waterproof-tarpaulins',
      shortDescription: 'طرابيل أصلية شديدة التحمل ومقاومة للتمزق والحرارة مع حلقات تثبيت متينة.',
      description: 'نوفر طرابيل كورية بيضاء وخضراء وزرقاء بأعلى سماكات (600 - 900 غرام)، مثالية لتغطية الساحات الخارجية في الأفراح والمناسبات وحماية الضيوف والجلسات من أشعة الشمس والأمطار.',
      serviceType: ServiceType.RENTAL_AND_SALE,
      price: 15000,
      priceType: PriceType.STARTING_FROM,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      isFeatured: false,
      isPublished: true,
      images: [
        { imagePath: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80', isPrimary: true, altText: 'طرابيل ومظلات تغطية' },
      ],
    },
    {
      categoryId: catMap['carpets-rugs'],
      name: 'طقم سجاد أحمر ملكي للأفراح والممرات VIP',
      slug: 'royal-red-carpet-vip-aisle',
      shortDescription: 'سجاد أحمر فاخر للممرات ومداخل العرسان ومساحات الجلوس الواسعة.',
      description: 'سجاد عالي الكثافة باللون الأحمر الملكي والذهبي، يمنح مناسبتكم هيبة وفخامة استثنائية، متوفر بطول ممرات من 10 إلى 50 متراً مع خدمة التثبيت والفرش الاحترافي.',
      serviceType: ServiceType.RENTAL,
      price: 20000,
      priceType: PriceType.STARTING_FROM,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      isFeatured: true,
      isPublished: true,
      images: [
        { imagePath: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', isPrimary: true, altText: 'سجاد أحمر ملكي' },
      ],
    },
    {
      categoryId: catMap['thermoses-tea-pots'],
      name: 'طقم ترامس ضيافة ذهبي وفضي فندقي (حافظ للحرارة 24 ساعة)',
      slug: 'luxury-gold-silver-thermos-set',
      shortDescription: 'طقم ترامس شاي وقهوة فاخر ستانلس ستيل مطلي بالذهب عالي الجودة.',
      description: 'أطقم ترامس ملكية أنيقة باللون الذهبي المنقوش والفضي اللامع، سعة 1 لتر و 1.5 لتر و 2 لتر، تحفظ الحرارة لساعات طويلة وتزين موائد الضيافة في الأعراس والمجالس.',
      serviceType: ServiceType.RENTAL_AND_SALE,
      price: 8000,
      priceType: PriceType.FIXED,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      isFeatured: true,
      isPublished: true,
      images: [
        { imagePath: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80', isPrimary: true, altText: 'طقم ترامس شاي وقهوة فخمة' },
      ],
    },
    {
      categoryId: catMap['hospitality-sets'],
      name: 'طقم صواني وفناجين ضيافة ملكية مذهبة (100 قطعة)',
      slug: 'royal-hospitality-cups-trays-set',
      shortDescription: 'تشكيلة كاملة من فناجين القهوة وبيالات الشاي الكريستال مع الصواني والمباخر.',
      description: 'مجموعة ضيافة ملكية متكاملة تشمل فناجين قهوة عربية مطلية بأطراف ذهبية، بيالات شاي زجاجية فاخرة مع صحونها، ملاعق مذهبة، سكريات، ومباخر عود واستقبال تليق بأبهى المناسبات.',
      serviceType: ServiceType.RENTAL,
      price: 350,
      priceType: PriceType.CONTACT,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      isFeatured: true,
      isPublished: true,
      images: [
        { imagePath: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80', isPrimary: true, altText: 'طقم فناجين وصواني ضيافة' },
      ],
    },
    {
      categoryId: catMap['chairs-tables-majlis'],
      name: 'كراسي نابليون ذهبية مع وسائد بيضاء فخمة',
      slug: 'gold-napoleon-event-chairs',
      shortDescription: 'كراسي حفلات نابليون الشهيرة المناسبة للمؤتمرات والأعراس الراقية.',
      description: 'كراسي مصنعة من مواد عالية الصلوبة مع طلاء ذهبي لامع مقاوم للخدش، مزودة بوسائد مريحة قابلة للتنظيف ومناسبة لجميع ترتيبات القاعات الخارجية والداخلية.',
      serviceType: ServiceType.RENTAL,
      price: 15,
      priceType: PriceType.STARTING_FROM,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      isFeatured: true,
      isPublished: true,
      images: [
        { imagePath: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80', isPrimary: true, altText: 'كراسي نابليون ذهبية' },
      ],
    },
    {
      categoryId: catMap['chairs-tables-majlis'],
      name: 'طاولات بوفيه واستقبال دائرية ومستطيلة مع أغطية حريرية',
      slug: 'banquet-buffet-tables-covers',
      shortDescription: 'طاولات متينة بمقاسات مختلفة مع مفارش ستان وتول فاخرة.',
      description: 'طاولات مناسبات دائرية تتسع لـ 8 إلى 10 أشخاص، وطاولات مستطيلة للبوفيه والتقديم، متوفرة بأغطية بألوان متنوعة (أوف وايت، ذهبي، كحلي، عنابي).',
      serviceType: ServiceType.RENTAL,
      price: 50,
      priceType: PriceType.FIXED,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
      isFeatured: false,
      isPublished: true,
      images: [
        { imagePath: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80', isPrimary: true, altText: 'طاولات بوفيه واستقبال' },
      ],
    },
  ];

  for (const prod of productsData) {
    const { images, ...data } = prod;
    await prisma.product.create({
      data: {
        ...data,
        images: {
          create: images.map((img, idx) => ({
            imagePath: img.imagePath,
            altText: img.altText,
            sortOrder: idx,
            isPrimary: img.isPrimary,
          })),
        },
      },
    });
  }
  console.log('Seeded Products Successfully');

  // 5. Gallery Items
  const galleryData = [
    {
      title: 'تجهيز زفاف ملكي فاخر بالخيام والإنارة الكاملة',
      slug: 'royal-wedding-setup-tents-lighting',
      description: 'تجهيز ساحة عرس متكاملة بخيام ملكية 20×10 وسجاد أحمر وكراسي نابليون مذهبة مع إضاءات ليد وعقود ترحيبية.',
      categoryTag: 'أعراس',
      images: [
        { imagePath: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80', isPrimary: true, altText: 'زفاف ملكي' },
        { imagePath: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80', isPrimary: false, altText: 'تفاصيل قاعة العرس' },
      ],
    },
    {
      title: 'تجهيز مجلس ضيافة واستقبال كبار الشخصيات',
      slug: 'vip-majlis-hospitality-setup',
      description: 'فرش مجلس تراثي فاخر مع كنب سدو ومساند دائرية ومباخر استقبال وأطقم دلال قهوة رسلان نحاسية.',
      categoryTag: 'استقبال وضيافة',
      images: [
        { imagePath: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80', isPrimary: true, altText: 'مجلس ضيافة كبار الشخصيات' },
      ],
    },
  ];

  for (const g of galleryData) {
    const { images, ...data } = g;
    await prisma.galleryItem.create({
      data: {
        ...data,
        images: {
          create: images.map((img, idx) => ({
            imagePath: img.imagePath,
            altText: img.altText,
            sortOrder: idx,
            isPrimary: img.isPrimary,
          })),
        },
      },
    });
  }
  console.log('Seeded Official Gallery Items');

  // 6. Special Offers
  const offersData = [
    {
      title: 'باقة الفخامة المتكاملة للأفراح والمناسبات',
      description: 'تشمل خيمة ملكية VIP مجهزة + 50 كرسي نابليون + سجاد وممر ملكي + أطقم ضيافة وترامس شاي وقهوة بسعر خاص.',
      discountText: 'خصم خاص للحجوزات المبكرة',
      imagePath: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    },
  ];

  for (const offer of offersData) {
    await prisma.offer.create({ data: offer });
  }
  console.log('Seeded Official Offers');

  console.log('Database reset & updated with clean official data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
