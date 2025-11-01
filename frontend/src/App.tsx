import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import ProfileForm from "./pages/ProfileForm";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

// Admin imports
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VerificationQueue from "./pages/admin/VerificationQueue";
import UserManagement from "./pages/admin/UserManagement";
import EventApprovals from "./pages/admin/EventApprovals";
import Newsletters from "./pages/admin/Newsletters";
import BannedUsers from "./pages/admin/BannedUsers";

const App = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const handleAuthError = () => {
      logout();
    };

    window.addEventListener("auth-error", handleAuthError);

    return () => {
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, [logout]);

  return (
    <Routes>
      {/* Regular User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
      <Route path="/profile-form" element={<ProfileForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Index />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/otp-verification" element={<OtpVerificationPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin-panel/*"
        element={
          <AdminAuthProvider>
            <Routes>
              <Route path="/login" element={<AdminLogin />} />
              <Route element={<AdminProtectedRoute />}>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/verification" element={<VerificationQueue />} />
                <Route path="/verifications" element={<VerificationQueue />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/events" element={<EventApprovals />} />
                <Route path="/newsletters" element={<Newsletters />} />
                <Route path="/banned" element={<BannedUsers />} />
              </Route>
              <Route path="/" element={<Navigate to="/admin-panel/dashboard" replace />} />
            </Routes>
          </AdminAuthProvider>
        }
      />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;