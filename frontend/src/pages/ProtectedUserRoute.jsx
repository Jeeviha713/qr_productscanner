import { Navigate } from "react-router-dom";

export default function ProtectedUserRoute({ children }) {
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}