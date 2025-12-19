import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore.js';
import api from '../utils/api.js';
import FileUploader from '../components/FileUploader.jsx';
import { motion } from 'framer-motion';
import './Upload.css';

const Upload = () => {
  const navigate = useNavigate();
  
  // SAFE SELECTORS
  const setResumeData = useStore((state) => state.setResumeData);
  const setAIResult = useStore((state) => state.setAIResult);
  const quizResults = useStore((state) => state.quizResults);
  
  const [hasResume, setHasResume] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const onFileAccepted = (acceptedFile) => {
    setFile(acceptedFile);
    setError('');
  };

  const handleAnalysis = async (uploadedFile = null) => {
    if (!quizResults) {
      setError('Please complete the quiz first.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Initialize as empty string to prevent "undefined" errors on backend
      let resumeTextContent = "";

      // 1. Upload Resume (if provided)
      if (uploadedFile) {
        setLoadingStep('Reading Resume...');
        const formData = new FormData();
        formData.append('resume', uploadedFile);

        const uploadRes = await api.post('/resume/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        if (setResumeData) {
          setResumeData(uploadRes.data.data);
          // SAFETY: Ensure we extract text, defaulting to empty string
          resumeTextContent = uploadRes.data.data?.text || ""; 
        }
      }

      // 2. AI Analysis
      setLoadingStep('Generating Career Analysis (this takes ~15s)...');
      const analysisRes = await api.post('/ai/analyze', {
        quizAnswers: quizResults,
        resumeText: resumeTextContent, // Now guaranteed to be a string
        hasResume: !!uploadedFile
      });

      if (setAIResult) {
        setAIResult(analysisRes.data);
        navigate('/results');
      }

    } catch (err) {
      console.error("Analysis Error:", err);
      let msg = 'Analysis failed.';
      
      if (err.code === 'ECONNABORTED') {
        msg = 'Analysis timed out. The AI is taking too long.';
      } else if (err.response?.data?.message) {
        msg = `Server Error: ${err.response.data.message}`;
      } else if (err.message) {
        msg = `Error: ${err.message}`;
      }
      
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  if (hasResume === null) {
    return (
      <motion.div className="upload-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Do you have a resume?</h1>
        <div className="resume-choice-container">
          <motion.button className="choice-button glass-card" whileHover={{ scale: 1.05 }} onClick={() => setHasResume(true)}>
            <h3>Yes, I have a resume</h3>
          </motion.button>
          <motion.button className="choice-button glass-card" whileHover={{ scale: 1.05 }} onClick={() => setHasResume(false)}>
            <h3>No, not yet</h3>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (hasResume === false) {
    return (
      <motion.div className="upload-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Ready to Analyze?</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="action-buttons">
          <button className="back-button" onClick={() => setHasResume(null)}>Go Back</button>
          <button className="cta-button" onClick={() => handleAnalysis(null)} disabled={loading}>
            {loading ? <><span className="spinner"></span> {loadingStep}</> : 'Start Analysis'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="upload-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>Upload Resume</h1>
      <div className="uploader-wrapper glass-card">
        <FileUploader onFileAccepted={onFileAccepted} />
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="action-buttons">
        <button className="back-button" onClick={() => setHasResume(null)} disabled={loading}>Go Back</button>
        <button className="cta-button" onClick={() => handleAnalysis(file)} disabled={!file || loading}>
          {loading ? <><span className="spinner"></span> {loadingStep}</> : 'Analyze Resume & Quiz'}
        </button>
      </div>
    </motion.div>
  );
};

export default Upload;