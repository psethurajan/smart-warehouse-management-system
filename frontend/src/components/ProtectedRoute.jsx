import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Blocks a page if the user is not logged in, or not in the allowed roles list.
// Usage: <ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
