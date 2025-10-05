import express from 'express';
import {
  getAllCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema
} from '../controllers/cinemaController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCinemas);
router.get('/:id', getCinemaById);
router.post('/', protect, adminOnly, createCinema);
router.put('/:id', protect, adminOnly, updateCinema);
router.delete('/:id', protect, adminOnly, deleteCinema);

export default router;