import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Esignup.css";
import workTime from "../assets/WorkTime.png";
import eye from "../assets/show_password.png";
import eyeHide from "../assets/eye-hide.png";

export const Esignup = () => {
  const navigate = useNavigate();

  const [passwordShow, setPasswordShow] = useState(true);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});

  const [formValues, setFormValues] = useState({
    companyname: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    phone: "",
  });

  const togglePasswordView = () => setPasswordShow((p) => !p);
  const toggleConfirmPasswordView = () =>
    setConfirmPasswordShow((p) => !p);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.companyname) newErrors.companyname = "Company name required";
    if (!formValues.username) newErrors.username = "Username required";
    if (!formValues.email) newErrors.email = "Email required";
    if (!formValues.password) newErrors.password = "Password required";
    if (formValues.password !== formValues.confirmpassword)
      newErrors.confirmpassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);
  setErrors({});

  try {
    // SIGNUP ONLY
    await axios.post("http://127.0.0.1:8000/api/employer/signup/", {
      companyname: formValues.companyname,
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
      phone: formValues.phone,
    });

    // SUCCESS → REDIRECT TO LOGIN
 navigate("/Job-portal/employer/login");

  } catch (err) {
    console.error(err.response?.data);

    setErrors(
      err.response?.data || { general: "Signup failed" }
    );
  } finally {
    setLoading(false);
  }
};



return (
    <div className="j-sign-up-page">
      <header className="j-sign-up-header">
        <Link to="/Job-portal" className="logo">
          <span className="logo-text">job portal</span>
          <span className='subtext'>for Employers</span>
        </Link>
        <div className="j-sign-up-header-links">
          <span className='no-account'>Already have an account?</span>
          <Link to="/Job-portal/employer/login" className="signup-btn">Login</Link>
          <div className="separator"></div>
          <Link to='/Job-portal/jobseeker/login' className="employer-redirect-link">Job seekers Login</Link>
        </div>
      </header>

      <div className="j-sign-up-body">
        <div className="signup-illustration">
          <img src={workTime} alt="Signup Illustration" />
        </div>

        <form onSubmit={handleSubmit} className="j-sign-up-form">
          <h2>Create an employer account</h2>

          <label>Company name</label>
          <input type="text" name="companyname" value={formValues.companyname} onChange={handleForm} placeholder="Enter your Company name or Organization's name" className={errors.companyname ? "input-error" : ""} />
          {errors.companyname && <span className="error-msg">{errors.companyname}</span>}

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

          <button className="j-sign-up-submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}
