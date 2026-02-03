import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (itemName) => {
    setActiveItem(itemName);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
    <header className="header">
      <div className="logo-container">
        <div className="logo">job portal</div>
        
        <div className="hamburger" onClick={toggleMenu}>
          {isMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </div>
      </div>

      <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <a href="#" className={activeItem === "Home" ? "nav-item nav-active" : "nav-item"} onClick={() => handleNavClick("Home")}>Home</a>
        <a href="#" className={activeItem === "Jobs" ? "nav-item nav-active" : "nav-item"} onClick={() => handleNavClick("Jobs")}>Jobs</a>
        <a href="#" className={activeItem === "Companies" ? "nav-item nav-active" : "nav-item"} onClick={() => handleNavClick("Companies")}>Companies</a>
      </nav>

      <div className={`auth-links ${isMenuOpen ? 'open' : ''}`}>
        {/* specific classes kept for desktop styling */}
        <Link to="/Job-portal/jobseeker/login" className="login-btn" onClick={() => setIsMenuOpen(false)}>Login</Link>
        <Link to="/Job-portal/jobseeker/signup" className="signup-btn" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
        <div className="separator"></div>
        <Link to="/Job-portal/employer/login" className="emp-log-link" onClick={() => setIsMenuOpen(false)}>For Employers</Link>
      </div>
    </header>
    </>
  )
}