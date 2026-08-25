import { Router } from 'express';
import {
  getPublicGallery,
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getPublicGallery);
router.get('/admin/all', authenticate, getAdminGallery);
router.post('/admin', authenticate, createGalleryItem);
router.put('/admin/:id', authenticate, updateGalleryItem);
router.delete('/admin/:id', authenticate, deleteGalleryItem);

export default router;
