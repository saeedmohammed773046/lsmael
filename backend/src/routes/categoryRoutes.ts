import { Router } from 'express';
import {
  getPublicCategories,
  getCategoryBySlug,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getPublicCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.get('/admin/all', authenticate, getAdminCategories);
router.post('/admin', authenticate, createCategory);
router.put('/admin/:id', authenticate, updateCategory);
router.delete('/admin/:id', authenticate, deleteCategory);

export default router;
