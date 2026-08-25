import { Router } from 'express';
import {
  createBooking,
  getAdminBookings,
  getAdminBookingById,
  updateBookingStatus,
} from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public: Submit booking
router.post('/', createBooking);

// Admin: Manage bookings
router.get('/admin/all', authenticate, getAdminBookings);
router.get('/admin/:id', authenticate, getAdminBookingById);
router.patch('/admin/:id/status', authenticate, updateBookingStatus);

export default router;
