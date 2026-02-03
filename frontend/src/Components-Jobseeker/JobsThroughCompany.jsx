
import React, { useState, useEffect } from "react";
import "./JobsThroughCompany.css";
import { useNavigate, useParams } from "react-router-dom";
import OpportunitiesCard from "./OpportunitiesCard";
import { Footer } from "../Components-LandingPage/Footer";
import starIcon from "../assets/Star_icon.png";
import { JHeader } from "./JHeader";
import axios from "axios";

export const JobsThroughCompany = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayCount = 10;

  useEffect(() => {
    if (!companyId) {
      setError("Company ID missing");
      setLoading(false);
      return;
    }
    fetchCompanyAndJobs();
  }, [companyId]);

  // ✅ SINGLE CORRECT API CALL
  const fetchCompanyAndJobs = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/Jcompanies/jobsbycompany/${companyId}/`
      );

      // backend response safe handling
      setCompany(res.data.company || res.data);
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError("Failed to load company or jobs");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- PAGINATION ---------- */

  const totalPages = Math.ceil(jobs.length / displayCount);
  const indexOfLastJob = currentPage * displayCount;
  const indexOfFirstJob = indexOfLastJob - displayCount;
  const currentJobCards = jobs.slice(
    indexOfFirstJob,
    indexOfLastJob
  );

  const HandlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const HandleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  /* ---------- STATES ---------- */

  if (loading) {
    return (
      <>
        <JHeader />
        <p style={{ textAlign: "center", padding: 40 }}>
          Loading...
        </p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <JHeader />
        <p style={{ color: "red", textAlign: "center" }}>
          {error}
        </p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </>
    );
  }

  if (!company) {
    return (
      <>
        <JHeader />
        <p style={{ textAlign: "center" }}>
          Company not found
        </p>
      </>
    );
  }

  /* ---------- UI ---------- */

  return (
    <>
      <JHeader />

      <div className="job-search-companies">
        <section className="Opportunities-section">
          <div className="company-header-container">
            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              Back
            </button>

            <div className="company-main-section">
              <div className="company-logo-container">
                {company.logo && (
                  <img
                    className="company-logo"
                    src={company.logo}
                    alt="logo"
                  />
                )}
              </div>

              <div className="company-info-card">
                <h2>{company.name}</h2>
                <div className="company-title-container">
                  <span className="star">
                    <img src={starIcon} alt="rating" />{" "}
                    {company.rating || 0}
                  </span>
                  <span className="company-divider">|</span>
                  <span>{company.reviews || 0} reviews</span>
                </div>
              </div>

              <p className="company-moto">
                {company.desc || ""}
              </p>
            </div>
          </div>

          {/* JOB LIST */}
          <div className="Opportunities-job-list">
            {currentJobCards.length === 0 ? (
              <p>No jobs available</p>
            ) : (
              currentJobCards.map((job, index) => (
                <OpportunitiesCard
                  key={job.id || index}
                  job={job}
                />
              ))
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="Navigation-job-Tab">
              <button
                onClick={HandlePrev}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={HandleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
};

