import { Router } from 'express';
import {
  getPublicOffers,
  getAdminOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from '../controllers/offerController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getPublicOffers);
router.get('/admin/all', authenticate, getAdminOffers);
router.post('/admin', authenticate, createOffer);
router.put('/admin/:id', authenticate, updateOffer);
router.delete('/admin/:id', authenticate, deleteOffer);

export default router;
