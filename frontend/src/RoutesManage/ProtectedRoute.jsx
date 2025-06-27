import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // console.log("ProtectedRoute - Auth state:", { isAuthenticated, loading });

  if (loading) {
    return <div>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    // console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // console.log("Authenticated, rendering protected content");
  return <Outlet />;
};

export default ProtectedRoute;
