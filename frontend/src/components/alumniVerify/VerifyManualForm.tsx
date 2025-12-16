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
    contact_info?: {
      phone?: string;
      alternate_email?: string;
      linkedin?: string;
    };
  }) => void;
  isLoading?: boolean;
}

const VerifyManualForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: VerifyManualFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    alternate_email: "",
    linkedin: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: string, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      contact_info: contactInfo,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Full Name <span className="text-red-500">*</span>
        </Label>
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
        <Label htmlFor="batch">
          Year of Passing <span className="text-red-500">*</span>
        </Label>
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
        <Label htmlFor="branch">
          Branch <span className="text-red-500">*</span>
        </Label>
        <Input
          id="branch"
          type="text"
          placeholder="e.g., Computer Science"
          value={formData.branch}
          onChange={(e) => handleChange("branch", e.target.value)}
          required
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">
          Contact Information
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Provide contact details so admins can reach you if needed
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g., +91 9876543210"
              value={contactInfo.phone}
              onChange={(e) => handleContactChange("phone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternate_email">Alternate Email</Label>
            <Input
              id="alternate_email"
              type="email"
              placeholder="e.g., personal@gmail.com"
              value={contactInfo.alternate_email}
              onChange={(e) =>
                handleContactChange("alternate_email", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="e.g., https://linkedin.com/in/yourprofile"
              value={contactInfo.linkedin}
              onChange={(e) => handleContactChange("linkedin", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Checking..." : "Check Verification"}
      </Button>
    </form>
  );
};

export default VerifyManualForm;
