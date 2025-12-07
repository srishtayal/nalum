
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
}

interface ExperienceProps {
  formData: {
    experiences: ExperienceItem[];
  };
  handleChange: (field: string, value: ExperienceItem[]) => void;
}

const Experience = ({ formData, handleChange }: ExperienceProps) => {
  const [newExperience, setNewExperience] = useState({ role: "", company: "", duration: "" });

  const handleAddExperience = () => {
    if (newExperience.role && newExperience.company && newExperience.duration) {
      handleChange("experiences", [...formData.experiences, newExperience]);
      setNewExperience({ role: "", company: "", duration: "" });
    }
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences.splice(index, 1);
    handleChange("experiences", updatedExperiences);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Experience</h3>
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              value={newExperience.role}
              onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              placeholder="e.g., Google"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Duration</Label>
          <Input
            value={newExperience.duration}
            onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
            placeholder="e.g., 2022 - Present"
          />
        </div>
        <Button onClick={handleAddExperience} className="w-full">Add Experience</Button>
      </div>

      <div className="space-y-2">
        {formData.experiences.map((exp, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-base">{exp.role}</CardTitle>
              <button onClick={() => handleRemoveExperience(index)} className="rounded-full hover:bg-gray-200 p-1">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.duration}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Experience;
