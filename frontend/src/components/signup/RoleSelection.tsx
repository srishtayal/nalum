
import { Button } from "@/components/ui/button";

interface RoleSelectionProps {
  handleChange: (field: string, value: string) => void;
  nextStep: () => void;
}

const RoleSelection = ({ handleChange, nextStep }: RoleSelectionProps) => {
  const handleSelectRole = (role: string) => {
    handleChange("role", role);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-700 text-center">
        Are you a student or an alumnus?
      </h2>
      <div className="flex flex-col space-y-4">
        <Button
          onClick={() => handleSelectRole("student")}
          className="bg-[#8B0712] text-white hover:bg-gray-700"
        >
          Student
        </Button>
        <Button
          onClick={() => handleSelectRole("alumni")}
          className="bg-gray-600 text-white hover:bg-[#8B0712]"
        >
          Alumni
        </Button>
      </div>
    </div>
  );
};

export default RoleSelection;
