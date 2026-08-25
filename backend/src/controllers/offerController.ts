import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { z } from 'zod';

const offerSchema = z.object({
  title: z.string().min(2, 'عنوان العرض مطلوب'),
  description: z.string().optional().nullable(),
  imagePath: z.string().optional().nullable(),
  discountText: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

// Public: Get active offers
export const getPublicOffers = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: offers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب العروض', error: error.message });
  }
};

// Admin: Get all offers
export const getAdminOffers = async (req: Request, res: Response): Promise<void> => {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: offers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب العروض', error: error.message });
  }
};

// Admin: Create offer
export const createOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = offerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
      return;
    }

    const { startDate, endDate, ...data } = parseResult.data;

    const offer = await prisma.offer.create({
      data: {
        ...data,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    res.status(201).json({ success: true, message: 'تم إضافة العرض بنجاح', data: offer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء إضافة العرض', error: error.message });
  }
};

// Admin: Update offer
export const updateOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = offerSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
      return;
    }

    const { startDate, endDate, ...data } = parseResult.data;
    const updatePayload: any = { ...data };
    if (startDate !== undefined) updatePayload.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updatePayload.endDate = endDate ? new Date(endDate) : null;

    const offer = await prisma.offer.update({
      where: { id },
      data: updatePayload,
    });

    res.json({ success: true, message: 'تم تحديث العرض بنجاح', data: offer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث العرض', error: error.message });
  }
};

// Admin: Delete offer
export const deleteOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.offer.delete({ where: { id } });
    res.json({ success: true, message: 'تم حذف العرض بنجاح' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف العرض', error: error.message });
  }
};
