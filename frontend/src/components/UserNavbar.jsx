import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function UserNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#2563eb" : "#374151",
    textDecoration: "none",
    fontWeight: isActive ? "600" : "500",
    padding: "6px 10px",
    borderBottom: isActive ? "2px solid #2563eb" : "none",
    transition: "0.3s"
  });

  return (
    <nav style={navbarStyle}>
    
      <h4 style={logoStyle} onClick={() => navigate("/user-dashboard")}>
        User Panel
      </h4>

   
      <div style={navRight}>

        <NavLink to="/user-dashboard" style={linkStyle}>
          Dashboard
        </NavLink>

        <NavLink to="/user-products" style={linkStyle}>
          Products
        </NavLink>

        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>

      </div>
    </nav>
  );
}



const navbarStyle = {
  background: "#ffffff",
  padding: "14px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
 
};

const logoStyle = {
  color: "#2563eb",
  margin: 0,
  fontWeight: "700",
  cursor: "pointer",
  letterSpacing: "0.5px",
  
};

const navRight = {
  display: "flex",
  alignItems: "center",
  gap: "20px"
};

const logoutBtn = {
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  padding: "6px 16px",
  borderRadius: "20px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.3s"
}; 