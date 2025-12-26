import EmailVerification from "@/components/signup/EmailVerification";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import nsutLogo from "@/assets/nsut-logo.svg";
import nsutCampusHero from "@/assets/hero.webp";

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [verified, setVerified] = useState(false);

  const handleEmailVerified = () => {
    setVerified(true);
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 pt-16 lg:pt-0">
      {/* Left Column: Image */}
      <div className="relative hidden lg:flex flex-col items-start justify-between p-10">
        <img
          src={nsutCampusHero}
          alt="NSUT Campus"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <Link to="/" className="relative z-10 flex items-center gap-3 text-white">
          <img src={nsutLogo} alt="NSUT Logo" width="40" height="40" className="h-10 w-10 invert" />
          <span className="text-2xl font-serif font-semibold">NALUM</span>
        </Link>
        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-serif font-bold">
            Almost There!
          </h1>
          <p className="mt-2 max-w-md text-lg text-white/80">
            Verify your email address to complete your registration and unlock access to the NSUT Alumni Portal.
          </p>
        </div>
      </div>

      {/* Right Column: Verification Form */}
      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen lg:min-h-full">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="relative z-10 w-full max-w-md space-y-8">
          {/* Header */}
          <div>
            <Link to="/" className="lg:hidden flex items-center gap-3 text-nsut-maroon mb-6 justify-center">
              <img src={nsutLogo} alt="NSUT Logo" className="h-8 w-8" />
              <span className="text-2xl font-serif font-semibold">NALUM</span>
            </Link>
            {verified ? (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-center text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                  Email Verified Successfully!
                </h2>
                <p className="text-base text-gray-600">
                  Your email has been verified. You can now sign in to your account.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-center text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                  Verify Your Email
                </h2>
                <p className="mt-2 text-center text-base text-gray-600">
                  We've sent a verification code to{" "}
                  <span className="font-semibold text-nsut-maroon">{email}</span>
                </p>
              </>
            )}
          </div>

          {/* Content */}
          {verified ? (
            <Button
              onClick={() => navigate("/login")}
              className="w-full h-12 bg-nsut-maroon hover:bg-nsut-maroon/90 text-white font-semibold text-lg"
            >
              Go to Login
            </Button>
          ) : (
            <EmailVerification
              email={email || ""}
              onEmailChange={() => {}}
              onVerified={handleEmailVerified}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
