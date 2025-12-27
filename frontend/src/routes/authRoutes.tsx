import { lazy } from "react";
import { Route } from "react-router-dom";

// Lazy loaded auth pages
const Login = lazy(() => import("@/pages/auth/Login"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const OtpVerificationPage = lazy(() => import("@/pages/auth/OtpVerificationPage"));
const ProfileForm = lazy(() => import("@/pages/auth/ProfileForm"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));

export function AuthRoutes() {
  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/otp-verification" element={<OtpVerificationPage />} />
      <Route path="/profile-form" element={<ProfileForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </>
  );
}
