// cynosure-frontend/src/pages/Quiz.jsx
// Purpose:
// - Render the career personality quiz with smooth animations and progress.
// - Collect real user answers and route them to the Upload/Analysis flow (no dev shortcuts).

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore.js';
import QuestionCard from '../components/QuestionCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import sampleData from '../mock/sampleData.json';
import './Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const { setQuizResults } = useStore();

  const [questions, setQuestions] = useState([]); // Loaded quiz questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index of visible question
  const [answers, setAnswers] = useState({}); // Map of questionId -> selected answer
  const [loading, setLoading] = useState(true); // Loading state for questions
  const [error, setError] = useState(''); // Error message, if any

  // Load questions from local mock data once
  useEffect(() => {
    if (sampleData && sampleData.quizQuestions) {
      setQuestions(sampleData.quizQuestions);
      setLoading(false);
    } else {
      setError('Failed to load quiz questions.');
      setLoading(false);
    }
  }, []);

  // Handle selecting an answer for the current question
  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // Move to the next question if not at the end
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Submit quiz and move to upload/analysis step
  const handleSubmit = () => {
    try {
      setQuizResults(answers);
      navigate('/upload');
    } catch (err) {
      console.error(err);
      setError('Failed to save answers. Please try again.');
    }
  };

  // Early returns for loading/error/empty state
  if (loading) return <div className="loading-spinner">Loading Quiz...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (questions.length === 0) {
    return <div className="error-message">No questions found.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100; // Progress percent
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isCurrentAnswered = !!answers[currentQuestion.id]; // Require answer to enable Next

  return (
    <div className="quiz-container">
      <div className="quiz-header-row">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Career Personality Quiz
        </motion.h1>
        {/* Dev Skip button removed for production-ready flow */}
      </div>

      <div className="progress-bar-container">
        <motion.div
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%' }}
        >
          <QuestionCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            onAnswerSelect={(answer) => handleAnswerSelect(currentQuestion.id, answer)}
            selectedAnswer={answers[currentQuestion.id]}
          />
        </motion.div>
      </AnimatePresence>

      <div className="quiz-navigation">
        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            className="cta-button"
            disabled={!isCurrentAnswered}
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="cta-button"
            disabled={Object.keys(answers).length !== questions.length}
          >
            Submit &amp; Analyze
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
