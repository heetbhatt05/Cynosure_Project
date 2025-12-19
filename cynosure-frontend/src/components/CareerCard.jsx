import React from 'react';
import { motion } from 'framer-motion';

const CareerCard = ({ career, rank }) => {
  const { title, matchScore, description, recommended_skills } = career;

  return (
    <motion.div 
      className="career-card glass-card"
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="career-rank">#{rank}</div>
      <div className="career-card-header">
        <h3>{title}</h3>
        <span className="match-score">{matchScore}% Match</span>
      </div>
      <p className="career-description">{description}</p>
      <div className="skills-section">
        <h4>Key Skills to Develop:</h4>
        <div className="skills-tags">
          {recommended_skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CareerCard;