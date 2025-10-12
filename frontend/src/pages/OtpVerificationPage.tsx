import EmailVerification from "@/components/signup/EmailVerification";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [verified, setVerified] = useState(false);

  const handleEmailVerified = () => {
    setVerified(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${nsutCampusHero})` }}
    >
      <div className="w-full max-w-md z-10 px-6 py-8 bg-black/30 backdrop-blur-md rounded-lg shadow-lg border border-white/30">
        {verified ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Email Verified Successfully!</h2>
            <p className="text-gray-200 mb-6">You can now proceed to log in.</p>
            <Button onClick={() => navigate("/login")} className="bg-[#8B0712] text-white hover:bg-gray-700">Go to Login</Button>
          </div>
        ) : (
          <EmailVerification
            email={email}
            onEmailChange={() => {}}
            onVerified={handleEmailVerified}
          />
        )}
      </div>
    </div>
  );
};

export default OtpVerificationPage;