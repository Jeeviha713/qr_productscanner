import React from "react";
import "./hero.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
 

      <section className="hero-section">
        <div className="container hero-card">
          <div className="row align-items-center">

       
            <div className="col-md-6">
              <h1 className="hero-title">
                QR Product <br /> Tracker
              </h1>

              <p className="hero-text">
                Easily manage and track your products using QR codes.
              </p>

              <button
                className="hero-btn"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </div>

       
            <div className="col-md-6 text-center">
              <img
                src="/assets/main.png"
                alt="QR"
                className="hero-img"
              />
            </div>

          </div>
        </div>

      
        <div className="wave">
          <svg viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              d="M0,224L60,213.3C120,203,240,181,360,165.3C480,149,600,139,720,144C840,149,960,171,1080,192C1200,213,1320,235,1380,245.3L1440,256V320H0Z"
            ></path>
          </svg>
        </div>
      </section>

    
      <section className="container text-center py-5">
        <h2 className="fw-bold mb-4">Features</h2>

        <div className="row">

          <div className="col-md-4">
            <div className="feature-card">
              <h5>QR Tracking</h5>
              <p>Track products easily using QR codes.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <h5>Secure Data</h5>
              <p>Your product data is safe and secure.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <h5>Fast Access</h5>
              <p>Quickly view product details anytime.</p>
            </div>
          </div>

        </div>
      </section>

   
      <footer className="bg-white text-dark text-center py-3">
        <p>© 2026 QR Product Tracker</p>
      </footer>
    </>
  );
}