import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import confirm_password from "../assets/ConfirmPassword.png"
import eye from '../assets/show_password.png'
import eyeHide from '../assets/eye-hide.png'
import axios from 'axios';

export const Ecreatepassword = () => {
  const [passwordShow, setPasswordShow] = useState(true)
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
   

  const [confirmPasswordShow, setconfirmPasswordShow] = useState(true)
  
  const togglePasswordView = () => {
    setPasswordShow((prev) => !prev)
   }

  const toggleConfirmPasswordView = () => {
    setconfirmPasswordShow((prev) => !prev)
   }

  const initialValues = { newPassword: "", confirmPassword: "" }

  const [formValues, setFormValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleForm = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formValues.newPassword.trim()) {
      newErrors.newPassword = "Password is required"
    } else if (formValues.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }

    if (!formValues.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required"
    } else if (formValues.confirmPassword.length < 8) {
      newErrors.confirmPassword = "Password must be at least 8 characters"
    } else if (formValues.confirmPassword !== formValues.newPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async (e) => {
    

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/employer/reset-password/",
        {
          user_id: userId,
          email: formValues.email,
          new_password: formValues.newPassword,
        }
      );

      setSuccessMsg(res.data.message);

      setTimeout(() => {
        navigate("/Job-portal/employer/login");
      }, 2000);

    } catch (err) {
      setErrors(
        err.response?.data || { general: "Password reset failed" }
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="j-create-password-page">
      <header className="j-create-password-header">
        <Link to="/Job-portal" className="logo">
          <span className="logo-text">job portal</span>
          <span className='subtext'>for Employers</span>
        </Link>
        <div className="j-create-password-header-links">
          <span className='no-account'>Create a new account?</span>
          <Link to="/Job-portal/employer/signup" className="signup-btn">Create</Link>
        </div>
      </header>
      <div className='j-create-password-login-body'>
        <div className="create-password-illustration">
          <img src={confirm_password} alt="create password Illustration" />
        </div>
        <form onSubmit={handleSubmit} className="create-password-form">
          <h2>Create a New Password</h2>

          <label>New Password</label>
          <div className="password-wrapper">
            <input type={passwordShow ? "password" : "text"} placeholder="Enter new password" name="newPassword"
              value={formValues.newPassword}
              onChange={handleForm}
              className={errors.newPassword ? "input-error" : ""} />
              <span className="eye-icon" onClick={togglePasswordView}><img src={passwordShow ? eye : eyeHide} className='show-icon' alt='show' /></span>
          </div>
          {errors.newPassword && <span className="error-msg">{errors.newPassword}</span>}

          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input type={confirmPasswordShow ? "password" : "text"} placeholder="Re-enter new password" name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleForm}
              className={errors.confirmPassword ? "input-error" : ""} />
            <span className="eye-icon" onClick={toggleConfirmPasswordView}><img src={confirmPasswordShow ? eye : eyeHide} className='show-icon' alt='show' /></span>
          </div>
          {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}

          <button className="j-reset-link-btn">Reset Password</button>

          <div className='center-div-text'>
            <p>Remember your password? <Link to="/Job-portal/employer/login" className='j-password-form-login-link'>Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

