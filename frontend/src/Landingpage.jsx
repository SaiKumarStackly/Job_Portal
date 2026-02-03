import React from 'react'
import { Header } from './Components-LandingPage/Header'
import { MainSection } from './Components-LandingPage/MainSection'
import { Works } from './Components-LandingPage/Works'
import { Joblisting } from './Components-LandingPage/Joblisting'
import { Topcompanies } from './Components-LandingPage/Topcompanies'
import { Choice } from './Components-LandingPage/Choice'
import { Newsletter } from './Components-LandingPage/Newsletter'
import { Footer } from './Components-LandingPage/Footer'

export const Landingpage = () => {
  return (
    <>
    <Header />
      <MainSection />
      <Works />
      <Joblisting />
      <Topcompanies />
      <Choice />
      <Newsletter />
    <Footer />
    </>
  )
}
