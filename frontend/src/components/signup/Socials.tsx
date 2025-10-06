
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialsProps {
  formData: {
    socials: { linkedin: string; github: string; portfolio: string };
    resume: File | null;
  };
  handleChange: (field: string, value: any) => void;
}

const Socials = ({ formData, handleChange }: SocialsProps) => {
  const handleSocialChange = (socialField: string, value: string) => {
    handleChange("socials", { ...formData.socials, [socialField]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleChange("resume", e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Socials & Resume</h3>
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          value={formData.socials.linkedin}
          onChange={(e) => handleSocialChange("linkedin", e.target.value)}
          placeholder="https://linkedin.com/in/your-profile"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="github">GitHub</Label>
        <Input
          id="github"
          value={formData.socials.github}
          onChange={(e) => handleSocialChange("github", e.target.value)}
          placeholder="https://github.com/your-username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio</Label>
        <Input
          id="portfolio"
          value={formData.socials.portfolio}
          onChange={(e) => handleSocialChange("portfolio", e.target.value)}
          placeholder="https://your-portfolio.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resume">Upload CV</Label>
        <Input id="resume" type="file" onChange={handleFileChange} accept=".pdf" />
        {formData.resume && <p className="text-sm text-gray-500">{formData.resume.name}</p>}
      </div>
    </div>
  );
};

export default Socials;
