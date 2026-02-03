import React, { useState } from 'react'
import './Afterloginlanding.css'
import { Link } from 'react-router-dom';
import { JHeader } from './JHeader';
import { JMainsection } from './JMainsection';
import { Jobsbycompany } from './Jobsbycompany';
import { Opportunities } from './Opportunities';
import { Footer } from '../Components-LandingPage/Footer';
import { useNavigate } from "react-router-dom";

export const Afterloginlanding = () => {
    const navigate = useNavigate();

    return (
        <>
            <JHeader />
            <JMainsection />
            <section className='Opportunities-section'>
                <h2 className='Opportunities-title'>Opportunities Just For You</h2>
                <Opportunities />
                <button onClick={() => navigate('/Job-portal/jobseeker/jobs')} className="Opportunities-view-more-btn">View More</button>
            </section>
            <Jobsbycompany />
            <Footer />
        </>
    )
}