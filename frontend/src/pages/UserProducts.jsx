import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import UserNavbar from "../components/UserNavbar";
import { Html5Qrcode } from "html5-qrcode";

export default function UserProducts() {
  const [products, setProducts] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [matchedProduct, setMatchedProduct] = useState(null);
  const [scanMessage, setScanMessage] = useState("");
  const [lastScanned, setLastScanned] = useState("");

  const qrScannerRef = useRef(null);
  const scannerStartedRef = useRef(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (scannerOpen) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [scannerOpen]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SAFE START
  const startScanner = async () => {
    try {
      if (scannerStartedRef.current) return;

      setScanMessage("");
      setMatchedProduct(null);

      // 🔥 SAFE CLEAR OLD SCANNER
      if (qrScannerRef.current) {
        const state = qrScannerRef.current.getState();

        if (state === 2) {
          await qrScannerRef.current.stop();
        }

        await qrScannerRef.current.clear();
        qrScannerRef.current = null;
      }

      qrScannerRef.current = new Html5Qrcode("reader");

      const devices = await Html5Qrcode.getCameras();

      if (!devices.length) {
        setScanMessage("No camera found");
        return;
      }

      const cameraId = devices[0].id;

      scannerStartedRef.current = true;

      await qrScannerRef.current.start(
        cameraId,
        { fps: 10, qrbox: { width: 220, height: 220 } },
        handleScanSuccess
      );

    } catch (err) {
      console.error(err);
      scannerStartedRef.current = false;
      setScanMessage("Camera error / allow permission");
    }
  };

  // ✅ SAFE STOP (MAIN FIX)
  const stopScanner = async () => {
    try {
      if (qrScannerRef.current) {
        const state = qrScannerRef.current.getState();

        if (state === 2) {
          await qrScannerRef.current.stop();
        }

        await qrScannerRef.current.clear();
        qrScannerRef.current = null;
      }

      scannerStartedRef.current = false;
    } catch (err) {
      console.warn("Stop ignored:", err.message);
    }
  };

  const closeScannerModal = async () => {
    await stopScanner();

    setScannerOpen(false);
    setMatchedProduct(null);
    setScanMessage("");
    setLastScanned("");
  };

  const handleScanSuccess = (decodedText) => {
    if (decodedText === lastScanned) return;

    setLastScanned(decodedText);

    const product = products.find(p => p.qrValue === decodedText);

    if (!product) {
      setScanMessage("Invalid QR");
      setTimeout(() => setLastScanned(""), 1000);
      return;
    }

    setMatchedProduct(product);
    setScanMessage("");
  };

  const handleBuyNow = async () => {
    const res = await axios.put(
      `http://localhost:5000/api/products/${matchedProduct._id}/purchase`
    );

    alert(res.data.message);

    const updated = res.data.product;

    setProducts(prev =>
      prev.map(p => p._id === updated._id ? updated : p)
    );

    setMatchedProduct(updated);
  };

  return (
    <div style={pageStyle}>
      <UserNavbar />

      <div className="container mt-4" style={{ paddingBottom: "90px" }}>
        <h2 className="text-center mb-4 fw-bold">Products</h2>

        <table className="table table-bordered text-center shadow">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>
                  <img
                    src={`http://localhost:5000/uploads/${p.image}`}
                    width="60"
                    height="60"
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                  />
                </td>

                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.description}</td>

                <td>
                  {p.status === 2 ? (
                    <span className="badge bg-success">Purchased</span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Not Purchased
                    </span>
                  )}
                </td>

                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => setSelectedQR(p.qrCode)}
                  >
                    View QR
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setScannerOpen(true)}
                  >
                    Scan QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR VIEW */}
      {selectedQR && (
        <div style={overlay}>
          <div style={modal}>
            <h5>QR Code</h5>
            <img src={selectedQR} style={{ width: "200px" }} />
            <button
              className="btn btn-danger w-100 mt-4"
              onClick={() => setSelectedQR(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SCANNER */}
      {scannerOpen && (
        <div style={overlay}>
          <div style={modalLarge}>
            <h4 style={{ color: "#1e3a8a" }}>Scan QR Code</h4>

            {!matchedProduct && (
              <>
                <div style={scannerWrapper}>
                  <div id="reader" style={reader}></div>
                </div>

                {scanMessage && (
                  <p style={{ color: "red" }}>{scanMessage}</p>
                )}

                <button
                  className="btn btn-secondary w-100 mt-3"
                  onClick={closeScannerModal}
                >
                  Close
                </button>
              </>
            )}

            {matchedProduct && (
              <div style={productCard}>
                <img
                  src={`http://localhost:5000/uploads/${matchedProduct.image}`}
                  style={productImg}
                />

                <div style={detailsBox}>
                  <p><b>Name :</b> {matchedProduct.name}</p>
                  <p><b>Price :</b> ₹{matchedProduct.price}</p>
                  <p><b>Description :</b> {matchedProduct.description}</p>
                </div>

                {matchedProduct.status === 2 ? (
                  <button className="btn btn-success w-100 mt-2" disabled>
                    Already Purchased
                  </button>
                ) : (
                  <button
                    className="btn btn-primary w-100 mt-2"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                )}

                <button
                  className="btn btn-danger w-100 mt-2"
                  onClick={closeScannerModal}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(to right, #eff6ff, #ffffff)"
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modal = {
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  textAlign: "center",
  width: "320px"
};

const modalLarge = {
  background: "#fff",
  padding: "30px",
  borderRadius: "18px",
  textAlign: "center",
  width: "380px"
};

const scannerWrapper = {
  width: "260px",
  height: "260px",
  margin: "auto"
};

const reader = {
  width: "100%",
  height: "100%"
};

const productCard = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const productImg = {
  width: "140px",
  height: "140px",
  objectFit: "cover",
  borderRadius: "12px"
};

const detailsBox = {
  textAlign: "left",
  width: "100%",
  marginTop: "10px",
  padding: "10px",
  background: "#f8fafc",
  borderRadius: "10px"
};