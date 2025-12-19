import React from 'react';

const QuestionCard = ({ question, options, onAnswerSelect, selectedAnswer }) => {
  return (
    <div className="question-card">
      <h3>{question}</h3>
      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => onAnswerSelect(option)}
            aria-pressed={selectedAnswer === option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;