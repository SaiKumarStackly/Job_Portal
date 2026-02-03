import { useState, useEffect } from 'react';
import axios from 'axios';
import './Joblisting.css';
import { JoblistingCard } from './JoblistingCard';

export const Joblisting = () => {
  const [joblisting, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/jobs/')
      .then(response => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <section className='job-listings-container'>
      <h2 className="job-listings-heading">Latest Job Listings</h2>

      <div className='jobs-container-wrapper'>
        {joblisting.map((job) => (
          <JoblistingCard job={job} key={job.id} />
        ))}
      </div>

      <button className='view-all-button'>View All Jobs</button>
    </section>
  );
};
