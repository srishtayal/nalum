import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Pencil } from 'lucide-react';

interface Experience {
  company: string;
  role: string;
  duration: string;
}

interface ExperienceFormProps {
  experience: Experience[];
  setExperience: React.Dispatch<React.SetStateAction<Experience[]>>;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, setExperience }) => {
  const [currentExperience, setCurrentExperience] = useState<Experience>({ company: '', role: '', duration: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (field: keyof Experience, value: string) => {
    setCurrentExperience(prev => ({ ...prev, [field]: value }));
  };

  const handleAddOrUpdate = () => {
    if (editingIndex !== null) {
      const newExperience = [...experience];
      newExperience[editingIndex] = currentExperience;
      setExperience(newExperience);
      setEditingIndex(null);
    } else {
      setExperience([...experience, currentExperience]);
    }
    setCurrentExperience({ company: '', role: '', duration: '' });
  };

  const handleEdit = (index: number) => {
    setCurrentExperience(experience[index]);
    setEditingIndex(index);
  };

  const handleRemove = (index: number) => {
    const newExperience = experience.filter((_, i) => i !== index);
    setExperience(newExperience);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={currentExperience.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="bg-white/80 border-gray-300 text-black"
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={currentExperience.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="bg-white/80 border-gray-300 text-black"
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={currentExperience.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="bg-white/80 border-gray-300 text-black"
          />
        </div>
        <div className="md:col-span-3 text-right">
          <Button onClick={handleAddOrUpdate}>
            {editingIndex !== null ? 'Update Experience' : 'Add Experience'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {experience.map((exp, index) => (
          <Card key={index} className="bg-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{exp.company}</CardTitle>
              <div>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(index)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleRemove(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>{exp.role}</p>
              <p className="text-sm text-gray-400">{exp.duration}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExperienceForm;