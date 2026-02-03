import React from 'react'
import './Choice.css'
import { Infocard } from './Infocard'
import growth from "../assets/growth.png"
import jigsaw from "../assets/jigsaw.png"
import returns from "../assets/returns.png"

export const Choice = () => {
  return (
    <section className='choice-section'>
        <h2 className='choice-heading'>Why to Choose Job portal?</h2>
        <p className='choice-description'>
          We are dedicated to providing a seamless and effective job search experience for professionals and a robust platform for employers.
        </p>
        <div className='choice-cards-section'>
          <Infocard infoimage={growth} heading={"Vast Opportunities"} description={"Access a curated selection of jobs from top-tier companies globally."}/>
          <Infocard infoimage={jigsaw} heading={"Smart Matching"} description={"Our AI-powered system connects you with roles that truly fit your profile."}/>
          <Infocard infoimage={returns} heading={"Career Growth"} description={"Access resources and insights to accelerate your professional development."}/>
        </div>
    </section>
  )
}
