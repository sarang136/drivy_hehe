import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("auth_token");
  const location = useLocation();


  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/admin-login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
