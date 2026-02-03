import React from 'react'
import "./Footer.css";
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-top">
        <div className="footer-link-section">
          <h2 className="footer-logo">job portal</h2>
          <p className="tagline">Where Ambition Meets<br />Opportunity</p>
          <div>
            <i className="fab fa-linkedin-in social-icon"></i>
            <i className="fab fa-facebook-f social-icon"></i>
            <i className="fab fa-x-twitter social-icon"></i>
            <i className="fab fa-instagram social-icon"></i>
          </div>
        </div>

        <div className="footer-link-section">
          <h3>Quick Links</h3>
          <ul>
            <Link to={'/Job-portal/aboutus'}><li>About Us</li></Link>
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Blog</li>
          </ul>
        </div>

        <div className="footer-link-section">
          <h3>Job Seekers</h3>
          <ul>
            <li>Create Profile</li>
            <li>Browse Jobs</li>
            <li>Saved Jobs</li>
            <li>Application Status</li>
          </ul>
        </div>

        <div className="footer-link-section">
          <h3>Employers</h3>
          <ul>
            <li>Post a Job</li>
            <li>Find Talent</li>
            <li>Employer Dashboard</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&#169; 2025 JobPortal. All rights reserved.</p>
      </div>
    </footer>
  )
}
