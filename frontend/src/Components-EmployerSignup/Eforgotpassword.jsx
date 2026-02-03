import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import forgot from "../assets/Forgot.png"
import './Eforgotpassword.css'
import axios from 'axios';

export const Eforgotpassword = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({ email: "" })
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({})

  const handleForm = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const validateForm = () => {
    const newErrors = {}

    const regexOfMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!formValues.email.trim()) {
      newErrors.email = "email is required"
    } else if (!regexOfMail.test(formValues.email)) {
      newErrors.email = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async (e) => {
     

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/employer/forgot-password/",
        { email: formValues.email }
      );

      setSuccessMsg(res.data.message || "Reset link sent to email");

      // Redirect after success
      setTimeout(() => {
        navigate("/Job-portal/employer/login/forgotpassword/createpassword");
      }, 2000);
    } catch (err) {
      setErrors({
        email:
          err.response?.data?.error ||
          err.response?.data?.email ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="j-forgot-password-page">
      <header className="j-forgot-password-header">
        <Link to="/Job-portal" className="logo">
          <span className="logo-text">job portal</span>
          <span className='subtext'>for Employers</span>
        </Link>
        <div className="j-forgot-password-header-links">
          <span className='no-account'>Don't have an account?</span>
          <Link to="/Job-portal/employer/signup" className="signup-btn">Sign up</Link>
        </div>
      </header>
      <div className='j-forgot-password-login-body'>
        <div className="forgot-password-illustration">
          <img src={forgot} alt="Forgot password Illustration" />
        </div>
        <form action={handleSubmit} className="forgot-password-form">
          <h2>Forgot Your Password?</h2>

          <label>Email ID</label>
          <input type="text" placeholder="Enter your Email ID" name="email" value={formValues.email} onChange={handleForm} className={errors.email ? "input-error" : ""} />
          {errors.email && <span className="error-msg">{errors.email}</span>}

          <button className="j-send-link-btn">Send Link</button>

          <div className='center-div-text'>
            <p>Remember your password? <Link to="/Job-portal/employer/login" className='j-password-form-login-link'>Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}
