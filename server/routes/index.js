import express from 'express';

import authRoutes from './authRoutes.js';
import cinemaRoutes from './cinemaRoutes.js';
import screenRoutes from './screenRoutes.js';
import movieRoutes from './movieRoutes.js';
import showRoutes from './showRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cinemas', cinemaRoutes);
router.use('/screens', screenRoutes);
router.use('/movies', movieRoutes);
router.use('/shows', showRoutes);
router.use('/bookings', bookingRoutes);

export default router;