import express from 'express';
import { analyzeUser, handleChat } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeUser);
router.post('/chat', protect, handleChat);

export default router;