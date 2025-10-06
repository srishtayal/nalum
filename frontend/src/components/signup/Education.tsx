
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface EducationProps {
  formData: {
    educations: { degree: string; institution: string; duration: string }[];
  };
  handleChange: (field: string, value: any) => void;
}

const Education = ({ formData, handleChange }: EducationProps) => {
  const [newEducation, setNewEducation] = useState({ degree: "", institution: "", duration: "" });

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.duration) {
      handleChange("educations", [...formData.educations, newEducation]);
      setNewEducation({ degree: "", institution: "", duration: "" });
    }
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducations = [...formData.educations];
    updatedEducations.splice(index, 1);
    handleChange("educations", updatedEducations);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Education</h3>
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Degree</Label>
            <Input
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              placeholder="e.g., B.Tech in Computer Engineering"
            />
          </div>
          <div className="space-y-2">
            <Label>Institution</Label>
            <Input
              value={newEducation.institution}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              placeholder="e.g., Netaji Subhas University of Technology"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Duration</Label>
          <Input
            value={newEducation.duration}
            onChange={(e) => setNewEducation({ ...newEducation, duration: e.target.value })}
            placeholder="e.g., 2020 - 2024"
          />
        </div>
        <Button onClick={handleAddEducation} className="w-full">Add Education</Button>
      </div>

      <div className="space-y-2">
        {formData.educations.map((edu, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-base">{edu.degree}</CardTitle>
              <button onClick={() => handleRemoveEducation(index)} className="rounded-full hover:bg-gray-200 p-1">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.duration}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Education;
