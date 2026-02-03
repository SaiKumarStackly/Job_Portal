import React, { useEffect, useState } from "react";
import starIcon from '../assets/Star_icon.png'
import time from '../assets/opportunity_time.png'
import experience from '../assets/opportunity_bag.png'
import place from '../assets/opportunity_location.png'
import calender from '../assets/calender_card.png'
import './AppliedJobCard.css'
import axios from "axios";

export const AppliedJobCard = ({job}) => {
  return (
    <div className="myjobs-job-card">
      <div className="myjobs-card-header">
        <div>
          <h2 className="myjobs-job-title">{job.title}</h2>
        </div>
        <span className="menu-dots">⋮</span>
      </div>
      <div className="myjobs-company-sub">
        <p className="myjobs-company-name">{job.company}<span className="Opportunities-divider">|</span><span className="star"><img src={starIcon} /></span> {job.rating}<span className="Opportunities-divider">|</span><span>{job.reviews}</span></p>
      </div>

      <div className="Opportunities-job-details">
        <p className='Opportunities-detail-line'><img src={time} className='card-icons' />{job.type}<span className="Opportunities-divider">|</span>{job.salary}</p>
        <p className='Opportunities-detail-line'><img src={experience} className='card-icons' />{job.experience}</p>
        <p className='Opportunities-detail-line'><img src={place} className='card-icons' />{job.location}</p>
        <p className='Opportunities-detail-line'><img src={calender} className='card-icons' />{job.posted}<span className="Opportunities-divider">|</span>Openings: {job.openings}<span className="Opportunities-divider">|</span>Applicants: {job.applicants}</p>
      </div>

      <div className="Opportunities-job-tags">
        {job.tags.map((tag, index) => (
          <span key={index} className={`Opportunities-job-tag ${tag.toLowerCase()}`}>
            {tag}
          </span>
        ))}
      </div>

      <hr className="Opportunities-separator" />

      <div className="Opportunities-job-footer">
        <div className='applied-app-status-container'>
          <p className='myjobs-saved-date'>{job.appliedDate}</p>
          <span className="Opportunities-divider">|</span>
          <span className={`applied-application-status status-${job.status_type}`}>{job.status_text}</span>
        </div>

        <div className="Opportunities-job-actions">
          <button className="applied-dis-btn" disabled>Applied</button>
        </div>
      </div>
    </div>
  );
}
