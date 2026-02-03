import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyJobs.css";
import { Link } from "react-router-dom";
import breifcase from '../assets/header_case.png';
import chat from '../assets/header_message.png';
import bell from '../assets/header_bell.png';
import profile from '../assets/header_profile.png';
import {Footer} from "../Components-LandingPage/Footer";
import {SavedJobsCard }from "./SavedJobsCard";
import {AppliedJobCard} from "./AppliedJobCard";
import { JHeader } from "./JHeader";

const API_BASE = "http://127.0.0.1:8000/api/Jcompanies";

export const MyJobs = () => {
  const [activeTab, setActiveTab] = useState("saved");
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {

        const [savedRes, appliedRes] = await Promise.all([
          axios.get(`${API_BASE}/savedjobscard/`, { JHeader }),
          axios.get(`${API_BASE}/appliedjobscard/`, { JHeader }),
        ]);

        setSavedJobs(Array.isArray(savedRes.data) ? savedRes.data : []);
        setAppliedJobs(Array.isArray(appliedRes.data) ? appliedRes.data : []);
      } catch (error) {
        console.error(
          "❌ Error fetching jobs:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

    if (loading) {
        return <p>Loading jobs...</p>;
    }


    return (
        <>
         
            <JHeader />


            <main>
                <div className='myjobs-main-info'>
                    <h1>"My Jobs"</h1>
                    <p>View and manage the jobs you've saved, applied for, or shortlisted—all in one place.</p>
                </div>

                <div>
                    <div className="toggle-myjobs-main">
                        <button
                            className={`myjobs-select ${activeTab === "saved" ? "active" : ""}`}
                            onClick={() => setActiveTab("saved")}
                        >
                            Saved
                        </button>
                        <button
                            className={`myjobs-select ${activeTab === "applied" ? "active" : ""}`}
                            onClick={() => setActiveTab("applied")}
                        >
                            Applied
                        </button>
                    </div>

                    {activeTab === "saved" ? (
                        <div className="my-jobs-common-container">
                            {savedJobs.length > 0 ? (
                                savedJobs.map((job) => (
                                    <SavedJobsCard key={job.id} job={job} />
                                ))
                            ) : (
                                <div className='toggle-no-my-jobs'>
                                    <h2>No jobs saved yet</h2>
                                    <p>Jobs you save appear here</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="my-jobs-common-container">
                            {appliedJobs.length > 0 ? (
                                appliedJobs.map((job) => (
                                    <AppliedJobCard key={job.id} job={job} />
                                ))
                            ) : (
                                <div className='toggle-no-my-jobs'>
                                    <h2>No jobs applied yet</h2>
                                    <p>Jobs you apply appear here</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
};

 