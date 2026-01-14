import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../helper/Context";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useContext(Context);

  // Check if user is authenticated
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to default page based on role
    if (user.role === 'admin') {
      return <Navigate to="/upload" replace />;
    } else if (user.role === 'expert') {
      return <Navigate to="/expert" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
