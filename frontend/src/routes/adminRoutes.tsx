import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";

// Lazy loaded admin components
const AdminProtectedRoute = lazy(() => import("@/components/admin/AdminProtectedRoute"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const VerificationQueue = lazy(() => import("@/pages/admin/VerificationQueue"));
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));
const EventApprovals = lazy(() => import("@/pages/admin/EventApprovals"));
const CurrentEvents = lazy(() => import("@/pages/admin/CurrentEvents"));
const PostsApproval = lazy(() => import("@/pages/admin/PostsApproval"));
const CurrentPosts = lazy(() => import("@/pages/admin/CurrentPosts"));
const Newsletters = lazy(() => import("@/pages/admin/Newsletters"));
const BannedUsers = lazy(() => import("@/pages/admin/BannedUsers"));
const CodeManagement = lazy(() => import("@/pages/admin/CodeManagement"));
const AlumniDatabase = lazy(() => import("@/pages/admin/AlumniDatabase"));
const Reports = lazy(() => import("@/pages/admin/Reports"));
const QueryManagement = lazy(() => import("@/pages/admin/QueryManagement"));
const GivingManagement = lazy(() => import("@/pages/admin/GivingManagement"));

export function AdminRoutes() {
  return (
    <>
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin-panel/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-panel/verification" element={<VerificationQueue />} />
        <Route path="/admin-panel/verifications" element={<VerificationQueue />} />
        <Route path="/admin-panel/users" element={<UserManagement />} />
        <Route path="/admin-panel/events" element={<EventApprovals />} />
        <Route path="/admin-panel/current-events" element={<CurrentEvents />} />
        <Route path="/admin-panel/posts-approval" element={<PostsApproval />} />
        <Route path="/admin-panel/current-posts" element={<CurrentPosts />} />
        <Route path="/admin-panel/newsletters" element={<Newsletters />} />
        <Route path="/admin-panel/banned" element={<BannedUsers />} />
        <Route path="/admin-panel/codes" element={<CodeManagement />} />
        <Route path="/admin-panel/alumni-database" element={<AlumniDatabase />} />
        <Route path="/admin-panel/reports" element={<Reports />} />
        <Route path="/admin-panel/queries" element={<QueryManagement />} />
        <Route path="/admin-panel/givings" element={<GivingManagement />} />
      </Route>
      
      <Route path="/admin-panel" element={<Navigate to="/admin-panel/dashboard" replace />} />
      <Route path="/admin-panel/login" element={<Navigate to="/login" replace />} />
    </>
  );
}
