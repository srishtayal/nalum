import { lazy } from "react";
import { Route } from "react-router-dom";

// Lazy loaded auth pages
const Login = lazy(() => import("@/pages/auth/Login"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const OtpVerificationPage = lazy(() => import("@/pages/auth/OtpVerificationPage"));
const ProfileForm = lazy(() => import("@/pages/auth/ProfileForm"));

export function AuthRoutes() {
  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/otp-verification" element={<OtpVerificationPage />} />
      <Route path="/profile-form" element={<ProfileForm />} />
    </>
  );
}
