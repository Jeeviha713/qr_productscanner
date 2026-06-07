import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "admin123") {
      alert("Login successful!");
      navigate("/admin-dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={pageWrapper}>

    
      <div className="card shadow-lg border-0" style={cardStyle}>
        
        <h3 className="text-center fw-bold mb-4" style={{ color: "#0d6efd" }}>
          Admin Login
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          
      
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

       
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={eyeIcon}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

      
          <button type="submit" className="btn btn-primary w-100 mt-2">
            Login
          </button>

      
          <div className="text-center mt-3">
            <Link to="/" style={{ textDecoration: "none", color: "#0d6efd" }}>
              ← Back to Home
            </Link>
          </div>

        </form>
      </div>

      <footer style={footerStyle}>
        <div className="container">
          © 2026 QR Product Tracker 
        </div>
      </footer>

    </div>
  );
}



const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #e3f2fd, #ffffff)"
};

const cardStyle = {
  width: "350px",
  padding: "30px",
  borderRadius: "16px",
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
};

const eyeIcon = {
  position: "absolute",
  right: "12px",
  top: "38px",
  cursor: "pointer",
  color: "#6c757d"
};

const footerStyle = {
  width: "100%",
  background: "#ffffff",
  borderTop: "1px solid #dee2e6",
  padding: "12px 0",
  textAlign: "center",
  fontSize: "14px",
  color: "#6c757d",
  position: "fixed",
  bottom: 0,
  left: 0,
  boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
  color:"black"
};