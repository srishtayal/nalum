import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface ProtectedVerificationRouteProps {
  children: React.ReactNode;
}

const ProtectedVerificationRoute = ({ children }: ProtectedVerificationRouteProps) => {
  const { accessToken } = useAuth();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await api.get('/alumni/status', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setIsVerified(response.data.verified_alumni);
      } catch (error) {
        console.error('Error checking verification status:', error);
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      checkVerification();
    }
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-nsut-maroon mx-auto mb-4" />
          <p className="text-gray-600">Checking verification status...</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return <Navigate to="/dashboard/verify-alumni" replace />;
  }

  return <>{children}</>;
};

export default ProtectedVerificationRoute;
