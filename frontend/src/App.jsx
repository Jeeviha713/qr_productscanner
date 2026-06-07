import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import ProtectedUserRoute from "./pages/ProtectedUserRoute";
import UserDashboard from "./pages/UserDashboard";
import UserProducts from "./pages/UserProducts";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";

function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/admin-login" ||
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/add-product" ||
    location.pathname === "/user-dashboard" ||
    location.pathname === "/user-products";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedUserRoute>
              <UserDashboard />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/user-products"
          element={
            <ProtectedUserRoute>
              <UserProducts />
            </ProtectedUserRoute>
          }
        />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;