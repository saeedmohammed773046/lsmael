import { Router } from 'express';
import { uploadSingleImage, uploadMultipleImages } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/single', authenticate, upload.single('image'), uploadSingleImage);
router.post('/multiple', authenticate, upload.array('images', 10), uploadMultipleImages);

export default router;
