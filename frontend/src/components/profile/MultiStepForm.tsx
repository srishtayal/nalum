import { useState, Children } from "react";
import { Button } from "@/components/ui/button";

interface MultiStepFormProps {
  children: React.ReactNode[];
}

const MultiStepForm = ({ children }: MultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, children.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="w-full max-w-4xl z-10 px-6 py-8 bg-black/30 backdrop-blur-md rounded-lg shadow-lg border border-white/30 text-white">
      {children[currentStep]}
      <div className="flex justify-between mt-6">
        {currentStep > 0 && (
          <Button onClick={prevStep} variant="hero" className="bg-[#8B0712] text-white hover:bg-white hover:text-[black] border-none">
            Previous
          </Button>
        )}
        {currentStep < children.length - 1 && (
          <Button onClick={nextStep} variant="hero" className="bg-[#8B0712] text-white hover:bg-white hover:text-[black] border-none">
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
