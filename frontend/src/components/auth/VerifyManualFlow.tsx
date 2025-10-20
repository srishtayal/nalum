import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  getUserProfile,
  checkAlumniManual,
  confirmAlumniMatch,
} from "@/lib/api";
import VerifyManualForm from "./VerifyManualForm";
import SelectMatchModal from "./SelectMatchModal";
import axios from "axios";

interface Match {
  name: string;
  roll_no: string;
  batch: string;
  branch: string;
}

const VerifyManualFlow = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    roll_no: "",
    batch: "",
    branch: "",
  });
  const [matches, setMatches] = useState<Match[]>([]);
  const { toast } = useToast();
  const { setAuth, accessToken, email } = useAuth();

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        const profile = response.data.data;
        setProfileData({
          name: profile.name || "",
          roll_no: profile.roll_no || "",
          batch: profile.batch || "",
          branch: profile.branch || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleFormSubmit = async (formData: {
    name: string;
    roll_no?: string;
    batch: string;
    branch: string;
  }) => {
    setIsLoading(true);

    try {
      const response = await checkAlumniManual(formData);
      const matchesData = response.data.matches || [];

      if (matchesData.length === 0) {
        // No matches found - added to admin queue
        toast({
          title: "No Matches Found",
          description:
            "Your verification request has been sent to the admin for manual review. You will be notified once it's processed.",
          variant: "default",
        });
        setIsFormModalOpen(false);
      } else if (matchesData.length === 1) {
        // Single match - auto-confirm
        await handleConfirmMatch(matchesData[0]);
      } else {
        // Multiple matches - show selection modal
        setMatches(matchesData);
        setIsFormModalOpen(false);
        setIsSelectModalOpen(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Verification Failed",
          description:
            error.response?.data?.message ||
            "Failed to check verification details",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMatch = async (match: Match) => {
    setIsLoading(true);

    try {
      await confirmAlumniMatch({ roll_no: match.roll_no });

      // Update auth context with verified status
      setAuth(accessToken, email, true);

      toast({
        title: "Verification Successful! 🎉",
        description: "Your alumni status has been verified successfully.",
      });

      setIsSelectModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Verification Failed",
          description:
            error.response?.data?.message || "Failed to confirm verification",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="link"
        className="p-0 h-auto font-semibold text-yellow-900 underline"
        onClick={() => setIsFormModalOpen(true)}
      >
        Verify Manually
      </Button>

      {/* Form Modal */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Alumni Verification</DialogTitle>
            <DialogDescription>
              Enter your details to verify your alumni status. We'll search our
              records for a match.
            </DialogDescription>
          </DialogHeader>
          <VerifyManualForm
            initialData={profileData}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Match Selection Modal */}
      <SelectMatchModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        matches={matches}
        onSelect={handleConfirmMatch}
      />
    </>
  );
};

export default VerifyManualFlow;
