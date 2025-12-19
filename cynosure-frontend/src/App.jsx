import React from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AllRoutes from './routes/Routes.jsx';
import './styles/responsive.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <AllRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;