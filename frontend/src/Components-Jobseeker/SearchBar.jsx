import React, { useState } from 'react';
import search from '../assets/icon_search.png'
import location from '../assets/icon_location.png'
import tick from '../assets/icon_tick.png'

export const SearchBar = ({searchQuery, setSearchQuery,searchLocation, setSearchLocation,searchExp, setSearchExp,onSearch}) => {
  return (
    <div className="search-bar">
      <div className="search-field">
        <span><img src={search} className="icon-size" alt="search" /></span>
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search by Skills, company or job title" 
        />
      </div>
      <div className="separator"></div>

      <div className="search-field">
        <span><img src={location} className="icon-size" alt="location" /></span>
        <input 
          type="text" 
          value={searchLocation} 
          onChange={(e) => setSearchLocation(e.target.value)} 
          placeholder="Enter Location" 
        />
      </div>
      <div className="separator"></div>

      <div className="search-field">
        <span><img src={tick} className="icon-size" alt="exp" /></span>
        <select value={searchExp} onChange={(e) => setSearchExp(e.target.value)}>
          <option value="" disabled hidden>Experience</option>
          <option value="fresher">Fresher</option>
          <option value="1-3">1-3 Years</option>
          <option value="3-5">3-5 Years</option>
          <option value="5+">5+ Years</option>
        </select>
      </div>

      <button onClick={onSearch} className="search-button">Search</button>
    </div>
  );
};