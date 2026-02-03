import React, { useState ,useEffect} from 'react'
import './Opportunities.css'
import  {OpportunitiesCard}  from "./OpportunitiesCard";
import Apple from '../assets/Apple-Logo.png'
import Wipro from '../assets/WIT.png'
import CTS from '../assets/CTSH_BIG.png'
import Amazon from '../assets/AMZN_BIG.png'
import Google from '../assets/GOOG.png'
import Infy from '../assets/INFY_BIG.png'
import Tcs from '../assets/TCS.png'
import META from '../assets/META_BIG.png'
import { useNavigate } from "react-router-dom";
import { JobList } from '../JobList';
import axios from 'axios';


export const Opportunities = () => {
  const [jobs, setJobs] = useState([]);
 
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/Jcompanies/opportunitiescard/")
      .then(res => {
        setJobs(res.data);
      })
      .catch(err => {
        console.error("Error fetching opportunities:", err);
      });
  }, []);
  return ( 
     

      <div className="Opportunities-job-list">
        {jobs.map((job, index) => (
          <OpportunitiesCard key={index} job={job} />
        ))}
        
      </div>
  )
}
