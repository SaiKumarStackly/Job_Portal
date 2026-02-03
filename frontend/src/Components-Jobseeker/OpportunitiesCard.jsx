import React, { useState,useEffect } from 'react'
import './OpportunitiesCard.css'
import time from '../assets/opportunity_time.png'
import experience from '../assets/opportunity_bag.png'
import place from '../assets/opportunity_location.png'
import { Link, useNavigate } from 'react-router-dom'

export function formatPostedDate(dateString) {
    const postedDate = new Date(dateString);
    const today = new Date();

    const diffInMs = today - postedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Posted: today";
    if (diffInDays === 1) return "Posted: 1 day ago";
    if (diffInDays > 1 && diffInDays <= 30) return `Posted: ${diffInDays} days ago`;
    if (diffInDays > 30 && diffInDays <= 60) return `Posted: 1+ month ago`;
    if (diffInDays > 60 && diffInDays <= 90) return `Posted: 2+ months ago`;

    return `Posted: Long ago`;
  }

export default formatPostedDate;
 
export const OpportunitiesCard = (props) => {
    const {job} = props
    const logoContent = job.logo ? (<img src={job.logo} alt={job.company} className="Opportunities-job-logo" />) : (<div className="Opportunities-job-logo-placeholder">{job.company.charAt(0).toUpperCase()}</div>)
    const navigate = useNavigate()
    const HandleClick = () => {
        navigate(`/Job-portal/jobseeker/OpportunityOverview/${job.id}`)
    }
 return (
        <div onClick={() => HandleClick()} className="Opportunities-job-card">
            <div className="Opportunities-job-header">
                <div>
                    <h3 className="Opportunities-job-title">{job.title}</h3>
                    <p className="Opportunities-job-company">{job.company}</p>
                </div>
                {logoContent}
            </div>

            <div className="Opportunities-job-details">
                <p className='Opportunities-detail-line'><img src={time} className='card-icons'/>{job.posted}<span className="Opportunities-divider">|</span> {job.salary} </p>
                <p className='Opportunities-detail-line'><img src={experience} className='card-icons'/>{job.experience}  </p>
                <p className='Opportunities-detail-line'><img src={place} className='card-icons'/>{job.location}</p>
            </div>

            <div className='Opportunities-details-bottom'>
                <div className="Opportunities-job-tags">
                    {job.tags.map((tag, index) => (
                        <span key={index} className={`Opportunities-job-tag ${tag.toLowerCase()}`}>
                        {tag}
                        </span>
                    ))}
                </div>
                <div className="Opportunities-job-type">
                    {job.type}
                </div>
            </div>

            <hr className="Opportunities-separator" />

            <div className="Opportunities-job-footer">
                <div className="Opportunities-job-meta">
                    <p>{formatPostedDate(job.posted)} <span className="Opportunities-divider">|</span> Openings: {job.openings} <span className="Opportunities-divider">|</span> Applicants: {job.applicants}</p>
                </div>

                <div className="Opportunities-job-actions">
                    <button className="Opportunities-save-btn">Save</button>
                    <button className="Opportunities-apply-btn">Apply</button>
                </div>
            </div>
        </div>
    )
}