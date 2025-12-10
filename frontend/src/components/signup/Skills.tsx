
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SkillsProps {
  formData: {
    skills: string[];
  };
  handleChange: (field: string, value: string[]) => void;
}

const Skills = ({ formData, handleChange }: SkillsProps) => {
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput && !formData.skills.includes(skillInput)) {
      handleChange("skills", [...formData.skills, skillInput]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    handleChange("skills", formData.skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Skills</h3>
      <div className="space-y-2">
        <Label htmlFor="skills">Add your top skills (press Enter after each)</Label>
        <div className="flex gap-2">
          <Input
            id="skills"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="e.g., React, Node.js, Python"
          />
          <Button onClick={handleAddSkill}>Add</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {skill}
            <button onClick={() => handleRemoveSkill(skill)} className="rounded-full hover:bg-gray-200 p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Skills;
