import React from 'react'
import starIcon from '../assets/Star_icon.png'
import time from '../assets/opportunity_time.png'
import experience from '../assets/opportunity_bag.png'
import place from '../assets/opportunity_location.png'
import calender from '../assets/calender_card.png'
import './SavedJobsCard.css'

export const SavedJobsCard = ({job}) => {
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
                <p className='Opportunities-detail-line'><img src={time} className='card-icons'/>{job.type}<span className="Opportunities-divider">|</span>{job.salary}</p>
                <p className='Opportunities-detail-line'><img src={experience} className='card-icons'/>{job.experience}</p>
                <p className='Opportunities-detail-line'><img src={place} className='card-icons'/>{job.location}</p>
                <p className='Opportunities-detail-line'><img src={calender} className='card-icons'/>{job.posted}<span className="Opportunities-divider">|</span>Openings: {job.openings}<span className="Opportunities-divider">|</span>Applicants: {job.applicants}</p>
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
                <p className='myjobs-saved-date'>{job.savedDate}</p>

                <div className="Opportunities-job-actions">
                    <button className="myjobs-btn">Saved</button>
                    <button className="myjobs-btn">Apply</button>
                </div>
            </div>
        </div>
    );
};