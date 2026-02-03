import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import manSitting from "../assets/Illustration_1.png";
import eye from "../assets/show_password.png";
import eyeHide from "../assets/eye-hide.png";
import "./Elogin.css";

export const Elogin = () => {
  const navigate = useNavigate(); // ✅ FIX 1

  const [passwordShow, setPasswordShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const togglePasswordView = () => {
    setPasswordShow((prev) => !prev);
  };

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formValues.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ FIX 2 – correct submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/employer/login/",
        {
          username: formValues.username,
          password: formValues.password,
        }
      );

      // ✅ Save tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", res.data.username);

      // ✅ Redirect after login
      navigate("/Job-portal/employer/dashboard");
    } catch (err) {
      setErrors({
        general: "Invalid username or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <Link to="/Job-portal" className="logo">
          <span className="logo-text">job portal</span>
          <span className="subtext">for Employers</span>
        </Link>
        <div className="header-links">
          <span className="no-account">Don’t have an account?</span>
          <Link to="/Job-portal/employer/signup" className="signup-btn">
            Create
          </Link>
          <div className="separator"></div>
          <Link
            to="/Job-portal/jobseeker/login"
            className="employer-redirect-link"
          >
            Job seekers Login
          </Link>
        </div>
      </header>

      <div className="login-body">
        <div className="login-illustration">
          <img src={manSitting} alt="Login Illustration" />
        </div>

        {/* ✅ FIX 3 – use onSubmit, NOT action */}
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login to continue</h2>

          {errors.general && (
            <span className="error-msg">{errors.general}</span>
          )}

          <label>User name</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formValues.username}
            onChange={handleForm}
            className={errors.username ? "input-error" : ""}
          />
          {errors.username && (
            <span className="error-msg">{errors.username}</span>
          )}

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={passwordShow ? "password" : "text"}
              name="password"
              placeholder="Enter your password"
              value={formValues.password}
              onChange={handleForm}
              className={errors.password ? "input-error" : ""}
            />
            <span className="eye-icon" onClick={togglePasswordView}>
              <img
                src={passwordShow ? eye : eyeHide}
                className="show-icon"
                alt="toggle"
              />
            </span>
          </div>
          {errors.password && (
            <span className="error-msg">{errors.password}</span>
          )}

          <div className="form-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link
              to="/Job-portal/employer/login/forgotpassword"
              className="forgot-password"
            >
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="j-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
