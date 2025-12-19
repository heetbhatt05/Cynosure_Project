import express from 'express';
import { submitQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', protect, submitQuiz);

export default router;