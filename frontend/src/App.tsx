import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedVerificationRoute from "@/components/ProtectedVerificationRoute";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/NotFound";
import OtpVerificationPage from "@/pages/auth/OtpVerificationPage";
import ProfileForm from "@/pages/auth/ProfileForm";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import ShowProfile from "@/pages/dashboard/showProfile";
import UpdateProfile from "@/pages/dashboard/updateProfile";
import AlumniDirectory from "@/pages/dashboard/alumniDirectory";
import ViewProfile from "@/pages/dashboard/viewProfile";
import ConnectionsPage from "@/pages/dashboard/ConnectionsPage";
import VerifyAlumni from "@/pages/dashboard/verifyAlumni";
import { ChatPage } from "@/pages/dashboard/chat/ChatPage";
import Events from "@/pages/dashboard/Events";
import HostEvent from "@/pages/dashboard/HostEvent";
import MyPosts from "@/pages/dashboard/MyPosts";
import Root from "@/pages/Root";
import SignUp from "@/pages/auth/SignUp";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VerificationQueue from "./pages/admin/VerificationQueue";
import UserManagement from "./pages/admin/UserManagement";
import EventApprovals from "./pages/admin/EventApprovals";
import CurrentEvents from "./pages/admin/CurrentEvents";
import Newsletters from "./pages/admin/Newsletters";
import BannedUsers from "./pages/admin/BannedUsers";
import CodeManagement from "./pages/admin/CodeManagement";
import AlumniDatabase from "./pages/admin/AlumniDatabase";
import NotableAlumni from "./pages/stories/notableAlumni";
import { startKeepAlive, stopKeepAlive } from "@/lib/keepAlive";

const queryClient = new QueryClient();

// Auth Error Handler Component
function AuthErrorHandler() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleAuthError = () => {
      logout();
      toast.error("Session Expired", {
        description: "Your session has expired. Please log in again.",
        style: {
          background: "#800000",
          color: "white",
          border: "2px solid #FFD700",
          fontSize: "16px",
        },
        classNames: {
          title: "text-xl font-bold text-white",
          description: "text-base text-white",
        },
      });
      navigate("/login");
    };

    window.addEventListener("auth-error", handleAuthError);
    return () => window.removeEventListener("auth-error", handleAuthError);
  }, [logout, navigate]);

  return null;
}

// Loading Screen Component
function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#800000] border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg">Restoring your session...</p>
      </div>
    </div>
  );
}

// App Content with Session Check
function AppContent() {
  const { isRestoringSession } = useAuth();

  if (isRestoringSession) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AuthErrorHandler />
      <Routes>
        {/* Main App Routes */}
        <Route path="/" element={<Root />}>
          <Route index element={<HomePage />} />
          <Route path="/stories/notable-alumni" element={<NotableAlumni />} />
        </Route>

        {/* Auth Routes (without header/footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
        <Route path="/profile-form" element={<ProfileForm />} />

        {/* Verification Route - requires auth but not verification */}
        <Route
          path="/dashboard/verify-alumni"
          element={
            <ProtectedRoute>
              <VerifyAlumni />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard Routes - require verification */}
        <Route
          element={
            <ProtectedRoute>
              <ProtectedVerificationRoute>
                <DashboardLayout />
              </ProtectedVerificationRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/profile" element={<ShowProfile />} />
          <Route path="/dashboard/update-profile" element={<UpdateProfile />} />
          <Route path="/dashboard/alumni" element={<AlumniDirectory />} />
          <Route path="/dashboard/alumni/:userId" element={<ViewProfile />} />
          <Route path="/dashboard/connections" element={<ConnectionsPage />} />
          <Route path="/dashboard/chat" element={<ChatPage />} />
          <Route path="/dashboard/chat/:conversationId" element={<ChatPage />} />
          <Route path="/dashboard/events" element={<Events />} />
          <Route path="/dashboard/posts" element={<MyPosts />} />
          <Route path="/dashboard/host-event" element={<HostEvent />} />
        </Route>

        {/* Admin Panel Routes - Use main login, role-based access */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin-panel/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin-panel/verification"
            element={<VerificationQueue />}
          />
          <Route
            path="/admin-panel/verifications"
            element={<VerificationQueue />}
          />
          <Route path="/admin-panel/users" element={<UserManagement />} />
          <Route path="/admin-panel/events" element={<EventApprovals />} />
          <Route path="/admin-panel/current-events" element={<CurrentEvents />} />
          <Route path="/admin-panel/newsletters" element={<Newsletters />} />
          <Route path="/admin-panel/banned" element={<BannedUsers />} />
          <Route path="/admin-panel/codes" element={<CodeManagement />} />
          <Route path="/admin-panel/alumni-database" element={<AlumniDatabase />} />
        </Route>
        <Route
          path="/admin-panel"
          element={<Navigate to="/admin-panel/dashboard" replace />}
        />
        <Route
          path="/admin-panel/login"
          element={<Navigate to="/login" replace />}
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

import { ChatProvider } from "@/context/ChatContext";

// ... (existing imports)

function App() {
  useEffect(() => {
    // Start keep-alive when app mounts
    startKeepAlive();

    // Cleanup on unmount
    return () => {
      stopKeepAlive();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
