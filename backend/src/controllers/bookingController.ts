import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { z } from 'zod';
import { BookingStatus, EventType } from '@prisma/client';

const bookingSchema = z.object({
  customerName: z.string().min(2, 'اسم العميل مطلوب'),
  phone: z.string().min(8, 'رقم الهاتف مطلوب'),
  customerLocation: z.string().optional().nullable(),
  eventType: z.string().optional().nullable(),
  eventDate: z.string().optional().nullable(),
  rentalStartDate: z.string().optional().nullable(),
  rentalEndDate: z.string().optional().nullable(),
  daysCount: z.number().int().min(1).default(1),
  totalEstimatedPrice: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(
    z.object({
      productId: z.string().optional().nullable(),
      productName: z.string().min(1, 'اسم الصنف مطلوب'),
      quantity: z.number().int().min(1).default(1),
      unitPrice: z.number().optional().nullable(),
      daysCount: z.number().int().min(1).default(1),
      lineTotal: z.number().optional().nullable(),
      rentalStartDate: z.string().optional().nullable(),
      rentalEndDate: z.string().optional().nullable(),
      notes: z.string().optional().nullable(),
    })
  ).min(1, 'يجب تحديد صنف واحد على الأقل للحجز'),
});

// Helper to generate readable booking number (e.g., ISM-2026-1042)
const generateBookingNumber = (): string => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ISM-${year}-${rand}`;
};

// Public: Create a new booking request
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = bookingSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const { items, eventDate, rentalStartDate, rentalEndDate, totalEstimatedPrice, daysCount, ...bookingData } = parseResult.data;

    let uniqueBookingNumber = generateBookingNumber();
    let exists = await prisma.booking.findUnique({ where: { bookingNumber: uniqueBookingNumber } });
    while (exists) {
      uniqueBookingNumber = generateBookingNumber();
      exists = await prisma.booking.findUnique({ where: { bookingNumber: uniqueBookingNumber } });
    }

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: uniqueBookingNumber,
        customerName: bookingData.customerName,
        phone: bookingData.phone,
        customerLocation: bookingData.customerLocation || null,
        eventType: bookingData.eventType || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        rentalStartDate: rentalStartDate ? new Date(rentalStartDate) : null,
        rentalEndDate: rentalEndDate ? new Date(rentalEndDate) : null,
        daysCount: daysCount || 1,
        totalEstimatedPrice: totalEstimatedPrice !== undefined && totalEstimatedPrice !== null ? totalEstimatedPrice : null,
        notes: bookingData.notes || null,
        status: BookingStatus.NEW,
        items: {
          create: items.map((item) => ({
            productId: item.productId || null,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice !== undefined && item.unitPrice !== null ? item.unitPrice : null,
            daysCount: item.daysCount || daysCount || 1,
            lineTotal: item.lineTotal !== undefined && item.lineTotal !== null ? item.lineTotal : null,
            rentalStartDate: item.rentalStartDate ? new Date(item.rentalStartDate) : null,
            rentalEndDate: item.rentalEndDate ? new Date(item.rentalEndDate) : null,
            notes: item.notes || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Record analytics event in background
    prisma.analyticsEvent.create({
      data: {
        eventType: EventType.BOOKING_CREATED,
        referenceId: booking.id,
        metadata: JSON.stringify({ bookingNumber: booking.bookingNumber, itemsCount: items.length, total: totalEstimatedPrice }),
      },
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'تم إرسال طلب الحجز بنجاح، سيقوم فريق المحل بالتواصل معكم قريباً لتأكيد التفاصيل',
      data: {
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        totalEstimatedPrice: booking.totalEstimatedPrice,
        createdAt: booking.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال طلب الحجز',
      error: error.message,
    });
  }
};

// Admin: Get all bookings with filtering, search & pagination
export const getAdminBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status && Object.values(BookingStatus).includes(status as BookingStatus)) {
      where.status = status as BookingStatus;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { bookingNumber: { contains: searchTerm, mode: 'insensitive' } },
        { customerName: { contains: searchTerm, mode: 'insensitive' } },
        { phone: { contains: searchTerm, mode: 'insensitive' } },
        { customerLocation: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الحجوزات',
      error: error.message,
    });
  }
};

// Admin: Get booking by ID
export const getAdminBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'طلب الحجز غير موجود' });
      return;
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب تفاصيل الحجز',
      error: error.message,
    });
  }
};

// Admin: Update booking status
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes, totalEstimatedPrice } = req.body;

    if (!status || !Object.values(BookingStatus).includes(status as BookingStatus)) {
      res.status(400).json({ success: false, message: 'حالة الحجز المحددة غير صالحة' });
      return;
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      res.status(404).json({ success: false, message: 'طلب الحجز غير موجود' });
      return;
    }

    const updateData: any = { status };
    if (notes !== undefined) updateData.notes = notes;
    if (totalEstimatedPrice !== undefined) updateData.totalEstimatedPrice = totalEstimatedPrice;

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    res.json({
      success: true,
      message: 'تم تحديث حالة الحجز بنجاح',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث حالة الحجز',
      error: error.message,
    });
  }
};
