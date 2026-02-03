import React, { useState, useEffect } from "react";
import "./CompaniesTab.css";
import { useNavigate } from "react-router-dom";
import { Footer } from "../Components-LandingPage/Footer";
import starIcon from "../assets/Star_icon.png";
import { JHeader } from "./JHeader";
import { SearchBar } from "./SearchBar";
import axios from "axios";
import { OpportunitiesCard } from "./OpportunitiesCard";

export const CompaniesTab = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalJobs, setModalJobs] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/Jcompanies/companies/")
      .then((res) => {
        console.log("Companies data:", res.data);
        // Handle both array and object responses
        if (Array.isArray(res.data)) {
          setCompanies(res.data);
        } else if (res.data && typeof res.data === 'object') {
          // Try to convert object to array
          const companiesArray = Object.values(res.data);
          setCompanies(companiesArray);
        } else {
          setCompanies([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
        setCompanies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInitialSearch = () => {
    navigate("/Job-portal/jobseeker/searchresults", {
      state: {
        query,
        location,
        experience,
      },
    });
  };

  const openJobModal = async (company) => {
    console.log("Opening modal for company:", company);
    setSelectedCompany(company);
    setModalLoading(true);
    
    // Get company identifier
    const targetId = company.companyId || company.id || company.name;
    
    if (!targetId) {
      console.error("No company identifier found");
      setModalJobs([]);
      setModalLoading(false);
      return;
    }
    
    try {
      console.log("Fetching jobs for company ID:", targetId);
      
      // FIXED: Using the correct endpoint from your backend
      // Try multiple endpoints to find the right one
      const endpoints = [
        `http://127.0.0.1:8000/api/Jcompanies/jobsbycompany/${targetId}/`,
        `http://127.0.0.1:8000/api/companies/jobsbycompany/${targetId}/`,
        `http://127.0.0.1:8000/api/Jcompanies/opportunitiescard/`,
      ];
      
      let jobsData = [];
      
      for (const endpoint of endpoints) {
        try {
          console.log("Trying endpoint:", endpoint);
          const res = await axios.get(endpoint);
          console.log("Response from", endpoint, ":", res.data);
          
          let data = res.data;
          
          // Handle different response formats
          if (Array.isArray(data)) {
            // If it's an array of jobs
            jobsData = data;
          } else if (data && data.jobs && Array.isArray(data.jobs)) {
            // If response has a jobs array
            jobsData = data.jobs;
          } else if (data && typeof data === 'object') {
            // Try to extract jobs from object
            const values = Object.values(data);
            jobsData = values.filter(item => item && typeof item === 'object');
          }
          
          // Filter jobs by company if needed (for general job endpoints)
          if (endpoint.includes('opportunitiescard') && company.companyName) {
            jobsData = jobsData.filter(job => 
              job.company && job.company.toLowerCase().includes(company.companyName.toLowerCase())
            );
          }
          
          if (jobsData.length > 0) {
            console.log(`Found ${jobsData.length} jobs from ${endpoint}`);
            break;
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
        }
      }
      
      console.log("Final jobs data:", jobsData);
      setModalJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setModalJobs([]);
    } finally {
      setModalLoading(false);
    }
  };

  const closeJobModal = () => {
    setSelectedCompany(null);
    setModalJobs([]);
  };

  return (
    <>
      <JHeader />

      <div className="jobs-tab-search-bar">
        <SearchBar
          searchQuery={query}
          setSearchQuery={setQuery}
          searchLocation={location}
          setSearchLocation={setLocation}
          searchExp={experience}
          setSearchExp={setExperience}
          onSearch={handleInitialSearch}
        />
      </div>

      <div className="companies-tab-container">
        <h2 className="carousel-title">Companies for you</h2>

        {loading && <p className="loading-text">Loading companies...</p>}

        <div className="companies-tab-grid">
          {companies.map((company, index) => (
            <div
              key={company.companyId || company.id || index}
              className="companies-tab-card"
            >
              <div className="companies-tab-logo-container">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={`${company.companyName || "Company"} logo`}
                    className="companies-tab-logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-company-logo.png';
                    }}
                  />
                ) : (
                  <div className="default-logo-placeholder">
                    {company.companyName?.charAt(0) || "C"}
                  </div>
                )}
              </div>

              <h3 className="companies-tab-name">
                {company.companyName || company.name || "Company Name"}
              </h3>

              <div className="companies-tab-rating-reviews">
                <span className="star companies-tab-rating-star">
                  <img src={starIcon} alt="rating" />
                </span>
                <span className="companies-tab-rating">
                  {company.ratings || "0"}
                </span>
                <span className="companies-tab-separator">|</span>
                <span className="companies-tab-reviews">
                  {company.reviewNo || 0} reviews
                </span>
              </div>

              <p className="companies-tab-desc">
                {company.slogan || ""}
              </p>

              <button
                className="companies-tab-view-jobs-btn"
                onClick={() => openJobModal(company)}
              >
                View Jobs
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL - This shows when "View Jobs" is clicked */}
      {selectedCompany && (
        <div className="companies-tab-modal-overlay" onClick={closeJobModal}>
          <div
            className="companies-tab-modal-content-large"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <button className="modal-back-btn" onClick={closeJobModal}>
                ← Back
              </button>
              
              <div className="modal-company-info">
                {selectedCompany.logo && (
                  <img 
                    src={selectedCompany.logo} 
                    alt={selectedCompany.companyName} 
                    className="modal-company-logo"
                  />
                )}
                <div>
                  <h2 className="modal-company-name">{selectedCompany.companyName}</h2>
                  <div className="modal-company-rating">
                    <img src={starIcon} alt="star" />
                    <span>{selectedCompany.ratings || "0"}</span>
                    <span className="separator">|</span>
                    <span>{selectedCompany.reviewNo || 0} reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Section */}
            <div className="modal-jobs-section">
              <div className="modal-jobs-header">
                <h3>Jobs at {selectedCompany.companyName}</h3>
                <span className="job-count">{modalJobs.length} jobs available</span>
              </div>

              {modalLoading ? (
                <div className="modal-loading">
                  <p>Loading jobs...</p>
                </div>
              ) : modalJobs.length === 0 ? (
                <div className="no-jobs-message">
                  <p>No jobs available for this company.</p>
                </div>
              ) : (
                <div className="modal-jobs-list">
                  {modalJobs.map((job, index) => (
                    <div key={job.id || index} className="modal-job-item">
                      <OpportunitiesCard job={job} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};