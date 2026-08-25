import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { z } from 'zod';
import { ServiceType, PriceType, AvailabilityStatus } from '@prisma/client';

const productSchema = z.object({
  categoryId: z.string().min(1, 'القسم مطلوب'),
  name: z.string().min(2, 'اسم الصنف مطلوب'),
  slug: z.string().min(2, 'الاسم اللطيف (Slug) مطلوب'),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  serviceType: z.nativeEnum(ServiceType).optional().default(ServiceType.RENTAL),
  price: z.number().optional().nullable(),
  priceType: z.nativeEnum(PriceType).optional().default(PriceType.CONTACT),
  availabilityStatus: z.nativeEnum(AvailabilityStatus).optional().default(AvailabilityStatus.AVAILABLE),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  images: z.array(
    z.object({
      imagePath: z.string(),
      altText: z.string().optional().nullable(),
      sortOrder: z.number().optional().default(0),
      isPrimary: z.boolean().optional().default(false),
    })
  ).optional(),
});

// Public: Get products with filters, search, pagination, and sorting
export const getPublicProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      categorySlug,
      categoryId,
      serviceType,
      availability,
      search,
      featured,
      sort = 'newest',
      page = '1',
      limit = '12',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isPublished: true,
      deletedAt: null,
      category: {
        isActive: true,
        deletedAt: null,
      },
    };

    if (categorySlug) {
      where.category = {
        ...where.category,
        slug: categorySlug as string,
      };
    } else if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (serviceType && Object.values(ServiceType).includes(serviceType as ServiceType)) {
      where.serviceType = serviceType as ServiceType;
    }

    if (availability && Object.values(AvailabilityStatus).includes(availability as AvailabilityStatus)) {
      where.availabilityStatus = availability as AvailabilityStatus;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { shortDescription: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { category: { name: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'name') {
      orderBy = { name: 'asc' };
    } else if (sort === 'popular') {
      orderBy = { viewsCount: 'desc' };
    } else if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: [
              { isPrimary: 'desc' },
              { sortOrder: 'asc' },
            ],
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: products,
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
      message: 'حدث خطأ أثناء جلب الأصناف',
      error: error.message,
    });
  }
};

// Public: Get product by slug with full details, increment view count & get related products
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isPublished: true,
        deletedAt: null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'الصنف غير موجود' });
      return;
    }

    // Increment views count asynchronously in background
    prisma.product.update({
      where: { id: product.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    // Fetch related products from same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isPublished: true,
        deletedAt: null,
      },
      take: 4,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
          take: 1,
        },
      },
    });

    res.json({
      success: true,
      data: {
        ...product,
        relatedProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب تفاصيل الصنف',
      error: error.message,
    });
  }
};

// Admin: Get all products with full admin filters
export const getAdminProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId, serviceType, search, isPublished, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      deletedAt: null,
    };

    if (categoryId) where.categoryId = categoryId as string;
    if (serviceType) where.serviceType = serviceType as ServiceType;
    if (isPublished !== undefined) where.isPublished = isPublished === 'true';

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { slug: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: products,
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
      message: 'حدث خطأ أثناء جلب الأصناف',
      error: error.message,
    });
  }
};

// Admin: Get single product by ID
export const getAdminProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
      },
    });

    if (!product || product.deletedAt) {
      res.status(404).json({ success: false, message: 'الصنف غير موجود' });
      return;
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الصنف',
      error: error.message,
    });
  }
};

// Admin: Create product with images
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = productSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const { images, ...productData } = parseResult.data;

    const existing = await prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    if (existing && !existing.deletedAt) {
      res.status(400).json({ success: false, message: 'الاسم اللطيف (Slug) مستخدم بالفعل' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: images && images.length > 0 ? {
          create: images.map((img, idx) => ({
            imagePath: img.imagePath,
            altText: img.altText || productData.name,
            sortOrder: img.sortOrder ?? idx,
            isPrimary: img.isPrimary ?? (idx === 0),
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'تم إضافة الصنف بنجاح',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء الصنف',
      error: error.message,
    });
  }
};

// Admin: Update product and images
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = productSchema.partial().safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing || existing.deletedAt) {
      res.status(404).json({ success: false, message: 'الصنف غير موجود' });
      return;
    }

    if (parseResult.data.slug && parseResult.data.slug !== existing.slug) {
      const slugCheck = await prisma.product.findUnique({
        where: { slug: parseResult.data.slug },
      });
      if (slugCheck && slugCheck.id !== id && !slugCheck.deletedAt) {
        res.status(400).json({ success: false, message: 'الاسم اللطيف (Slug) مستخدم بالفعل' });
        return;
      }
    }

    const { images, ...productData } = parseResult.data;

    // Update product fields
    const updated = await prisma.$transaction(async (tx) => {
      if (images !== undefined) {
        // Replace images list if provided
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img, idx) => ({
              productId: id,
              imagePath: img.imagePath,
              altText: img.altText || productData.name || existing.name,
              sortOrder: img.sortOrder ?? idx,
              isPrimary: img.isPrimary ?? (idx === 0),
            })),
          });
        }
      }

      return tx.product.update({
        where: { id },
        data: productData,
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
        },
      });
    });

    res.json({
      success: true,
      message: 'تم تحديث الصنف بنجاح',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الصنف',
      error: error.message,
    });
  }
};

// Admin: Duplicate product
export const duplicateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const source = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!source || source.deletedAt) {
      res.status(404).json({ success: false, message: 'الصنف غير موجود' });
      return;
    }

    const newSlug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newName = `${source.name} (نسخة)`;

    const duplicated = await prisma.product.create({
      data: {
        categoryId: source.categoryId,
        name: newName,
        slug: newSlug,
        shortDescription: source.shortDescription,
        description: source.description,
        serviceType: source.serviceType,
        price: source.price,
        priceType: source.priceType,
        availabilityStatus: source.availabilityStatus,
        isFeatured: false,
        isPublished: false, // Default to unpublished draft
        images: {
          create: source.images.map((img) => ({
            imagePath: img.imagePath,
            altText: img.altText,
            sortOrder: img.sortOrder,
            isPrimary: img.isPrimary,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'تم تكرار الصنف كمسودة جديدة بنجاح',
      data: duplicated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تكرار الصنف',
      error: error.message,
    });
  }
};

// Admin: Delete product (Soft delete)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: { select: { bookingItems: true } },
      },
    });

    if (!product || product.deletedAt) {
      res.status(404).json({ success: false, message: 'الصنف غير موجود' });
      return;
    }

    if (product._count.bookingItems > 0) {
      // Soft delete to protect historical bookings
      await prisma.product.update({
        where: { id },
        data: { deletedAt: new Date(), isPublished: false },
      });
    } else {
      await prisma.product.delete({
        where: { id },
      });
    }

    res.json({
      success: true,
      message: 'تم حذف الصنف بنجاح',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الصنف',
      error: error.message,
    });
  }
};
