import React, { useState } from 'react'
import search from '../assets/icon_search.png'
import location from '../assets/icon_location.png'
import tick from '../assets/icon_tick.png'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from './SearchBar'


export const JMainsection = () => {

    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [experience, setExperience] = useState('');

  const handleInitialSearch = () => {
   
    navigate('/Job-portal/jobseeker/searchresults', { 
      state: { 
        query: query, 
        location: location, 
        experience: experience 
      } 
    })
  }
    return (
        <main className="main-section">
            <h1 className="headline">"Welcome Back!"</h1>
            <p className="subheading">Your next big opportunity is waiting — explore jobs tailored just for you.</p>
            <SearchBar  searchQuery={query} setSearchQuery={setQuery} searchLocation={location} setSearchLocation={setLocation} searchExp={experience} 
            setSearchExp={setExperience} onSearch={handleInitialSearch}/>
        </main>
    )
}