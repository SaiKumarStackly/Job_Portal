import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import workTime from '../assets/WorkTime.png'
import Google from '../assets/GOOG.png'
import eye from '../assets/show_password.png'
import eyeHide from '../assets/eye-hide.png'
import './Jsignup.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export const Jsignup = () => {

  const navigate = useNavigate();
  const [passwordShow, setPasswordShow] = useState(true)
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(true)

  const togglePasswordView = () => {
    setPasswordShow((prev) => !prev)
  }

  const toggleConfirmPasswordView = () => {
    setConfirmPasswordShow((prev) => !prev)
  }

  const initialValues = { username: "", email: "", password: "", confirmpassword: "", phone: "" }
  const [formValues, setFormValues] = useState(initialValues)

  const [errors, setErrors] = useState({})

  const handleForm = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const validateForm = () => {
    const newErrors = {}

    const regexOfMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const regexofUppercase = /^(?=.*[A-Z]).+$/
    const regexofNumber = /^(?=.*\d).+$/
    const regexofSpecialChar = /^(?=.*[!@#$%^&*]).+$/
    const regexofUserName = /^(?=[a-zA-Z])\S+$/
    const regexofMobile = /^\d{10}$/

    if (!formValues.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formValues.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters"
    } else if (formValues.username.length > 20) {
      newErrors.username = "Username should not exceed 20 characters"
    } else if (!regexofUserName.test(formValues.username)) {
      newErrors.username = "Invalid username Format"
    }

    if (!formValues.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!regexOfMail.test(formValues.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formValues.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formValues.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!regexofUppercase.test(formValues.password)) {
      newErrors.password = "Password must contain at least one uppercase letter"
    } else if (!regexofNumber.test(formValues.password)) {
      newErrors.password = "Password must contain at least one number"
    } else if (!regexofSpecialChar.test(formValues.password)) {
      newErrors.password = "Password must contain at least one special character"
    }

    if (!formValues.confirmpassword.trim()) {
      newErrors.confirmpassword = "Confirm Password is required"
    } else if (formValues.password !== formValues.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match"
    }

    if (formValues.phone && !regexofMobile.test(formValues.phone)) {
      newErrors.phone = "Invalid format";
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/register/jobseeker/",
        {
          username: formValues.username,
          email: formValues.email,
          phone: formValues.phone || null,
          password: formValues.password,
          password_confirm: formValues.confirmpassword,
        }
      );

      alert("Registration successful! Please login.");
      navigate("/Job-portal/jobseeker/login");

    } catch (err) {
      const apiErrors = err.response?.data;

      if (apiErrors) {
        const newErrors = {};
        Object.keys(apiErrors).forEach((key) => {
          newErrors[key] = apiErrors[key][0];
        });
        setErrors(newErrors);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="j-sign-up-page">
      <header className="j-sign-up-header">
        <Link to="/Job-portal" className="logo">
          <span className="logo-text">job portal</span>
        </Link>
        <div className="j-sign-up-header-links">
          <span className='no-account'>Already have an account?</span>
          <Link to="/Job-portal/jobseeker/login" className="signup-btn">Login</Link>
          <div className="separator"></div>
          <Link to='/Job-portal/employer/login' className="employer-redirect-link">Employers Login</Link>
        </div>
      </header>

      <div className="j-sign-up-body">
        <div className="signup-illustration">
          <img src={workTime} alt="Signup Illustration" />
        </div>

        <form onSubmit={handleSubmit} className="j-sign-up-form">
          <h2>Sign up for Jobseeker</h2>

          <label>User name</label>
          <input type="text" name="username" value={formValues.username} onChange={handleForm} placeholder="Create your Username" className={errors.username ? "input-error" : ""} />
          {errors.username && <span className="error-msg">{errors.username}</span>}

          <label>Email ID</label>
          <input type="text" name="email" value={formValues.email} onChange={handleForm} placeholder="Enter your Email ID" className={errors.email ? "input-error" : ""} />
          {errors.email && <span className="error-msg">{errors.email}</span>}

          <label>Password</label>
          <div className="password-wrapper">
            <input type={passwordShow ? "password" : "text"} name="password" value={formValues.password} onChange={handleForm} placeholder="Create a new password" className={errors.password ? "input-error" : ""} />
            <span className="eye-icon" onClick={togglePasswordView}><img src={passwordShow ? eye : eyeHide} className='show-icon' alt='show' /></span>
          </div>
          {errors.password && <span className="error-msg">{errors.password}</span>}

          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input type={confirmPasswordShow ? "password" : "text"} name="confirmpassword" value={formValues.confirmpassword} onChange={handleForm} placeholder="Confirm password" className={errors.confirmpassword ? "input-error" : ""} />
            <span className="eye-icon" onClick={toggleConfirmPasswordView}><img src={confirmPasswordShow ? eye : eyeHide} className='show-icon' alt='show' /></span>
          </div>
          {errors.confirmpassword && <span className="error-msg">{errors.confirmpassword}</span>}

          <label>Mobile number (optional)</label>
          <input type="tel" name="phone" value={formValues.phone} onChange={handleForm} placeholder="Enter your mobile number" className={errors.phone ? "input-error" : ""} />
          {errors.phone && <span className="error-msg">{errors.phone}</span>}

          <button type="submit" className="j-sign-up-submit">
            Signup
          </button>


          <div className="divider">Or Continue with</div>

          <button className="google-btn">
            <img
              src={Google}
              alt="Google"
            />
            Google
          </button>
        </form>
      </div>
    </div>
  );
}
