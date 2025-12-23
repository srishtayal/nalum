import { useEffect, useState, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedVerificationRoute from "@/components/ProtectedVerificationRoute";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { startKeepAlive, stopKeepAlive } from "@/lib/keepAlive";
import { ChatProvider } from "@/context/ChatContext";

// Lazy loaded components
const HomePage = lazy(() => import("@/pages/HomePage"));
const Login = lazy(() => import("@/pages/auth/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const OtpVerificationPage = lazy(() => import("@/pages/auth/OtpVerificationPage"));
const ProfileForm = lazy(() => import("@/pages/auth/ProfileForm"));
const DashboardLayout = lazy(() => import("@/pages/dashboard/DashboardLayout"));
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const ShowProfile = lazy(() => import("@/pages/dashboard/showProfile"));
const UpdateProfile = lazy(() => import("@/pages/dashboard/updateProfile"));
const AlumniDirectory = lazy(() => import("@/pages/dashboard/alumniDirectory"));
const ViewProfile = lazy(() => import("@/pages/dashboard/viewProfile"));
const ConnectionsPage = lazy(() => import("@/pages/dashboard/ConnectionsPage"));
const VerifyAlumni = lazy(() => import("@/pages/dashboard/verifyAlumni"));
const ChatPage = lazy(() => import("@/pages/dashboard/chat/ChatPage").then(module => ({ default: module.ChatPage })));
const Events = lazy(() => import("@/pages/dashboard/Events"));
const HostEvent = lazy(() => import("@/pages/dashboard/HostEvent"));
const MyPosts = lazy(() => import("@/pages/dashboard/MyPosts"));
const Root = lazy(() => import("@/pages/Root"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const AdminProtectedRoute = lazy(() => import("./components/admin/AdminProtectedRoute"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const VerificationQueue = lazy(() => import("./pages/admin/VerificationQueue"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const EventApprovals = lazy(() => import("./pages/admin/EventApprovals"));
const CurrentEvents = lazy(() => import("./pages/admin/CurrentEvents"));
const PostsApproval = lazy(() => import("./pages/admin/PostsApproval"));
const CurrentPosts = lazy(() => import("./pages/admin/CurrentPosts"));
const Newsletters = lazy(() => import("./pages/admin/Newsletters"));
const BannedUsers = lazy(() => import("./pages/admin/BannedUsers"));
const CodeManagement = lazy(() => import("./pages/admin/CodeManagement"));
const AlumniDatabase = lazy(() => import("./pages/admin/AlumniDatabase"));
const NotableAlumni = lazy(() => import("./pages/stories/notableAlumni"));
const ClubsPage = lazy(() => import("./pages/communities/clubs"));
const LearningPage = lazy(() => import("./pages/benefits/learning"));

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

// Loading Screen Component (Shown during session restoration)
function SessionLoadingScreen() {
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
  const [showAnimation, setShowAnimation] = useState(() => {
    // Only show if user hasn't seen it this session
    return !sessionStorage.getItem("nalumHasVisited");
  });
  const [isContentReady, setIsContentReady] = useState(false);

  // Mark content as ready after session restoration completes
  useEffect(() => {
    if (!isRestoringSession && !isContentReady) {
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => setIsContentReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isRestoringSession, isContentReady]);

  if (showAnimation) {
    return (
      <LoadingAnimation
        onAnimationComplete={() => setShowAnimation(false)}
        isContentReady={isContentReady}
      />
    );
  }

  if (isRestoringSession) {
    return <SessionLoadingScreen />;
  }

  return (
    <>
      <AuthErrorHandler />
      <TooltipProvider>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingAnimation isContentReady={true} /></div>}>
          <Routes>
            {/* Main App Routes */}
            <Route path="/" element={<Root />}>
              <Route index element={<HomePage />} />
              <Route path="/stories/notable-alumni" element={<NotableAlumni />} />
              <Route path="/communities/clubs" element={<ClubsPage />} />
              <Route path="/benefits/learning" element={<LearningPage />} />
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
                    <ChatProvider>
                      <DashboardLayout />
                    </ChatProvider>
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
              <Route
                path="/dashboard/chat/*"
                element={
                  <Routes>
                    <Route index element={<ChatPage />} />
                    <Route path=":conversationId" element={<ChatPage />} />
                  </Routes>
                }
              />
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
              <Route
                path="/admin-panel/current-events"
                element={<CurrentEvents />}
              />
              <Route
                path="/admin-panel/posts-approval"
                element={<PostsApproval />}
              />
              <Route path="/admin-panel/current-posts" element={<CurrentPosts />} />
              <Route path="/admin-panel/newsletters" element={<Newsletters />} />
              <Route path="/admin-panel/banned" element={<BannedUsers />} />
              <Route path="/admin-panel/codes" element={<CodeManagement />} />
              <Route
                path="/admin-panel/alumni-database"
                element={<AlumniDatabase />}
              />
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
        </Suspense>
        <Toaster />
      </TooltipProvider>
    </>
  );
}

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
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
