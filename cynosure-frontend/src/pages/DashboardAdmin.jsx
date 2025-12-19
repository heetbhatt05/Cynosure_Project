import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './DashboardAdmin.css'; // Make sure to create this file (code provided below)

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [quizResponses, setQuizResponses] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulating API fetch with mock data for the MVP
    const fetchData = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setUsers([
            { id: 'u1', username: 'Heet_Bhatt', email: 'heetbhatt@example.com', role: 'admin', joined: '2023-10-01' },
            { id: 'u2', username: 'Het_frontend', email: 'het@example.com', role: 'user', joined: '2023-10-05' },
            { id: 'u3', username: 'Heet_ui', email: 'heet@example.com', role: 'user', joined: '2023-10-12' }
          ]);
          setQuizResponses([
            { id: 'q1', user: 'Het_frontend', careerMatch: 'Frontend Developer', date: '2023-10-06' },
            { id: 'q2', user: 'Heet_ui', careerMatch: 'UI/UX Designer', date: '2023-10-13' }
          ]);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch admin data.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) return <div className="loading-spinner">Loading dashboard data...</div>;
    if (error) return <div className="error-message">{error}</div>;

    switch (activeTab) {
      case 'users':
        return (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>{user.role}</span>
                    </td>
                    <td>{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'activity':
        return (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Activity ID</th>
                  <th>User</th>
                  <th>Top Career Match</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {quizResponses.map(quiz => (
                  <tr key={quiz.id}>
                    <td>{quiz.id}</td>
                    <td>{quiz.user}</td>
                    <td>{quiz.careerMatch}</td>
                    <td>{quiz.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="admin-dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of user activity and system stats</p>
      </div>

      <div className="tabs-container">
        <button 
          onClick={() => setActiveTab('users')} 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('activity')} 
          className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
        >
          Recent Activity
        </button>
      </div>

      <div className="tab-content glass-card">
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default DashboardAdmin;