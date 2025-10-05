import express from 'express';
import {
  getAllScreens,
  getScreenById,
  createScreen,
  updateScreen,
  deleteScreen
} from '../controllers/screenController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllScreens);
router.get('/:id', getScreenById);
router.post('/', protect, adminOnly, createScreen);
router.put('/:id', protect, adminOnly, updateScreen);
router.delete('/:id', protect, adminOnly, deleteScreen);

export default router;