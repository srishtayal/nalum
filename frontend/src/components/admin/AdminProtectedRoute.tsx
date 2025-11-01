import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  console.log("[AdminProtectedRoute] Auth state:", { isAuthenticated, isLoading });

  if (isLoading) {
    console.log("[AdminProtectedRoute] Showing loading state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("[AdminProtectedRoute] Not authenticated, redirecting to login");
  } else {
    console.log("[AdminProtectedRoute] Authenticated, rendering Outlet");
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin-panel/login" replace />;
};

export default AdminProtectedRoute;
