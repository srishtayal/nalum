
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalInfoProps {
  formData: {
    name: string;
    batch: string;
    branch: string;
    campus: string;
    status: string;
  };
  handleChange: (field: string, value: string) => void;
}

const PersonalInfo = ({ formData, handleChange }: PersonalInfoProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1983 + 1 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Information</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g., John Doe"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="e.g., your.email@example.com"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="batch">Batch</Label>
          <Select onValueChange={(value) => handleChange("batch", value)} value={formData.batch}>
            <SelectTrigger>
              <SelectValue placeholder="Select a batch" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch">Branch</Label>
          <Input
            id="branch"
            value={formData.branch}
            onChange={(e) => handleChange("branch", e.target.value)}
            placeholder="e.g., COE"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="campus">Campus</Label>
        <Select onValueChange={(value) => handleChange("campus", value)} value={formData.campus}>
          <SelectTrigger>
            <SelectValue placeholder="Select a campus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MAIN">MAIN</SelectItem>
            <SelectItem value="EAST">EAST</SelectItem>
            <SelectItem value="WEST">WEST</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Current Status</Label>
        <Select onValueChange={(value) => handleChange("status", value)} value={formData.status}>
          <SelectTrigger>
            <SelectValue placeholder="What are you currently doing?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open_for_work">Open for work</SelectItem>
            <SelectItem value="recruiting">Recruiting</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PersonalInfo;
