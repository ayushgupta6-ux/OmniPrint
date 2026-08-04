import { Navigate, Outlet } from "react-router";

export default function VendorRoute() {
  const token = localStorage.getItem("jwt_token");

  // 1. If there is no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 2. Decode the JWT payload (the middle part of the token)
    // This uses built-in browser functions, no extra libraries needed
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decodedToken = JSON.parse(jsonPayload);

    console.log("Decoded Token:", decodedToken); // For debugging purposes
    // 3. Check if the role is VENDOR (Adjust 'role' if your backend uses a different claim key)
    if (decodedToken.role !== "PRINT_AGENCY") {
      alert("Access Denied: You must be a vendor to view this page.");
      return <Navigate to="/" replace />; 
    }

  } catch (error) {
    // If the token is malformed or decoding fails, force them to log in again
    console.error("Invalid token format");
    localStorage.removeItem("jwt_token"); // Clear the invalid token
    return <Navigate to="/login" replace />;
  }

  // 4. If everything is valid, render the child routes (the Admin pages)
  return <Outlet />;
}