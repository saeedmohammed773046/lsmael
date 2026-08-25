import { Router } from 'express';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import productRoutes from './productRoutes';
import bookingRoutes from './bookingRoutes';
import galleryRoutes from './galleryRoutes';
import offerRoutes from './offerRoutes';
import settingRoutes from './settingRoutes';
import analyticsRoutes from './analyticsRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/bookings', bookingRoutes);
router.use('/gallery', galleryRoutes);
router.use('/offers', offerRoutes);
router.use('/settings', settingRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin/upload', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Ismail Wedding & Events API',
  });
});

export default router;
