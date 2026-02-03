import React from 'react';
import time from '../assets/opportunity_time.png'
import experience from '../assets/opportunity_bag.png'
import place from '../assets/opportunity_location.png'
import { formatPostedDate } from './OpportunitiesCard';
import "./SearchResultsCard.css"
import { useNavigate } from 'react-router-dom';
import starIcon from '../assets/Star_icon.png'

export function SearchResultsCard(props) {
    const { job } = props;
    const navigate = useNavigate();

    const logoContent = job.logo ? (<img src={job.logo} alt={job.company} className="SearchResults-job-card-job-logo" />) : (<div className="SearchResults-job-card-logo-placeholder">{job.company.charAt(0).toUpperCase()}</div>)
    const HandleClick = () => {
        navigate(`/Job-portal/jobseeker/OpportunityOverview/${job.id}`)
    }
    return (
        <div className="SearchResults-job-card">
            <div onClick={HandleClick} className="SearchResults-job-card-header">
                <div>
                    <h3 className="SearchResults-job-card-title">{job.title}</h3>
                    <p className="SearchResults-job-card-company"><span className="star"><img src={starIcon} /> </span>{job.ratings}</p>
                </div>
                {logoContent}
            </div>

            <div className="SearchResults-job-card-details">
                <p className='SearchResults-job-card-detail-line'><img src={time} className='SearchResults-job-card-icons' />{job.work_type}
                    <span className="SearchResults-job-card-divider">|</span>{job.salary} 
                    <span className="SearchResults-job-card-divider">|</span><img src={experience} className='SearchResults-job-card-icons' /> {job.experience}  
                    <span className="SearchResults-job-card-divider">|</span><img src={place} className='SearchResults-job-card-icons' />{job.location}</p>
                <p className='SearchResults-job-card-detail-line'><img src={time} className='SearchResults-job-card-icons' />shift : {job.shift}
                    <span className="SearchResults-job-card-divider">|</span><img src={experience} className='SearchResults-job-card-icons' /> {job.type}
                </p>
            </div>

            <hr className="SearchResults-job-card-separator" />

            <div className="SearchResults-job-card-job-footer">
                <div className="SearchResults-job-card-job-meta">
                    <p>{formatPostedDate(job.posted)} <span className="SearchResults-job-card-divider">|</span> Openings: {job.openings}    <span className="SearchResults-job-card-divider">|</span> Applicants: {job.applicants}</p>
                </div>

                <div className="SearchResults-job-card-actions">
                    <button className="SearchResults-job-card-save-btn">Save</button>
                    <button className="SearchResults-job-card-apply-btn">Apply</button>
                </div>
            </div>
        </div>

    )
}