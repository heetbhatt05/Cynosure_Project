import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {currentYear} Cynosure. All rights reserved.</p>
      <p>Your AI-Powered Career Co-Pilot</p>
    </footer>
  );
};

export default Footer;