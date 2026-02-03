import React, { useEffect, useState } from 'react'
import './Topcompanies.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import Apple from '../assets/Apple-Logo.png'
import Wipro from '../assets/WIT.png'
import CTS from '../assets/CTSH_BIG.png'
import Amazon from '../assets/AMZN_BIG.png'
import Google from '../assets/GOOG.png'
import Infy from '../assets/INFY_BIG.png'
import Tcs from '../assets/TCS.png'
import META from '../assets/META_BIG.png'
import starIcon from '../assets/Star_icon.png'
import left from '../assets/left_arrow.png'
import right from '../assets/right_arrow.png'



const CustomPrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>
    <img src={left} alt="Previous" />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>
    <img src={right} alt="Next" />
  </div>
);

export const Topcompanies = () => {
  const [companies, setCompanies] = useState([]);
 
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/companies/")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
      <section className="carousel-wrapper">
        <h2 className="carousel-title">Top Companies Hiring Now</h2>
        <Slider {...settings}>
          {companies.map((company)=>(
            <div className="carousel-card" key={company.id}>
              <img className="carousel-company-logo" src={company.logo} alt={company.name}/>
              <div className="carousel-card-header">
                <h3>{company.name}</h3>
                <p className='carousel-company-rating'><span className="star"><img src={starIcon} /></span> {company.rating} | {company.reviews} reviews</p>
              </div>
              <p className="carousel-desc">{company.desc}</p>
              <button className="carousel-view-jobs">View jobs</button>
            </div>
          ))}
        </Slider>
        <div className="carousel-view-all-wrapper">
          <button className="carousel-view-all">View All Companies</button>
        </div>
      </section>
  )
}
