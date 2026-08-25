import { Router } from 'express';
import { login, getMe, updateProfile, setupInitialData } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/setup', setupInitialData);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

export default router;
