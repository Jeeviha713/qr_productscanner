import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import QRCode from "qrcode";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG / PNG allowed");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !description) {
      return alert("Fill all fields");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/products/${editId}`,
          formData
        );
        alert("Updated!");
      } else {
        await axios.post("http://localhost:5000/api/products", formData);
        alert("Added!");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  const handleEdit = (p) => {
    setName(p.name);
    setPrice(p.price);
    setDescription(p.description);
    setEditId(p._id);
    setPreview(`http://localhost:5000/uploads/${p.image}`);
  };

  const handleQR = async (p) => {
    if (p.qrValue) return;

    const qrValue = `PRODUCT-${p._id}-${Date.now()}`;
    const qrCode = await QRCode.toDataURL(qrValue);

    await axios.put(
      `http://localhost:5000/api/products/${p._id}/generate-qr`,
      { qrCode, qrValue }
    );

    fetchProducts();
  };

  return (
    <div style={pageStyle}>
      <AdminNavbar />

      <div className="container py-4">
        <div className="row g-4">

      
          <div className="col-md-4">
            <div style={cardStyle}>
              <h4 className="text-center mb-3" style={{ color: "#2563eb" }}>
                {editId ? "Update Product" : "Add Product"}
              </h4>

              <form onSubmit={handleSubmit}>

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    style={previewStyle}
                  />
                )}

                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  className="form-control mb-2"
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <input
                  type="file"
                  className="form-control mb-3"
                  onChange={handleFileChange}
                />

                <button className="btn btn-primary w-100">
                  {editId ? "Update" : "Add"}
                </button>
              </form>
            </div>
          </div>

      
          <div className="col-md-8">
            <div style={cardStyle}>
              <h4 className="text-center mb-3" style={{ color: "#2563eb" }}>
                Products
              </h4>

              <table className="table text-center align-middle">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>QR</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img
                          src={`http://localhost:5000/uploads/${p.image}`}
                          width="60"
                          style={{ borderRadius: "6px" }}
                        />
                      </td>

                      <td>{p.name}</td>
                      <td>₹{p.price}</td>

                      <td>
                        {p.qrCode ? (
                          <img src={p.qrCode} width="70" />
                        ) : (
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleQR(p)}
                          >
                            Generate
                          </button>
                        )}
                      </td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(p)}
                        >
                          ✏
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p._id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

   
      <footer style={footerStyle}>
        <div className="container">
          © 2026 QR Product Tracker | Admin Panel
        </div>
      </footer>
    </div>
  );
}



const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(to right, #eff6ff, #ffffff)"
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.08)"
};

const previewStyle = {
  width: "100%",
  borderRadius: "8px",
  marginBottom: "10px"
};

const footerStyle = {
  width: "100%",
  background: "#ffffff",
  borderTop: "1px solid #e5e7eb",
  padding: "12px 0",
  textAlign: "center",
  position: "fixed",
  bottom: 0
};