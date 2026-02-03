import {React,useState,useEffect} from 'react'
import Slider from "react-slick";
import starIcon from '../assets/Star_icon.png'
import left from '../assets/left_arrow.png'
import right from '../assets/right_arrow.png'
import { useNavigate } from "react-router-dom";
import { CompaniesList } from "../CompaniesList";
import axios from 'axios';

export const Jobsbycompany = () => {

    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/jobsbycompany/")
            .then(res => setCompanies(res.data))
            .catch(err => console.error("Error fetching companies:", err));
    }, []);

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
            <h2 className="carousel-title">Find Jobs By Company</h2>
            <Slider {...settings}>
                {companies.map((company) => (
                    <div className="carousel-card" key={company.companyId}>
                        <img className="carousel-company-logo" src={company.logo} alt={company.name} />
                        <div className="carousel-card-header">
                            <h3>{company.name}</h3>
                            <p className='carousel-company-rating'><span className="star"><img src={starIcon} /></span> {company.rating} | {company.reviews} reviews</p>
                        </div>
                        <p className="carousel-desc">{company.desc}</p>
                        <button onClick={()=>navigate(`/Job-portal/jobseeker/companies/${company.companyId}`)} className="carousel-view-jobs">View jobs</button>
                    </div>
                ))}
            </Slider>
            <div className="carousel-view-all-wrapper">
                <button onClick={() => navigate('/Job-portal/jobseeker/companies')} className="carousel-view-all">View All Companies</button>
            </div>
        </section>
    )
}
