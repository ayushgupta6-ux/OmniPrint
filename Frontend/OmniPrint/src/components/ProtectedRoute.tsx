import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const token = localStorage.getItem("jwt_token");

  // 1. If there is no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
 
  return <Outlet />;
}