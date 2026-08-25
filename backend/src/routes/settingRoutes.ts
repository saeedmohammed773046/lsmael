import { Router } from 'express';
import { getPublicSettings, updateSettings } from '../controllers/settingController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getPublicSettings);
router.put('/admin', authenticate, updateSettings);

export default router;
