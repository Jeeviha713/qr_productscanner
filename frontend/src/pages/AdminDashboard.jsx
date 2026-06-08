import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [activeQrCount, setActiveQrCount] = useState(0);
  const [usedQrCount, setUsedQrCount] = useState(0);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://qr-productscanner.onrender.com/api/products");
      const productData = Array.isArray(res.data) ? res.data : [];
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
  
    const used = products.filter((p) => Number(p.status) === 2).length;

 
    const active = products.filter((p) => Number(p.status) !== 2).length;

    setUsedQrCount(used);
    setActiveQrCount(active);

    console.log("Products:", products);
    console.log("Active QR:", active);
    console.log("Used QR:", used);
  }, [products]);

  return (
    <div style={pageStyle}>
      <AdminNavbar />

      <div className="container py-4">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#2563eb" }}>
          Admin Dashboard
        </h2>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div style={cardStyle}>
              <div style={iconCircle}>📦</div>
              <h5 style={cardTitle}>Total Products</h5>
              <h2 style={cardNumber}>{products.length}</h2>
              <p style={cardText}>All products added in the system</p>
            </div>
          </div>

          <div className="col-md-4">
            <div style={cardStyle}>
              <div style={iconCircle}>✅</div>
              <h5 style={cardTitle}>Active QR</h5>
              <h2 style={cardNumber}>{activeQrCount}</h2>
              <p style={cardText}>Products available for purchase</p>
            </div>
          </div>

          <div className="col-md-4">
            <div style={cardStyle}>
              <div style={iconCircle}>🛒</div>
              <h5 style={cardTitle}>Used QR</h5>
              <h2 style={cardNumber}>{usedQrCount}</h2>
              <p style={cardText}>Products already purchased</p>
            </div>
          </div>
        </div>

        <div style={tableWrapper}>
          <div style={tableHeader}>
            <h4 className="mb-0" style={{ color: "#1e3a8a" }}>
              Product Overview
            </h4>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th style={thStyle}>S.NO</th>
                  <th style={thStyle}>Product Name</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>QR Status</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product._id || index}>
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdStyle}>{product.name}</td>
                      <td style={tdStyle}>₹{product.price}</td>
                      <td style={tdStyle}>{product.description}</td>
                      <td style={tdStyle}>
                        {Number(product.status) === 2 ? (
                          <span style={usedBadge}>Used</span>
                        ) : (
                          <span style={activeBadge}>Active</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#eff6ff"
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "18px",
  padding: "24px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.08)",
  border: "1px solid #dbeafe",
  height: "100%"
};

const iconCircle = {
  width: "58px",
  height: "58px",
  margin: "0 auto 14px",
  borderRadius: "50%",
  background: "#dbeafe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px"
};

const cardTitle = {
  color: "#1e3a8a",
  fontWeight: "600",
  marginBottom: "10px"
};

const cardNumber = {
  color: "#2563eb",
  fontWeight: "700",
  marginBottom: "8px"
};

const cardText = {
  color: "#64748b",
  fontSize: "14px",
  marginBottom: 0
};

const tableWrapper = {
  background: "#ffffff",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.08)",
  border: "1px solid #dbeafe"
};

const tableHeader = {
  padding: "18px 20px",
  background: "#eff6ff",
  borderBottom: "1px solid #dbeafe"
};

const thStyle = {
  background: "#f8fbff",
  color: "#1e3a8a",
  fontWeight: "600",
  padding: "14px"
};

const tdStyle = {
  padding: "14px",
  color: "#334155",
  verticalAlign: "middle"
};

const activeBadge = {
  background: "#dbeafe",
  color: "#1d4ed8",
  padding: "6px 14px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "600"
};

const usedBadge = {
  background: "#dcfce7",
  color: "#15803d",
  padding: "6px 14px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "600"
};