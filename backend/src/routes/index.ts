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

// Lightweight Cron / Health check endpoints for keep-alive
router.get('/cron', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.status(200).send('OK');
});

router.head('/cron', (req, res) => {
  res.status(200).end();
});

router.get('/health', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send('OK');
});

export default router;
