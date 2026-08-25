import { Router } from 'express';
import {
  getPublicProducts,
  getProductBySlug,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  duplicateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getPublicProducts);
router.get('/:slug', getProductBySlug);

// Admin routes
router.get('/admin/all', authenticate, getAdminProducts);
router.get('/admin/:id', authenticate, getAdminProductById);
router.post('/admin', authenticate, createProduct);
router.put('/admin/:id', authenticate, updateProduct);
router.post('/admin/:id/duplicate', authenticate, duplicateProduct);
router.delete('/admin/:id', authenticate, deleteProduct);

export default router;
