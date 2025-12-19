import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore.js';
import RadarChart from '../components/RadarChart.jsx';
import { motion } from 'framer-motion';
import './Results.css';

const Results = () => {
  const navigate = useNavigate();
  const { aiResult } = useStore();

  useEffect(() => {
    if (!aiResult) {
      navigate('/quiz');
    }
  }, [aiResult, navigate]);

  if (!aiResult) return <div className="loading-spinner">Loading your results...</div>;

  const { 
    personalityTraits = [], 
    recommendedCareers = [], 
    resumeFeedback = [], 
    actionItems = [], 
    personalizedMessage = "" 
  } = aiResult;

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      className="results-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <header className="results-header">
        <h1 className="results-title">Career Intelligence Report</h1>
        <button onClick={handlePrint} className="print-button">
          🖨️ Save as PDF
        </button>
      </header>

      {/* Executive Summary */}
      <motion.div 
        className="summary-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2>Executive Summary</h2>
        <p className="message-text">{personalizedMessage}</p>
      </motion.div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        
        {/* Left Column: Personality */}
        <motion.aside 
          className="glass-panel personality-panel"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>🧠 Profile DNA</h2>
          <div className="chart-wrapper">
            <RadarChart data={personalityTraits} />
          </div>
          <div className="traits-list">
            {personalityTraits.map((trait, idx) => (
              <div key={idx} className="trait-row">
                <span className="trait-label">{trait.trait}</span>
                <div className="trait-bar-bg">
                  <motion.div 
                    className="trait-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${trait.score}%` }}
                    transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                  />
                </div>
                <span className="trait-value">{trait.score}%</span>
              </div>
            ))}
          </div>
        </motion.aside>

        {/* Right Column: Careers */}
        <main className="careers-panel">
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: '700' }}>Top Career Matches</h2>
          <div className="careers-grid">
            {recommendedCareers.map((career, idx) => (
              <motion.div 
                key={idx} 
                className="career-card-modern"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
              >
                <div className="career-rank">#{idx + 1}</div>
                <div className="career-header">
                  <div className="career-title-group">
                    <h3 className="career-title">{career.title}</h3>
                    <span className="match-badge">{career.matchScore}% Match</span>
                  </div>
                </div>
                <p className="career-desc">{career.description}</p>
                <div className="skills-container">
                  {career.recommended_skills?.map((skill, sIdx) => (
                    <span key={sIdx} className="skill-pill">{skill}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {/* Action Plan Grid */}
      <div className="action-plan-grid">
        <motion.div 
          className="glass-panel"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2>📄 Resume Audit</h2>
          <ul className="list-modern feedback">
            {resumeFeedback.length > 0 ? resumeFeedback.map((item, i) => (
              <li key={i}>{item}</li>
            )) : <li>No resume feedback available.</li>}
          </ul>
        </motion.div>

        <motion.div 
          className="glass-panel"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2>🚀 Immediate Actions</h2>
          <ul className="list-modern actions">
            {actionItems.length > 0 ? actionItems.map((item, i) => (
              <li key={i}>{item}</li>
            )) : <li>No action items generated.</li>}
          </ul>
        </motion.div>
      </div>

      {/* Chat CTA */}
      <motion.div 
        className="chat-cta-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h3>Have questions about this report?</h3>
        <button className="chat-cta-button" onClick={() => navigate('/chat')}>
          Chat with AI Advisor
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Results;