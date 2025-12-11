import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import { LinearProgress, Box } from "@mui/material";

export default function ProtectedRoute({ allowedRole }) {
  const { user, loading } = useAuth();

  // Still checking session
  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  // User not logged in → redirect based on which role is required
  if (!user) {
    const loginPath =
      allowedRole === "event-manager"
        ? "/event-manager/login"
        : "/organization/login";

    return <Navigate to={loginPath} replace />;
  }

  // User logged in but role doesn't match → block access
  if (allowedRole && user.role !== allowedRole) {
    const correctDashboard =
      user.role === "event-manager"
        ? "/event-manager/dashboard"
        : "/organization/dashboard";

    return <Navigate to={correctDashboard} replace />;
  }

  // All good → allow access to route
  return <Outlet />;
}
