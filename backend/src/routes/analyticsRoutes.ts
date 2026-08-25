import { Router } from 'express';
import { trackEvent, getAdminStats } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/track', trackEvent);
router.get('/admin/stats', authenticate, getAdminStats);

export default router;
