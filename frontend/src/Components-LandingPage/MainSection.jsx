import React from 'react'
import './MainSection.css'
import search from '../assets/icon_search.png'
import location from '../assets/icon_location.png'
import tick from '../assets/icon_tick.png'

export const MainSection = () => {
  return (
    <>
    <main className="main-section">
      <h1 className="headline">"Your Dream Job Is Just A Click Away"</h1>
      <p className="subheading">Explore 5 Lakh+ Openings Now</p>

      <div className="search-bar">
        <div className="search-field">
          <span><img src={search} className="icon-size" alt="search_icon"/></span>
          <input type="text" placeholder="Search by Skills, company or job title" />
        </div>
        <div className="separator"></div>

        <div className="search-field">
          <span><img src={location} className="icon-size" alt="location_icon"/></span>
          <input type="text" placeholder="Enter Location" />
        </div>
        <div className="separator"></div>

        <div className="search-field">
          <span><img src={tick} className="icon-size" alt="search_tick"/></span>
          <select defaultValue="" required>
            <option value="" disabled hidden>Enter Experience</option>
            <option value="fresher">Fresher</option>
            <option value="1-3">1-3 Years</option>
            <option value="3-5">3-5 Years</option>
            <option value="5+">5+ Years</option>
          </select>
        </div>

        <button className="search-button">Search</button>
      </div>
    </main>
    </>
  )
}
