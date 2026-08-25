import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, 'اسم القسم مطلوب'),
  slug: z.string().min(2, 'الاسم اللطيف (slug) مطلوب'),
  description: z.string().optional().nullable(),
  imagePath: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

// Public: Get all active categories with product counts
export const getPublicCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isPublished: true,
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: categories.map((cat) => ({
        ...cat,
        productsCount: cat._count.products,
      })),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الأقسام',
      error: error.message,
    });
  }
};

// Public: Get category by slug with its published products
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findFirst({
      where: {
        slug,
        isActive: true,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isPublished: true,
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!category) {
      res.status(404).json({ success: false, message: 'القسم غير موجود' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...category,
        productsCount: category._count.products,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب تفاصيل القسم',
      error: error.message,
    });
  }
};

// Admin: Get all categories (including inactive)
export const getAdminCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        _count: {
          select: {
            products: {
              where: { deletedAt: null },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: categories.map((cat) => ({
        ...cat,
        productsCount: cat._count.products,
      })),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الأقسام',
      error: error.message,
    });
  }
};

// Admin: Create category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = categorySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const existing = await prisma.category.findUnique({
      where: { slug: parseResult.data.slug },
    });

    if (existing && !existing.deletedAt) {
      res.status(400).json({ success: false, message: 'الاسم اللطيف (Slug) مستخدم بالفعل، يرجى اختيار اسم آخر' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name: parseResult.data.name,
        slug: parseResult.data.slug,
        description: parseResult.data.description,
        imagePath: parseResult.data.imagePath,
        isActive: parseResult.data.isActive ?? true,
        sortOrder: parseResult.data.sortOrder ?? 0,
      },
    });

    res.status(201).json({
      success: true,
      message: 'تم إضافة القسم بنجاح',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء القسم',
      error: error.message,
    });
  }
};

// Admin: Update category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = categorySchema.partial().safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category || category.deletedAt) {
      res.status(404).json({ success: false, message: 'القسم غير موجود' });
      return;
    }

    if (parseResult.data.slug && parseResult.data.slug !== category.slug) {
      const existing = await prisma.category.findUnique({
        where: { slug: parseResult.data.slug },
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        res.status(400).json({ success: false, message: 'الاسم اللطيف (Slug) مستخدم بالفعل' });
        return;
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: parseResult.data,
    });

    res.json({
      success: true,
      message: 'تم تحديث القسم بنجاح',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث القسم',
      error: error.message,
    });
  }
};

// Admin: Delete category (Soft delete)
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: { where: { deletedAt: null } } },
        },
      },
    });

    if (!category || category.deletedAt) {
      res.status(404).json({ success: false, message: 'القسم غير موجود' });
      return;
    }

    if (category._count.products > 0) {
      // Soft delete to protect linked product relationships
      await prisma.category.update({
        where: { id },
        data: { deletedAt: new Date(), isActive: false },
      });
    } else {
      await prisma.category.delete({
        where: { id },
      });
    }

    res.json({
      success: true,
      message: 'تم حذف القسم بنجاح',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف القسم',
      error: error.message,
    });
  }
};
