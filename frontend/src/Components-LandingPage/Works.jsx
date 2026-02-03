import React from 'react'
import './Works.css'
import brief from '../assets/briefcase.png';
import ideas from '../assets/ideas.png';
import profile from '../assets/profile.png';
import { Infocard } from './Infocard';

export const Works = () => {
  return (
    <>
      <section className='works-section'> 
        <h2 className='work-heading'>How It Works ?</h2>
        <div className='infocard-section'>
          <Infocard infoimage={profile} heading={"Create Your Profile"} description={"Build a professional profile showcasing your skills and experience."}/>
          <Infocard infoimage={ideas} heading={"Explore Opportunities"} description={"Browse thousands of jobs tailored to your preferences and apply easily."}/>
          <Infocard infoimage={brief} heading={"Land Your Dream Job"} description={"Connect with top employers and take the next step in your career."}/>
        </div>
      </section>
    </>
  )
}
