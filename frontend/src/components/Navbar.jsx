import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
    
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container d-flex justify-content-between align-items-center">

       
          <h4
            className="logo"
            onClick={() => navigate("/")}
          >
            QR Tracker
          </h4>

      
          <div className="nav-buttons">

            <button
              className="btn btn-outline-primary custom-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="btn btn-outline-primary custom-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>

            <button
              className="btn btn-outline-primary custom-btn"
              onClick={() => navigate("/admin-login")}
            >
              Admin
            </button>

          </div>

        </div>
      </nav>


      {location.pathname !== "/" && (
        <button
          className="floating-back"
          onClick={() => navigate("/")}
        >
          ⟵
        </button>
      )}
    </>
  );
}