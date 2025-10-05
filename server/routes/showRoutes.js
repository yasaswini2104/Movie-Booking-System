import express from 'express';
import {
  getShowsByCinema,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
  getShowSeatsWithBookings
} from '../controllers/showController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/cinema/:cinemaId', getShowsByCinema);
router.get('/:id', getShowById);
router.get('/:id/seats-bookings', protect, adminOnly, getShowSeatsWithBookings);
router.post('/', protect, adminOnly, createShow);
router.put('/:id', protect, adminOnly, updateShow);
router.delete('/:id', protect, adminOnly, deleteShow);

export default router;
