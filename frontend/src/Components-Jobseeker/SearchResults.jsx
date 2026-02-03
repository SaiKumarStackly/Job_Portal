import { useEffect, useState, useMemo } from "react";
import { JHeader } from "./JHeader";
import "./SearchResults.css";
import { SearchResultsCard } from "./SearchResultsCard";
import { Footer } from "../Components-LandingPage/Footer";
import { useLocation } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import axios from "axios";

export const SearchResults = () => {
  const location = useLocation();

  /* ---------------- HELPER FUNCTIONS ---------------- */
  const getPercent = (value) => Math.round(((value - 0) / (100 - 0)) * 100);

  const formatPostedDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      const postedDate = new Date(dateString);
      const today = new Date();
      const diffInMs = today - postedDate;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return "Today";
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays > 1 && diffInDays <= 7) return `${diffInDays} days ago`;
      if (diffInDays > 8 && diffInDays <= 14) return `1 Week ago`;
      if (diffInDays > 15 && diffInDays <= 21) return `2 Week ago`;
      if (diffInDays > 22 && diffInDays <= 29) return `3 Week ago`;
      if (diffInDays > 30 && diffInDays <= 60) return `1 month ago`;
      return `Long ago`;
    } catch (error) {
      return "Unknown";
    }
  };

  // Helper to parse experience string
  const parseExperience = (expString) => {
    if (!expString) return 0;
    const match = expString.toString().match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Helper to parse salary string
  const parseSalary = (salaryString) => {
    if (!salaryString) return 0;
    // Remove non-numeric characters except dot
    const numString = salaryString.toString().replace(/[^\d.]/g, '');
    const num = parseFloat(numString);
    return isNaN(num) ? 0 : num;
  };

  /* ---------------- STATES ---------------- */
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(100);
  const [Exp, SetExp] = useState(30);
  const [openSort, setOpenSort] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  /* ---------------- VIEW MORE STATES ---------------- */
  const [TopCompanyExpanded, setTopCompanyExpanded] = useState(false);
  const [LocationExpanded, setLocationExpanded] = useState(false);
  const [IndustryTypeExpanded, setIndustryTypeExpanded] = useState(false);

  /* ---------------- SEARCH STATES ---------------- */
  const [searchQuery, setSearchQuery] = useState(location.state?.query || "");
  const [searchLocation, setSearchLocation] = useState(location.state?.location || "");
  const [searchExp, setSearchExp] = useState(location.state?.experience || "");

  const [appliedFilters, setAppliedFilters] = useState({
    query: location.state?.query || "",
    location: location.state?.location || "",
    experience: location.state?.experience || ""
  });

  /* ---------------- INITIALIZE EMPTY FILTER LISTS ---------------- */
  const [locationFilters, setLocationFilters] = useState([]);
  const [workTypeFilters, setWorkTypeFilters] = useState([]);
  const [PostedbyFilter, setPostedbyFilter] = useState([]);
  const [CompanyFilter, setCompanyFilter] = useState([]);
  const [EducationFilter, setEducationFilter] = useState([]);
  const [PostedDateFilter, setPostedDateFilter] = useState([]);
  const [IndustryTypeFilter, setIndustryTypeFilter] = useState([]);

  /* ---------------- SELECTION STATES ---------------- */
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedWorkType, setselectedWorkType] = useState([]);
  const [SelectedPostedby, setSelectedPostedby] = useState([]);
  const [SelectedCompany, setSelectedCompany] = useState([]);
  const [SelectedEducation, setSelectedEducation] = useState([]);
  const [SelectedPostDate, setSelectedPostDate] = useState([]);
  const [SelectedIndustryType, setSelectedIndustryType] = useState([]);

  /* ---------------- APPLIED STATE ---------------- */
  const [appliedSidebarFilters, setAppliedSidebarFilters] = useState({
    locations: [],
    workType: [],
    postedBy: [],
    company: [],
    education: [],
    postedDate: [],
    industryType: [],
    minSalary: 0,
    maxSalary: 100,
    maxExp: 30
  });

  /* ---------------- FETCH JOBS ---------------- */
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/Jcompanies/opportunityoverview/");
        
        if (response.data && response.data.length > 0) {
          // Transform API data to match expected format
          const transformedJobs = response.data.map((job, index) => ({
            id: job.id || index,
            title: job.title || "Untitled Position",
            company: job.company || "Unknown Company",
            location: job.location || "Remote",
            salary: job.salary || "Not disclosed",
            experience: job.experience || "0 years",
            work_type: job.work_type || "Full-time",
            posted_by: job.posted_by || "Company",
            posted: job.created_at || new Date().toISOString(),
            education_required: job.education_required || [],
            industry_type: job.industry_type || [],
            key_skills: job.key_skills || [],
            ratings: job.rating || 0,
            description: job.job_description || "",
            logo: job.logo || "",
            department: job.department || "",
            openings: job.openings || 0,
            applicants: job.applicants || 0,
            tags: job.tags || [],
            job_highlights: job.job_highlights || "",
            company_overview: job.company_overview || "",
            responsibilities: job.responsibilities || ""
          }));
          
          setJobs(transformedJobs);
          initializeFilterLists(transformedJobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const initializeFilterLists = (data) => {
    // Helper function to count occurrences
    const countValues = (items, getValue) => {
      const counts = {};
      items.forEach(item => {
        const value = getValue(item);
        if (value) {
          const key = String(value).toLowerCase();
          counts[key] = (counts[key] || 0) + 1;
        }
      });
      return Object.entries(counts);
    };

    // Location
    const locationCounts = countValues(data, job => job.location);
    setLocationFilters(locationCounts.slice(0, 5));

    // Work Type
    const workTypeCounts = countValues(data, job => job.work_type);
    setWorkTypeFilters(workTypeCounts);

    // Posted By
    const postedByCounts = countValues(data, job => job.posted_by);
    setPostedbyFilter(postedByCounts);

    // Company
    const companyCounts = countValues(data, job => job.company);
    setCompanyFilter(companyCounts.slice(0, 5));

    // Education (array field)
    const educationMap = {};
    data.forEach(job => {
      const educationList = job.education_required || [];
      educationList.forEach(edu => {
        if (edu) {
          const key = edu.toLowerCase();
          educationMap[key] = (educationMap[key] || 0) + 1;
        }
      });
    });
    setEducationFilter(Object.entries(educationMap).slice(0, 5));

    // Posted Date
    const postedDateMap = {};
    data.forEach(job => {
      const date = job.posted;
      const formatted = formatPostedDate(date);
      postedDateMap[formatted] = (postedDateMap[formatted] || 0) + 1;
    });
    setPostedDateFilter(Object.entries(postedDateMap));

    // Industry Type (array field)
    const industryMap = {};
    data.forEach(job => {
      const industries = job.industry_type || [];
      industries.forEach(ind => {
        if (ind) {
          const key = ind.toLowerCase();
          industryMap[key] = (industryMap[key] || 0) + 1;
        }
      });
    });
    setIndustryTypeFilter(Object.entries(industryMap).slice(0, 5));
  };

  /* ---------------- EVENT HANDLERS ---------------- */
  const handleSearchButtonClick = () => {
    setAppliedFilters({
      query: searchQuery,
      location: searchLocation,
      experience: searchExp
    });
  };

  const HandleApplyFilter = () => {
    setAppliedSidebarFilters({
      locations: selectedLocations,
      workType: selectedWorkType,
      postedBy: SelectedPostedby,
      company: SelectedCompany,
      education: SelectedEducation,
      postedDate: SelectedPostDate,
      industryType: SelectedIndustryType,
      minSalary: minVal,
      maxSalary: maxVal,
      maxExp: Exp
    });
  };

  const HandleClear = () => {
    setSelectedLocations([]);
    setselectedWorkType([]);
    setSelectedPostedby([]);
    setSelectedCompany([]);
    setSelectedEducation([]);
    setSelectedPostDate([]);
    setSelectedIndustryType([]);
    setMinVal(0);
    setMaxVal(100);
    SetExp(30);

    setAppliedSidebarFilters({
      locations: [],
      workType: [],
      postedBy: [],
      company: [],
      education: [],
      postedDate: [],
      industryType: [],
      minSalary: 0,
      maxSalary: 100,
      maxExp: 30
    });
  };

  const handleSort = (type) => {
    setSortBy(type);
    setOpenSort(false);
  };

  const handleLocationViewMore = () => {
    const locationMap = {};
    jobs.forEach(job => {
      const loc = job.location?.toLowerCase();
      if (loc) {
        locationMap[loc] = (locationMap[loc] || 0) + 1;
      }
    });
    const locationArray = Object.entries(locationMap);
    
    if (LocationExpanded) {
      setLocationFilters(locationArray.slice(0, 5));
    } else {
      setLocationFilters(locationArray);
    }
    setLocationExpanded(!LocationExpanded);
  };

  const handleCompanyViewMore = () => {
    const companyMap = {};
    jobs.forEach(job => {
      const company = job.company?.toLowerCase();
      if (company) {
        companyMap[company] = (companyMap[company] || 0) + 1;
      }
    });
    const companyArray = Object.entries(companyMap);
    
    if (TopCompanyExpanded) {
      setCompanyFilter(companyArray.slice(0, 5));
    } else {
      setCompanyFilter(companyArray);
    }
    setTopCompanyExpanded(!TopCompanyExpanded);
  };

  const handleIndustryViewMore = () => {
    const industryMap = {};
    jobs.forEach(job => {
      const industries = job.industry_type || [];
      industries.forEach(ind => {
        const key = ind.toLowerCase();
        industryMap[key] = (industryMap[key] || 0) + 1;
      });
    });
    const industryArray = Object.entries(industryMap);
    
    if (IndustryTypeExpanded) {
      setIndustryTypeFilter(industryArray.slice(0, 5));
    } else {
      setIndustryTypeFilter(industryArray);
    }
    setIndustryTypeExpanded(!IndustryTypeExpanded);
  };

  /* ---------------- CHECKBOX HANDLERS ---------------- */
  const handleLocationChange = (event) => {
    const val = event.target.value;
    setSelectedLocations(prev => 
      event.target.checked ? [...prev, val] : prev.filter(item => item !== val)
    );
  };

  const HandleWorkType = (event) => {
    const val = event.target.value;
    setselectedWorkType(prev => 
      event.target.checked ? [...prev, val] : prev.filter(item => item !== val)
    );
  };

  const HandlePostedby = (event) => {
    const val = event.target.value;
    setSelectedPostedby(prev => 
      event.target.checked ? [...prev, val] : prev.filter(item => item !== val)
    );
  };

  const HandleCompany = (event) => {
    const val = event.target.value;
    setSelectedCompany(prev => 
      event.target.checked ? [...prev, val] : prev.filter(item => item !== val)
    );
  };

  const HandleEducation = (event) => {
    const val = event.target.value;
    setSelectedEducation(prev => 
      event.target.checked ? [...prev, val] : prev.filter(item => item !== val)
    );
  };

  const HandlePostedDate = (event) => {
    const val = event.target.value;
    setSelectedPostDate(prev => 
      event.target.checked ? [...prev, val] : prev.filter(item => item !== val)
    );
  };

  const HandleIndustryType = (event) => {
    const val = event.target.value;
    setSelectedIndustryType(prev => 
      event.target.checked ? [...prev, val] : prev.filter(item => item !== val)
    );
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Main search filters
      const query = appliedFilters.query.toLowerCase();
      const locationQuery = appliedFilters.location.toLowerCase();
      const expQuery = appliedFilters.experience;
      
      let matchesMainSearch = true;
      
      if (query) {
        matchesMainSearch = 
          (job.title?.toLowerCase().includes(query)) ||
          (job.company?.toLowerCase().includes(query)) ||
          (job.key_skills?.some(skill => skill?.toLowerCase().includes(query))) ||
          false;
      }
      
      let matchesLocation = true;
      if (locationQuery) {
        matchesLocation = job.location?.toLowerCase().includes(locationQuery) || false;
      }
      
      let matchesExperience = true;
      if (expQuery) {
        const jobExp = parseExperience(job.experience);
        if (expQuery === "fresher") matchesExperience = jobExp === 0;
        else if (expQuery === "1-3") matchesExperience = jobExp >= 1 && jobExp <= 3;
        else if (expQuery === "3-5") matchesExperience = jobExp >= 3 && jobExp <= 5;
        else if (expQuery === "5+") matchesExperience = jobExp >= 5;
      }
      
      // 2. Sidebar filters
      const sf = appliedSidebarFilters;
      
      // Location
      const jobLocation = job.location?.toLowerCase() || '';
      const matchesSidebarLocation = sf.locations.length === 0 || sf.locations.includes(jobLocation);
      
      // Work Type
      const jobWorkType = job.work_type?.toLowerCase() || '';
      const matchesWorkType = sf.workType.length === 0 || sf.workType.includes(jobWorkType);
      
      // Company
      const jobCompany = job.company?.toLowerCase() || '';
      const matchesCompany = sf.company.length === 0 || sf.company.includes(jobCompany);
      
      // Experience
      const jobExp = parseExperience(job.experience);
      const matchesExpFilter = jobExp <= sf.maxExp;
      
      // Salary
      const jobSalary = parseSalary(job.salary);
      const matchesSalary = jobSalary >= sf.minSalary && (sf.maxSalary >= 100 || jobSalary <= sf.maxSalary);
      
      // Education
      const jobEducation = Array.isArray(job.education_required) ? 
        job.education_required.map(e => e?.toLowerCase()) : [];
      const matchesEducation = sf.education.length === 0 || 
        jobEducation.some(edu => sf.education.includes(edu));
      
      // Industry
      const jobIndustry = Array.isArray(job.industry_type) ? 
        job.industry_type.map(i => i?.toLowerCase()) : [];
      const matchesIndustry = sf.industryType.length === 0 || 
        jobIndustry.some(ind => sf.industryType.includes(ind));
      
      // Posted Date
      const jobPostedDate = formatPostedDate(job.posted);
      const matchesPostedDate = sf.postedDate.length === 0 || 
        sf.postedDate.includes(jobPostedDate);
      
      // Posted By
      const jobPostedBy = job.posted_by?.toLowerCase() || '';
      const matchesPostedBy = sf.postedBy.length === 0 || 
        sf.postedBy.includes(jobPostedBy);

      return matchesMainSearch && matchesLocation && matchesExperience &&
             matchesSidebarLocation && matchesWorkType && matchesCompany &&
             matchesExpFilter && matchesSalary && matchesEducation &&
             matchesIndustry && matchesPostedDate && matchesPostedBy;
    });
  }, [jobs, appliedFilters, appliedSidebarFilters]);

  const sortedJobs = useMemo(() => {
    if (!sortBy) return filteredJobs;
    
    const jobsCopy = [...filteredJobs];
    
    if (sortBy === "date") {
      return jobsCopy.sort((a, b) => 
        new Date(b.posted || 0) - new Date(a.posted || 0)
      );
    }
    
    if (sortBy === "ratings") {
      return jobsCopy.sort((a, b) => 
        (b.ratings || 0) - (a.ratings || 0)
      );
    }
    
    return jobsCopy;
  }, [filteredJobs, sortBy]);

  /* ---------------- RENDER ---------------- */
  if (isLoading) {
    return (
      <>
        <JHeader />
        <div className="loading-container">
          <h2>Loading jobs...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <JHeader />
      <div className='jobs-tab-search-bar'>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchLocation={searchLocation}
          setSearchLocation={setSearchLocation}
          searchExp={searchExp}
          setSearchExp={setSearchExp}
          onSearch={handleSearchButtonClick}
        />
      </div>
      <div className='search-result-title'>
        <h1>Jobs Based On Your Search</h1>
      </div>

      <div className='Mainsec-Search-Res'>
        <div className='Aside'>
          <div className='aside-header'>
            <p onClick={HandleApplyFilter} className='filter-applied' style={{ cursor: 'pointer' }}>
              Apply Filters
            </p>
            <p onClick={HandleClear} className='filter-applied' style={{ cursor: 'pointer' }}>
              Clear Filters
            </p>
          </div>

          {/* Work Type Filter */}
          {workTypeFilters.length > 0 && (
            <div className='Search-Worktype-Container'>
              <h4>Work Type</h4>
              {workTypeFilters.map(([work, count]) => {
                const WorkType = work.charAt(0).toUpperCase() + work.slice(1);
                return (
                  <div key={work}>
                    <label htmlFor={`WorkType-${work}`} className="location-checkbox-label">
                      <input
                        type="checkbox"
                        id={`WorkType-${work}`}
                        name="WorkType"
                        value={work}
                        onChange={HandleWorkType}
                        checked={selectedWorkType.includes(work)}
                      />
                      <span className="location-text">{WorkType}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Location Filter */}
          {locationFilters.length > 0 && (
            <div className='Search-Worktype-Container'>
              <h4>Location</h4>
              {locationFilters.map(([locationKey, count]) => {
                const displayLocation = locationKey.charAt(0).toUpperCase() + locationKey.slice(1);
                return (
                  <div key={locationKey}>
                    <label htmlFor={`location-${locationKey}`} className="location-checkbox-label">
                      <input
                        type="checkbox"
                        id={`location-${locationKey}`}
                        name="location"
                        value={locationKey}
                        onChange={handleLocationChange}
                        checked={selectedLocations.includes(locationKey)}
                      />
                      <span className="location-text">{displayLocation}</span>
                    </label>
                  </div>
                );
              })}
              {locationFilters.length > 5 && (
                <div className='viewmore-cont'>
                  <button onClick={handleLocationViewMore} className='viewmore-btn'>
                    {LocationExpanded ? 'View Less' : 'View More'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Posted By Filter */}
          {PostedbyFilter.length > 0 && (
            <div className='Search-Worktype-Container'>
              <h4>Posted by</h4>
              {PostedbyFilter.map(([post, count]) => {
                const Postedby = post.charAt(0).toUpperCase() + post.slice(1);
                return (
                  <div key={post}>
                    <label htmlFor={`postedby-${post}`} className="location-checkbox-label">
                      <input
                        type="checkbox"
                        id={`postedby-${post}`}
                        name="postedby"
                        value={post}
                        onChange={HandlePostedby}
                        checked={SelectedPostedby.includes(post)}
                      />
                      <span className="location-text">{Postedby}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Company Filter */}
          {CompanyFilter.length > 0 && (
            <div className='Search-Worktype-Container'>
              <h4>Top Companies</h4>
              {CompanyFilter.map(([company, count]) => {
                const CompanyName = company.charAt(0).toUpperCase() + company.slice(1);
                return (
                  <div key={company}>
                    <label htmlFor={`Company-${company}`} className="location-checkbox-label">
                      <input
                        type="checkbox"
                        id={`Company-${company}`}
                        name="Company"
                        value={company}
                        onChange={HandleCompany}
                        checked={SelectedCompany.includes(company)}
                      />
                      <span className="location-text">{CompanyName}</span>
                    </label>
                  </div>
                );
              })}
              {CompanyFilter.length > 5 && (
                <div className='viewmore-cont'>
                  <button onClick={handleCompanyViewMore} className='viewmore-btn'>
                    {TopCompanyExpanded ? 'View Less' : 'View More'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Education Filter */}
          {EducationFilter.length > 0 && (
            <div className='Search-Worktype-Container'>
              <h4>Education</h4>
              {EducationFilter.map(([edu, count]) => {
                const Education = edu.charAt(0).toUpperCase() + edu.slice(1);
                return (
                  <div key={edu}>
                    <label htmlFor={`Education-${edu}`} className="location-checkbox-label">
                      <input
                        type="checkbox"
                        id={`Education-${edu}`}
                        name="Education"
                        value={edu}
                        onChange={HandleEducation}
                        checked={SelectedEducation.includes(edu)}
                      />
                      <span className="location-text">{Education}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Freshness Filter */}
          {PostedDateFilter.length > 0 && (
            <div className='Search-Worktype-Container'>
              <h4>Freshness</h4>
              {PostedDateFilter.map(([Post, count]) => {
                return (
                  <div key={Post}>
                    <label htmlFor={`PostedDate-${Post}`} className="location-checkbox-label">
                      <input
                        type="checkbox"
                        id={`PostedDate-${Post}`}
                        name="PostedDate"
                        value={Post}
                        onChange={HandlePostedDate}
                        checked={SelectedPostDate.includes(Post)}
                      />
                      <span className="location-text">{Post}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Industry Type Filter */}
          {IndustryTypeFilter.length > 0 && (
            <div className='Search-Worktype-Container'>
              <h4>Industry Type</h4>
              {IndustryTypeFilter.map(([int, count]) => {
                const IndustryType = int.charAt(0).toUpperCase() + int.slice(1);
                return (
                  <div key={int}>
                    <label htmlFor={`IndustryType-${int}`} className="location-checkbox-label">
                      <input
                        type="checkbox"
                        id={`IndustryType-${int}`}
                        name="IndustryType"
                        value={int}
                        onChange={HandleIndustryType}
                        checked={SelectedIndustryType.includes(int)}
                      />
                      <span className="location-text">{IndustryType}</span>
                    </label>
                  </div>
                );
              })}
              {IndustryTypeFilter.length > 5 && (
                <div className='viewmore-cont'>
                  <button onClick={handleIndustryViewMore} className='viewmore-btn'>
                    {IndustryTypeExpanded ? 'View Less' : 'View More'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Experience & Salary Sliders */}
          <div className="filter-group">
            <h3 className="section-title">Experience</h3>
            <div className="range-container single-wrapper">
              <input
                type="range"
                className="slider single-thumb"
                min="0"
                max="30"
                value={Exp}
                onChange={(e) => SetExp(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${(Exp / 30) * 100}%, #e2e8f0 ${(Exp / 30) * 100}%)`
                }}
              />
            </div>
            <div className="salary-labels">
              <span>Exp: {Exp} Years</span>
            </div>

            <h3 className="section-title">Salary</h3>
            <div className="range-container">
              <div className="slider-base-track" />
              <div
                className="slider-active-range"
                style={{
                  left: `${getPercent(minVal)}%`,
                  width: `${getPercent(maxVal) - getPercent(minVal)}%`
                }}
              />
              <input
                className="slider multi thumb-left"
                type="range"
                min="0"
                max="100"
                value={minVal}
                onChange={(e) => setMinVal(Math.min(Number(e.target.value), maxVal - 1))}
              />
              <input
                className="slider multi thumb-right"
                type="range"
                min="0"
                max="100"
                value={maxVal}
                onChange={(e) => setMaxVal(Math.max(Number(e.target.value), minVal + 1))}
              />
            </div>
            <div className="salary-labels">
              <span>Min: {minVal}LPA</span>
              {maxVal >= 100 ? <span>Max: 1 CPA</span> : <span>Max: {maxVal} LPA</span>}
            </div>
          </div>
        </div>

        <div className='maincontent'>
          <div className='SortbySearch'>
            <h2 className='NoofJobsCont'>Showing {sortedJobs.length} Jobs</h2>
            {sortedJobs.length  !== 0 && (
              <div className="sort-wrapper">
                <button className='Sortbutton' onClick={() => setOpenSort(!openSort)}>
                  Sort by ▾
                </button>
                {openSort && (
                  <div className="sort-dropdown">
                    <div onClick={() => handleSort("recommended")}>Recommended</div>
                    <div onClick={() => handleSort("ratings")}>Ratings</div>
                    <div onClick={() => handleSort("date")}>Date</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {sortedJobs.length > 0 ? (
            sortedJobs.map((job, index) => (
              <div key={job.id || index} className='jobs-card'>
                <SearchResultsCard job={job} />
              </div>
            ))
          ) : (
            <div className="no-jobs-found">
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria or filters</p>
              <button 
                onClick={HandleClear}
                style={{marginTop: '10px', padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px'}}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};