import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface VerifyManualFormProps {
  initialData: {
    name: string;
    roll_no?: string;
    batch: string;
    branch: string;
  };
  onSubmit: (data: {
    name: string;
    roll_no?: string;
    batch: string;
    branch: string;
  }) => void;
  isLoading?: boolean;
}

const VerifyManualForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: VerifyManualFormProps) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="roll_no">Roll Number (Optional)</Label>
        <Input
          id="roll_no"
          type="text"
          placeholder="Enter your roll number"
          value={formData.roll_no || ""}
          onChange={(e) => handleChange("roll_no", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="batch">Batch/Year</Label>
        <Input
          id="batch"
          type="text"
          placeholder="e.g., 2020"
          value={formData.batch}
          onChange={(e) => handleChange("batch", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="branch">Branch/Department</Label>
        <Input
          id="branch"
          type="text"
          placeholder="e.g., Computer Science"
          value={formData.branch}
          onChange={(e) => handleChange("branch", e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Checking..." : "Check Verification"}
      </Button>
    </form>
  );
};

export default VerifyManualForm;
