import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import manSitting from '../assets/Illustration_1.png'
import eye from '../assets/show_password.png'
import eyeHide from '../assets/eye-hide.png'
import Google from '../assets/GOOG.png'
import './Jlogin.css'
import axios from 'axios';

export const Jlogin = () => {

  const navigate = useNavigate();

  const [passwordShow, setPasswordShow] = useState(true)

  const togglePasswordView = () => {
    setPasswordShow((prev) => !prev)
  }

  const initialValues = { username: "", password: "" }
  const [formValues, setFormValues] = useState(initialValues)

  const [errors, setErrors] = useState({})

  const handleForm = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formValues.username.trim()) {
      newErrors.username = "Username or Email is required"
    }

    if (!formValues.password.trim()) {
      newErrors.password = "Password is required"
    } 

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(formData) {
    if (!validateForm()) return;

    axios.post("http://127.0.0.1:8000/api/jobseeker/login/", {
      username: formValues.username,
      password: formValues.password
    })
    .then((res) => {
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      navigate("/Job-portal/jobseeker/");
    })
    .catch((err) => {
      setErrors({
        password: err.response?.data?.error || "Invalid username or password"
      });
    });
  };

return (
    <div className="login-page">
      <header className="login-header">
        <Link to="/Job-portal" className="logo">
          <span className="logo-text">job portal</span>
        </Link>
        <div className="header-links">
          <span className='no-account'>Don’t have an account?</span>
          <Link to="/Job-portal/jobseeker/signup" className="signup-btn">Sign up</Link>
          <div className="separator"></div>
          <Link to='/Job-portal/employer/login' className="employer-redirect-link">Employers Login</Link>
        </div>
      </header>

      <div className="login-body">
        <div className="login-illustration">
          <img src={manSitting} alt="Login Illustration" />
        </div>

        <form action={handleSubmit} className="login-form">
          <h2>Login to continue</h2>

          <label>User name / Email ID</label>
          <input type="text" name="username" placeholder="Enter your User name / Email ID" value={formValues.username} onChange={handleForm} className={errors.username ? "input-error" : ""} />
          {errors.username && <span className="error-msg">{errors.username}</span>}

          <label>Password</label>
          <div className="password-wrapper">
            <input type={passwordShow ? "password" : "text"} placeholder="Enter your password" name='password' value={formValues.password} onChange={handleForm} className={errors.password ? "input-error" : ""} />
            <span className="eye-icon" onClick={togglePasswordView}><img src={passwordShow ? eye : eyeHide} className='show-icon' alt='show' /></span>
          </div>
          {errors.password && <span className="error-msg">{errors.password}</span>}

          <div className="form-options">
            <label><input type="checkbox" /> Remember me</label>
            <Link to="/Job-portal/jobseeker/login/forgotpassword" className='forgot-password'>Forgot Password?</Link>
          </div>

          <button className="j-login-btn">Login</button>

          <div className="divider">Or Continue with</div>

          <button className="google-btn">
            <img src={Google} alt="Google" />
            Google
          </button>
        </form>
      </div>
    </div>
  )
}