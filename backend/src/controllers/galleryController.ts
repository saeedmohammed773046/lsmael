import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { z } from 'zod';

const gallerySchema = z.object({
  title: z.string().min(2, 'عنوان العمل مطلوب'),
  slug: z.string().min(2, 'الاسم اللطيف (Slug) مطلوب'),
  description: z.string().optional().nullable(),
  categoryTag: z.string().optional().nullable(),
  eventDate: z.string().optional().nullable(),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
  images: z.array(
    z.object({
      imagePath: z.string(),
      altText: z.string().optional().nullable(),
      sortOrder: z.number().optional().default(0),
      isPrimary: z.boolean().optional().default(false),
    })
  ).optional(),
});

// Public: Get published gallery items
export const getPublicGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryTag } = req.query;
    const where: any = { isPublished: true };

    if (categoryTag && typeof categoryTag === 'string') {
      where.categoryTag = categoryTag;
    }

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
    });

    res.json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب أعمال المعرض', error: error.message });
  }
};

// Admin: Get all gallery items
export const getAdminGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
    });

    res.json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب أعمال المعرض', error: error.message });
  }
};

// Admin: Create gallery item
export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = gallerySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
      return;
    }

    const { images, eventDate, ...data } = parseResult.data;

    const existing = await prisma.galleryItem.findUnique({ where: { slug: data.slug } });
    if (existing) {
      res.status(400).json({ success: false, message: 'الاسم اللطيف (Slug) مستخدم بالفعل' });
      return;
    }

    const item = await prisma.galleryItem.create({
      data: {
        ...data,
        eventDate: eventDate ? new Date(eventDate) : null,
        images: images && images.length > 0 ? {
          create: images.map((img, idx) => ({
            imagePath: img.imagePath,
            altText: img.altText || data.title,
            sortOrder: img.sortOrder ?? idx,
            isPrimary: img.isPrimary ?? (idx === 0),
          })),
        } : undefined,
      },
      include: { images: true },
    });

    res.status(201).json({ success: true, message: 'تم إضافة العمل بنجاح', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء إضافة العمل', error: error.message });
  }
};

// Admin: Update gallery item
export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = gallerySchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
      return;
    }

    const { images, eventDate, ...data } = parseResult.data;

    const item = await prisma.$transaction(async (tx) => {
      if (images !== undefined) {
        await tx.galleryImage.deleteMany({ where: { galleryItemId: id } });
        if (images.length > 0) {
          await tx.galleryImage.createMany({
            data: images.map((img, idx) => ({
              galleryItemId: id,
              imagePath: img.imagePath,
              altText: img.altText || data.title || '',
              sortOrder: img.sortOrder ?? idx,
              isPrimary: img.isPrimary ?? (idx === 0),
            })),
          });
        }
      }

      const updatePayload: any = { ...data };
      if (eventDate !== undefined) {
        updatePayload.eventDate = eventDate ? new Date(eventDate) : null;
      }

      return tx.galleryItem.update({
        where: { id },
        data: updatePayload,
        include: {
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
        },
      });
    });

    res.json({ success: true, message: 'تم تحديث العمل بنجاح', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث العمل', error: error.message });
  }
};

// Admin: Delete gallery item
export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.galleryItem.delete({ where: { id } });
    res.json({ success: true, message: 'تم حذف العمل بنجاح' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف العمل', error: error.message });
  }
};
