import React from 'react'
import { JHeader } from '../Components-Jobseeker/JHeader'
import './AboutUs.css'
import WorkLife from "../assets/WorkLifeBet.png"
import forjobseekers from '../assets/jobseeker.png'
import forEmployers from '../assets/ForEmployees.png'
import forEmployees from '../assets/ForEmployers.png'
import { Footer } from './Footer'
import WorkatJP from '../assets/WorkatJP.png'
import News from '../assets/News.png'
import Blogs from '../assets/Blog.png'
import HiringJobs from '../assets/HiringatJobportal.png'
import Success from '../assets/Success.png'
import Research from '../assets/Research.png'

export const AboutUs = () => {
    return (
        <>
            <JHeader />
            <div className='AboutusHeaderContainer'>
                <div>
                    <h1 className='AboutusHeader'>About us / <span className='AboutusHeaderSpan'>Who we are</span></h1>
                </div>
            </div>
            <div>
                <div className='Aboutus-Mainsec'>
                    <div className='Aboutus-Desc-Container'>

                        <h1 className='AboutusHeaderSpan'>Making WorkLife Better</h1>
                        <p>So, what is Job portal? We’re a thriving community for workplace conversations, driven by a simple mission to make worklife better, together.</p>
                        <p><span className='AboutusHeaderSpan'>B</span>ut the way we do it? That’s not so simple. </p><p>Every day, we’re inspired to build a healthier, more transparent work community for all and we’re committed to your trust. Through the products we make and the communities we create, we give people an inside look at companies and careers, so they can find the right job and workplace for them.
                            Together, we’re fostering a world where people have the support and resources they need to make the most of their worklife</p>
                    </div>

                    <div className='Aboutus-Desc-Container'>
                        <img className='Aboutus-Images' src={WorkLife} alt='workLife' />
                    </div>

                </div>
                <div className='Aboutus-Types'>
                    <div>

                        <div className='Aboutus-TypeDesc'>
                            <div className='Aboutus-Mid-Images'><img className='Aboutus-types-Images' src={forjobseekers} alt='jobseekers' /></div>
                            <h4>For JobSeekers</h4>
                            <p>We simplify your search, so you can apply for jobs with confidence. Filter millions of jobs and ratings, talk to professionals, and get smart on salary—then apply with ease.</p>
                        </div>

                    </div>
                    <div>
                        <div className='Aboutus-TypeDesc'>
                            <div className='Aboutus-Mid-Images'><img className='Aboutus-types-Images' src={forEmployees} alt='Employees' /></div>
                            <h4>For Employees</h4>
                            <p>We amplify your voice, so you can enhance your workplace experience. Leave reviews, search and post salaries, and join candid conversations about life at work.</p>
                        </div>
                    </div>
                    <div>
                        <div className='Aboutus-TypeDesc'>
                            <div className='Aboutus-Mid-Images'><img className='Aboutus-types-Images' src={forEmployers} alt='Employees' /></div>
                            <h4>For Employers</h4>
                            <p>We give you a place to shape and share your story, so you can find and keep the best talent. Post jobs, respond to reviews, and gain insights to shape your messaging</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='Aboutus-Midsec'>
                <div className='Aboutus-Midsec-Desc-Container'>
                    <img className='Aboutus-Midsec-Images' src={WorkatJP} alt='workLife' />
                </div>
                <div className='Aboutus-Midsec-Desc-Container'>
                    <div className='Aboutus-midseccontent' >
                        <h1 className='AboutusHeaderSpan'>Work at JobPortal</h1>
                        <p >We’re always looking for good people. Innovative people. Folks with grit who embrace transparency, and believe a job should love you back.
                            If you want to get in on a 100% remote company that’s transforming the workplace and redefining what community can do, we should talk!</p>
                    </div>
                </div>
            </div>
            <div className='Aboutus-Types'>
                <div>

                    <div className='Aboutus-TypeDesc'>
                        <div className='Aboutus-Mid-Images'><img className='Aboutus-types-Images' src={News} alt='jobseekers' /></div>
                        <h4>NewsRoom</h4>
                        <p>Check out our latest press releases and media appearances, or search our archive.</p>
                    </div>

                </div>
                <div>
                    <div className='Aboutus-TypeDesc'>
                        <div className='Aboutus-Mid-Images'><img className='Aboutus-types-Images' src={Blogs} alt='Employees' /></div>
                        <h4>Blogs</h4>
                        <p>We amplify your voice, so you can enhance your workplace experience. Leave reviews, search and post salaries, and join candid conversations about life at work.</p>
                    </div>
                </div>
                <div>
                    <div className='Aboutus-TypeDesc'>
                        <div className='Aboutus-Mid-Images'><img className='Aboutus-types-Images' src={Research} alt='Employees' /></div>
                        <h4>Our Research</h4>
                        <p>We give you a place to shape and share your story, so you can find and keep the best talent. Post jobs, respond to reviews, and gain insights to shape your messaging</p>
                    </div>
                </div>
            </div>
            <div className='Aboutus-Mainsec'>
                <div className='Aboutus-Desc-Container'>

                    <h1 className='AboutusHeaderSpan'>Hiring at Job portal</h1>
                    <p>Hiring on a job portal website is a strategic, technology-driven process of identifying, evaluating, and securing top-tier talent to fill vacant positions. Unlike broad recruitment—which focuses on attracting a large talent pool—hiring on modern platforms is a "selective and reactive" phase where hiring managers make definitive decisions about specific individuals from a pre-vetted list.</p>
                </div>

                <div className='Aboutus-Desc-Container'>
                    <img className='Aboutus-Images' src={HiringJobs} alt='workLife' />
                </div>

            </div>
            <div className='Aboutus-final-part'>
                <div className='Aboutus-final-Desc-Container'>

                    <h1 className='AboutusHeaderSpan'>Hiring at Job portal</h1>
                    <p>Success in a job portal is defined as maintaining an optimized, results-oriented profile that consistently translates search visibility into interview invitations. This is achieved by crafting a concise professional summary—typically two to four sentences—that combines a strong job title, years of relevant experience, and measurable achievements, such as “increased efficiency by 20%” or “boosted sales by 15%”. A successful profile also strategically incorporates industry-specific keywords from job descriptions to pass through Applicant Tracking Systems (ATS), while highlighting both technical expertise and essential soft skills like leadership and problem-solving to appeal to human recruiters. Ultimately, a “successful” portal presence serves as a high-impact digital handshake that clearly communicates your unique value proposition and alignment with an employer’s goals, resulting in an interview conversion rate significantly higher than the industry average.</p>
                </div>

                <div className='Aboutus-Success-Desc-Container'>
                    <img className='Aboutus-Success-Images' src={Success} alt='workLife' />
                </div>
            </div>

            <Footer />
        </>
    )
}
