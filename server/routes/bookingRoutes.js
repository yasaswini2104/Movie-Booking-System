import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
