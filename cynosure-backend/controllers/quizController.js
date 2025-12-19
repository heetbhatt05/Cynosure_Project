import asyncHandler from 'express-async-handler';
import QuizResponse from '../models/QuizResponse.js';

// @desc    Save Quiz Answers
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  if (!answers) {
    res.status(400);
    throw new Error('No answers provided');
  }

  const response = await QuizResponse.findOneAndUpdate(
    { user: req.user.id },
    { 
      user: req.user.id, 
      answers 
    },
    { new: true, upsert: true }
  );

  res.status(200).json({
    message: 'Quiz saved',
    response
  });
});

export { submitQuiz };