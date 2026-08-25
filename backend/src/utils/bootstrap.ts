import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import { Role, ServiceType, PriceType, AvailabilityStatus } from '@prisma/client';

export async function bootstrapDatabase() {
  try {
    console.log('🔄 Checking database initial state...');

    // 1. Ensure Admin User exists (admin@gmail.com / admin12345)
    const passwordHash = await bcrypt.hash('admin12345', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@gmail.com' },
      update: {
        name: 'إدارة إسماعيل للأفراح',
        passwordHash,
        isActive: true,
      },
      create: {
        name: 'إدارة إسماعيل للأفراح',
        email: 'admin@gmail.com',
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log('✅ Admin User verified & active:', admin.email);

    // 2. Ensure Site Settings exist
    const settingsCount = await prisma.siteSetting.count();
    if (settingsCount === 0) {
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
        heroTitle: 'أفراحكم تكتمل بأرقى التجهيزات والخيام الملكية',
        heroSubtitle: 'نوفر أحدث الخيام، الطرابيل، السجاد، مستلزمات الضيافة العربية، والجلسات لجميع المناسبات بأفضل الأسعار وأعلى جودة.',
      };

      for (const [key, value] of Object.entries(settingsData)) {
        await prisma.siteSetting.create({
          data: { key, value },
        });
      }
      console.log('✅ Site Settings seeded successfully');
    }

    // 3. Ensure Categories and Products exist
    const categoriesCount = await prisma.category.count();
    if (categoriesCount === 0) {
      console.log('📦 Auto-seeding initial categories & products...');
      
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
          name: 'الجلسات العربية والتراثية',
          slug: 'arabic-seating',
          description: 'جلسات ديوانية يمنية وخليجية متكاملة بمساند وتكايات مطرزة فاخرة ومريحة.',
          imagePath: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          sortOrder: 4,
        },
        {
          name: 'مستلزمات الضيافة والدلال',
          slug: 'hospitality-coffee',
          description: 'دلال رسلان عربية، فناجين مذهبة، مباخر، حافظات طعام، وترامس شاهي وقهوة فاخرة.',
          imagePath: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
          sortOrder: 5,
        },
        {
          name: 'الكراسي والطاولات',
          slug: 'chairs-tables',
          description: 'كراسي نابليون فندقية، كراسي ملكية مذهبة، وطاولات بياضات تلائم جميع الحفلات.',
          imagePath: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
          sortOrder: 6,
        },
      ];

      for (const cat of categoriesData) {
        const createdCategory = await prisma.category.create({ data: cat });

        // Add a sample featured product for each category
        await prisma.product.create({
          data: {
            categoryId: createdCategory.id,
            name: `تجهيز فاخر - ${cat.name}`,
            slug: `${cat.slug}-vip`,
            description: `أرقى باقات ${cat.name} الشاملة للتوصيل والتركيب بأعلى جودة وخامات ممتازة.`,
            serviceType: ServiceType.RENTAL,
            priceType: PriceType.STARTING_FROM,
            price: 50000,
            availabilityStatus: AvailabilityStatus.AVAILABLE,
            isFeatured: true,
            images: {
              create: [
                {
                  imagePath: cat.imagePath,
                  isPrimary: true,
                  sortOrder: 1,
                },
              ],
            },
          },
        });
      }
      console.log('✅ Initial categories and products seeded successfully');
    }
  } catch (error) {
    console.error('⚠️ Auto-bootstrap warning:', error);
  }
}
