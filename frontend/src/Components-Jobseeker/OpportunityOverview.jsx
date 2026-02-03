import React, { useState, useEffect } from 'react'
import { JHeader } from './JHeader';
import { Footer } from '../Components-LandingPage/Footer';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './OpportunityOverview.css'
import search from '../assets/icon_search.png'
import location from '../assets/icon_location.png'
import tick from '../assets/icon_tick.png'
import starIcon from '../assets/Star_icon.png'
import time from '../assets/opportunity_time.png'
import experience from '../assets/opportunity_bag.png'
import place from '../assets/opportunity_location.png'
import twitter from '../assets/socials-x.png'
import linkedin from '../assets/socials-linkedin.png'
import facebook from '../assets/socials-facebook.png'
import formatPostedDate from './OpportunitiesCard';
import axios from 'axios';

export const OpportunityOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [limitedSimilarJob, setLimitedSimilarJob] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // ✅ Fetch main job
        const jobRes = await axios.get(
          `http://127.0.0.1:8000/api/opportunityoverview/${id}/`
        );
        setJob(jobRes.data);

        // ✅ Fetch similar jobs
        try {
          const similarRes = await axios.get(
            `http://127.0.0.1:8000/api/opportunityoverview/${id}/similar/`
          );
          setLimitedSimilarJob(similarRes.data.slice(0, 3));
        } catch (err) {
          console.warn("No similar jobs found:", err);
          setLimitedSimilarJob([]);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load job details");
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  // ✅ Safety checks
  if (loading) return (
    <>
      <JHeader />
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>Loading...</h2>
      </div>
    </>
  );

  if (error) return (
    <>
      <JHeader />
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "red" }}>{error}</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </>
  );

  if (!job) return null;

  return (
    <>
      <JHeader />

      <div className='opp-overview-content'>
        <div className='search-backbtn-container'>
          <button className="back-btn" onClick={() => navigate(-1)}>Back</button>

          <div className="search-bar">
            <div className="search-field">
              <span><img src={search} className="icon-size" alt="search_icon" /></span>
              <input type="text" placeholder="Search by Skills, company or job title" />
            </div>
            <div className="separator"></div>

            <div className="search-field">
              <span><img src={location} className="icon-size" alt="location_icon" /></span>
              <input type="text" placeholder="Enter Location" />
            </div>
            <div className="separator"></div>

            <div className="search-field">
              <span><img src={tick} className="icon-size" alt="search_tick" /></span>
              <select defaultValue="" required>
                <option value="" disabled hidden>Enter Experience</option>
                <option value="fresher">Fresher</option>
                <option value="1-3">1-3 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </div>

            <button className="search-button">Search</button>
          </div>
        </div>

        <div className='opp-overview-main'>
          <div className="opp-job-main">
            {/* Job Header */}
            <div className="opp-overview-job-card">
              <div className="Opportunities-job-header">
                <div>
                  <h2 className="opp-topcard-job-title">{job.title}</h2>
                  <h5 className="Opportunities-job-company">
                    {job.company}
                    <span className="Opportunities-divider">|</span>
                    <span className="star"><img src={starIcon} alt="star" /></span>
                    {job.rating || 0}
                    <span className="Opportunities-divider">|</span>
                    <span className="opp-reviews">{job.review_no || 0} Reviews</span>
                  </h5>
                </div>
                {job.logo ? (
                  <img src={job.logo} alt={job.company} className="Opportunities-job-logo" />
                ) : (
                  <div className="Opportunities-job-logo-placeholder">
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="Opportunities-job-details">
                <p className='Opportunities-detail-line'>
                  <img src={time} className='card-icons' alt="time" />
                  {job.duration}
                  <span className="Opportunities-divider">|</span>
                  {job.salary}
                </p>
                <p className='Opportunities-detail-line'>
                  <img src={experience} className='card-icons' alt="experience" />
                  {job.experience}
                </p>
                <p className='Opportunities-detail-line'>
                  <img src={place} className='card-icons' alt="location" />
                  {job.location}
                </p>
              </div>

              <div className='Opportunities-details-bottom'>
                <div className="Opportunities-job-tags">
                  {Array.isArray(job.tags) &&
                    job.tags.map((tag, index) => (
                      <span key={index} className="Opportunities-job-tag">
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="Opportunities-job-type">
                  {job.work_type}
                </div>
              </div>

              <hr className="Opportunities-separator" />

              <div className="Opportunities-job-footer">
                <div className="Opportunities-job-meta">
                  <p>
                    {formatPostedDate(job.posted)}
                    <span className="Opportunities-divider">|</span>
                    Openings: {job.openings}
                    <span className="Opportunities-divider">|</span>
                    Applicants: {job.applicants}
                  </p>
                </div>

                <div className="Opportunities-job-actions">
                  <button className="Opportunities-save-btn">Save</button>
                  <button className="Opportunities-apply-btn">Apply</button>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="opp-job-details-card">
              {/* Job Highlights */}
              <div className="opp-job-highlights">
                <h3>Job Highlights</h3>
                <ul>
                  {Array.isArray(job.job_highlights) &&
                    job.job_highlights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                </ul>
              </div>

              <h3>Company Overview</h3>
              <p>{job.company_overview}</p>

              <h3>Job Description</h3>
              <p>{job.job_description}</p>

              <h3>Responsibilities</h3>
              <ul>
                {Array.isArray(job.responsibilities) &&
                  job.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>

              <h3>Key Details:</h3>
              <p><strong>Role:</strong> {job.title}</p>
              <p><strong>Industry Type:</strong> {Array.isArray(job.industry_type) ? job.industry_type.join(", ") : job.industry_type}</p>
              <p><strong>Department:</strong> {Array.isArray(job.department) ? job.department.join(", ") : job.department}</p>
              <p><strong>Job Type:</strong> {job.work_type}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Shift:</strong> {job.shift}</p>

              <h3>Key Skills</h3>
              <div className="opp-key-skills-container">
                {Array.isArray(job.key_skills) &&
                  job.key_skills.map((item, i) => (
                    <span key={i}>{item}</span>
                  ))}
              </div>

              <hr className="Opportunities-separator" />

              <div className="opp-share-job">
                <div>
                  <p>Share This job</p>
                  <div className='opp-socials'>
                    <div><img src={linkedin} className='opp-socials-icon' alt="linkedin" /></div>
                    <div><img src={facebook} className='opp-socials-icon' alt="facebook" /></div>
                    <div><img src={twitter} className='opp-socials-icon' alt="twitter" /></div>
                  </div>
                </div>
                <button className="opp-report-btn">Report this job</button>
              </div>
            </div>
          </div>

          {/* Similar Jobs Sidebar */}
          <div className="opp-job-sidebar">
            <h3>Similar Jobs</h3>
            {limitedSimilarJob.length > 0 ? (
              limitedSimilarJob.map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => navigate(`/Job-portal/jobseeker/OpportunityOverview/${sim.id}`)}
                  className="opp-similar-job"
                >
                  <div className="Opportunities-job-header">
                    <div>
                      <h2 className="similar-job-title">{sim.title}</h2>
                      <p className="similar-job-company">
                        {sim.company}
                        <span className="Opportunities-divider">|</span>
                        <span className="star"><img src={starIcon} alt="star" /></span>
                        {sim.rating || 0}
                        <span className="Opportunities-divider">|</span>
                        <span>{sim.review_no || 0} reviews</span>
                      </p>
                    </div>
                    {sim.logo ? (
                      <img src={sim.logo} alt={sim.company} className="Opportunities-job-logo" />
                    ) : (
                      <div className="Opportunities-job-logo-placeholder">
                        {sim.company.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="Opportunities-job-details">
                    <p className='Opportunities-detail-line'>
                      {Array.isArray(sim.tags) ? sim.tags.join(", ") : sim.tags}
                      {" "}- {sim.experience} years of experience
                    </p>
                    <p className='Opportunities-detail-line'>
                      <img src={place} className='card-icons' alt="location" />
                      {sim.location}
                    </p>
                  </div>
                  <div className="similar-job-footer">
                    <div className="Opportunities-job-type">
                      {sim.work_type}
                    </div>
                    <p className='similar-job-footer-posted'>
                      {formatPostedDate(sim.posted)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <p>Currently no similar jobs available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}