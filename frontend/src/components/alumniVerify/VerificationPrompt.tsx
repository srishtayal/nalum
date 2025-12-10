import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import VerifyCodeModal from "./VerifyCodeModal";

const VerificationPrompt = () => {
  const { isVerifiedAlumni } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only show prompt if user is not verified
  if (isVerifiedAlumni === true || isVerifiedAlumni === null) {
    return null;
  }

  return (
    <>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800">
          You are not verified.{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold text-yellow-900 underline"
            onClick={() => setIsModalOpen(true)}
          >
            Verify Now
          </Button>
        </p>
      </div>
      <VerifyCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default VerificationPrompt;
