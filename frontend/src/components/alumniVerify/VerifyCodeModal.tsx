import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { verifyAlumniCode } from "@/lib/api";
import VerifyManualFlow from "./VerifyManualFlow";
import axios from "axios";

interface VerifyCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerifyCodeModal = ({ isOpen, onClose }: VerifyCodeModalProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"code" | "manual">("code");
  const { toast } = useToast();
  const { setAuth, accessToken, email } = useAuth();

  const handleClose = () => {
    setView("code");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Please enter a verification code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyAlumniCode(code);

      if (response.data.success) {
        // Update auth context with verified status
        setAuth(accessToken, email, true);

        toast({
          title: "Verification Successful! 🎉",
          description: "Your alumni status has been verified successfully.",
        });

        // Reset form and close modal
        setCode("");
        handleClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to verify code";
        setError(errorMessage);
        toast({
          title: "Verification Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        setError("An unexpected error occurred");
        toast({
          title: "Verification Failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Alumni Status</DialogTitle>
          <DialogDescription>
            {view === "code"
              ? "Enter the 10-digit verification code provided to you. If you don't have a code, please contact the alumni office."
              : "Enter your details to verify your alumni status. We'll search our records for a match."}
          </DialogDescription>
        </DialogHeader>

        {view === "code" ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  id="code"
                  placeholder="Enter 10-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={10}
                  className={error ? "border-red-500" : ""}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
            <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={() => setView("manual")}
              >
                Don't have a code? Verify Manually
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        ) : (
          <VerifyManualFlow onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerifyCodeModal;
