// cynosure-backend/controllers/aiController.js
// Purpose:
// - Handle AI analysis of quiz + resume for school/college students.
// - Handle chat requests with resume + quiz context.

import { getAIAnalysis, getAIChatResponse } from '../utils/aiClient.js';
import Resume from '../models/Resume.js';
import Result from '../models/Result.js';
import QuizResponse from '../models/QuizResponse.js';

// Analyze user based on quiz + resume
export const analyzeUser = async (req, res) => {
  const { quizAnswers, resumeText, hasResume } = req.body;
  const userId = req.user._id;

  if (!quizAnswers) {
    return res.status(400).json({ message: 'Quiz answers are required.' });
  }

  try {
    const safeText = resumeText || '';
    const safeHasResume = hasResume === true || hasResume === 'true';

    const analysisData = await getAIAnalysis(quizAnswers, safeText, safeHasResume);

    await Result.findOneAndUpdate(
      { user: userId },
      { user: userId, ...analysisData },
      { upsert: true, new: true }
    );

    res.json(analysisData);
  } catch (error) {
    console.error('Controller Analysis Error:', error);
    res.status(500).json({ message: 'AI analysis failed', error: error.message });
  }
};

// Chat with AI using resume + quiz context
export const handleChat = async (req, res) => {
  const { messages, resumeText, quizContext } = req.body;
  const userId = req.user._id;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Messages array is required' });
  }

  try {
    // Resume context: prefer request body, fallback to DB
    let contextText = resumeText || '';
    if (!contextText) {
      const savedResume = await Resume.findOne({ user: userId });
      if (savedResume) {
        contextText = savedResume.parsedText || '';
      }
    }

    // Quiz context: prefer request body, fallback to DB
    let finalQuizContext = quizContext || '';
    if (!finalQuizContext) {
      const savedQuiz = await QuizResponse.findOne({ user: userId });
      if (savedQuiz && savedQuiz.answers) {
        // If answers is a Map, convert; if object, use Object.entries
        const entries = Array.isArray(savedQuiz.answers)
          ? savedQuiz.answers
          : Object.entries(savedQuiz.answers);

        finalQuizContext = entries
          .map(([k, v]) => `Question ${k}: ${v}`)
          .join('; ');
      }
    }

    const reply = await getAIChatResponse(messages, contextText, finalQuizContext);
    res.json({ reply });
  } catch (error) {
    console.error('Controller Chat Error:', error);
    res.status(500).json({ message: 'Chat processing failed' });
  }
};
