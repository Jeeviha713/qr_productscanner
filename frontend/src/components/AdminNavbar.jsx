import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./adminNavbar.css";

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/admin-login") return null;

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <>
    
      <nav className="navbar navbar-expand-lg admin-navbar">
        <div className="container d-flex justify-content-between align-items-center">

          <h4
            className="admin-logo"
            onClick={() => navigate("/admin-dashboard")}
          >
            Admin Panel
          </h4>

          <div className="d-flex align-items-center gap-3">

            <Link
              className={`nav-link admin-link ${
                location.pathname === "/admin-dashboard" ? "active-link" : ""
              }`}
              to="/admin-dashboard"
            >
              Dashboard
            </Link>

            <Link
              className={`nav-link admin-link ${
                location.pathname === "/add-product" ? "active-link" : ""
              }`}
              to="/add-product"
            >
              Add Product
            </Link>

            <button
              className="btn admin-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

  
      <footer className="admin-footer">
        <div className="container">
          © 2026 QR Product Tracker | Admin Panel
        </div>
      </footer>
    </>
  );
}