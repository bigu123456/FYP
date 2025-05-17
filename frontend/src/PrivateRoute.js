import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token); // Decode the token here

    // Check if the token has expired
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      return <Navigate to="/login" replace />;
    }

    // Check if user is an admin
    if (decodedToken.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Invalid Token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
