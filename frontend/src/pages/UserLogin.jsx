import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";

export default function UserLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      alert(data.message);

      if (data.message === "Login Success") {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", form.email);
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">
          Login to continue tracking your products
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="login-input"
          onChange={handleChange}
          value={form.email}
        />

      
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="login-input"
            onChange={handleChange}
            value={form.password}
          />

          <span
            className="eye-icon1"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="login-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>

     
      <footer className="login-bottom-footer">
        <div className="container">
          © 2026 QR Product Tracker
        </div>
      </footer>

    </div>
  );
}