import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const defaultSettings: Record<string, string> = {
  storeName: 'إسماعيل للأفراح والمناسبات ومستلزمات الأفراح',
  storeDescription: 'الوجهة الأولى لتأجير وتجهيز مستلزمات الأفراح والمناسبات الفاخرة - خيام ملكية، طرابيل، سجاد، دلال وضيافة، كراسي وطاولات، وجلسات تراثية وحديثة بأعلى معايير الجودة والتميز.',
  phone: '773046703',
  whatsapp: '773046703',
  secondaryPhone: '701896696',
  email: 'ismail@gmail.com',
  address: 'اليمن - حضرموت - غيل باوزير - مقابل مؤسسة الروضة الاجتماعية',
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

// Public: Get site settings
export const getPublicSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap = { ...defaultSettings };

    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    res.json({
      success: true,
      data: settingsMap,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب إعدادات الموقع',
      error: error.message,
    });
  }
};

// Admin: Update site settings
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates: Record<string, string> = req.body;

    const upsertPromises = Object.entries(updates).map(([key, value]) => {
      const stringVal = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value: stringVal },
        create: { key, value: stringVal },
      });
    });

    await Promise.all(upsertPromises);

    const allSettings = await prisma.siteSetting.findMany();
    const resultMap = { ...defaultSettings };
    allSettings.forEach((s) => {
      resultMap[s.key] = s.value;
    });

    res.json({
      success: true,
      message: 'تم حفظ إعدادات الموقع بنجاح',
      data: resultMap,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث إعدادات الموقع',
      error: error.message,
    });
  }
};
