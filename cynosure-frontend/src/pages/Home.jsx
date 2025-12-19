import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore.js';
import { motion } from 'framer-motion';
import api from '../utils/api.js';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { login } = useStore();

  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLoginView ? '/auth/login' : '/auth/register';
    const payload = isLoginView
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const { data } = await api.post(endpoint, payload);
      login(data.token, data);
      navigate('/quiz');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Discover Your Perfect Career Path with Cynosure</h1>
        <p>
          AI-powered career analysis tailored for students. Take our quiz and get personalized recommendations.
        </p>
      </motion.div>

      <motion.div
        className="auth-form-container glass-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2>{isLoginView ? 'Welcome Back' : 'Create Your Account'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="cta-button submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              isLoginView ? 'Log In' : 'Register'
            )}
          </button>
        </form>
        <div className="auth-toggle">
          <p>{isLoginView ? "Don't have an account?" : 'Already have an account?'}</p>
          <button
            type="button"
            className="toggle-button"
            onClick={() => setIsLoginView(!isLoginView)}
          >
            {isLoginView ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;