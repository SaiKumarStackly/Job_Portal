import React from 'react'
import './Joblisting.css'

export const JoblistingCard = (props) => {
  return (
    <div className="joblisting-card">
        <h3 className="joblisting-card-title">{props.job.title}</h3>
        <p className="joblisting-card-company">{props.job.company} • {props.job.location}</p>
        <p className="joblisting-card-type">{props.job.type}</p>
        <div className="joblisting-card-tags">
        {props.job.tags.map(tag => (
            <span key={tag} className="joblisting-card-tag">{tag}</span>
        ))}
        </div>
        <button className="view-joblisting-button">View details</button>
    </div>
  )
}
