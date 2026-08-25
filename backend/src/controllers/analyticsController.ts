import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { EventType, BookingStatus } from '@prisma/client';

// Public: Track analytics event
export const trackEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventType, referenceId, metadata } = req.body;

    if (!eventType || !Object.values(EventType).includes(eventType as EventType)) {
      res.status(400).json({ success: false, message: 'نوع الحدث غير صالح' });
      return;
    }

    await prisma.analyticsEvent.create({
      data: {
        eventType: eventType as EventType,
        referenceId: referenceId ? String(referenceId) : null,
        metadata: metadata ? (typeof metadata === 'object' ? JSON.stringify(metadata) : String(metadata)) : null,
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin: Get dashboard overview stats
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalCategories,
      totalProducts,
      publishedProducts,
      totalBookings,
      newBookings,
      confirmedBookings,
      totalGalleryItems,
      whatsappClicks,
      phoneClicks,
      topProducts,
      recentBookings,
    ] = await Promise.all([
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { isPublished: true, deletedAt: null } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: BookingStatus.NEW } }),
      prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      prisma.galleryItem.count(),
      prisma.analyticsEvent.count({ where: { eventType: EventType.WHATSAPP_CLICK } }),
      prisma.analyticsEvent.count({ where: { eventType: EventType.PHONE_CLICK } }),
      prisma.product.findMany({
        where: { deletedAt: null },
        orderBy: { viewsCount: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          viewsCount: true,
          category: { select: { name: true } },
          images: { where: { isPrimary: true }, take: 1, select: { imagePath: true } },
        },
      }),
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          items: { take: 2 },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        counts: {
          totalCategories,
          totalProducts,
          publishedProducts,
          totalBookings,
          newBookings,
          confirmedBookings,
          totalGalleryItems,
          whatsappClicks,
          phoneClicks,
        },
        topProducts,
        recentBookings,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإحصائيات',
      error: error.message,
    });
  }
};
