import React, { useEffect, useState } from "react";
import axios from "axios";
import UserNavbar from "../components/UserNavbar";

export default function UserDashboard() {
  const email = localStorage.getItem("userEmail");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://qr-productscanner.onrender.com/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={pageStyle}>
      <UserNavbar />

  
      <div className="container mt-4" style={{ flex: 1 }}>

     
        <div className="mb-4">
          <h2>Welcome, {email}</h2>
          <p className="text-muted">Track and manage your products easily</p>
        </div>

     
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card shadow text-center p-3">
              <h5>Total Products</h5>
              <h2>{products.length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow text-center p-3">
              <h5>QR Generated</h5>
              <h2>{products.filter(p => p.qrCode).length}</h2>
            </div>
          </div>
        </div>

      
        <div className="mb-4">
          <h4>Quick Actions</h4>
          <div className="d-flex gap-3 mt-2">
            <a href="/user-products" className="btn btn-primary">
              View Products
            </a>
          </div>
        </div>

      </div>

      <footer style={footerStyle}>
        <div className="container text-center">
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} QR Product Tracker 
          </p>
          
        </div>
      </footer>

    </div>
  );
}




const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(to right, #eff6ff, #ffffff)"
};

const footerStyle = {
  marginTop: "auto",
  padding: "20px 0",
  backgroundColor: "white",
  color: "black"
};