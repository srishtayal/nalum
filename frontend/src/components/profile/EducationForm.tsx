import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Pencil } from 'lucide-react';

interface Education {
  institution: string;
  degree: string;
  duration: string;
}

interface EducationFormProps {
  education: Education[];
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>;
}

const EducationForm: React.FC<EducationFormProps> = ({ education, setEducation }) => {
  const [currentEducation, setCurrentEducation] = useState<Education>({ institution: '', degree: '', duration: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (field: keyof Education, value: string) => {
    setCurrentEducation(prev => ({ ...prev, [field]: value }));
  };

  const handleAddOrUpdate = () => {
    if (editingIndex !== null) {
      const newEducation = [...education];
      newEducation[editingIndex] = currentEducation;
      setEducation(newEducation);
      setEditingIndex(null);
    } else {
      setEducation([...education, currentEducation]);
    }
    setCurrentEducation({ institution: '', degree: '', duration: '' });
  };

  const handleEdit = (index: number) => {
    setCurrentEducation(education[index]);
    setEditingIndex(index);
  };

  const handleRemove = (index: number) => {
    const newEducation = education.filter((_, i) => i !== index);
    setEducation(newEducation);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg">
        <div>
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            value={currentEducation.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            className="bg-white/80 border-gray-300 text-black"
          />
        </div>
        <div>
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            value={currentEducation.degree}
            onChange={(e) => handleInputChange('degree', e.target.value)}
            className="bg-white/80 border-gray-300 text-black"
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={currentEducation.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="bg-white/80 border-gray-300 text-black"
          />
        </div>
        <div className="md:col-span-3 text-right">
          <Button onClick={handleAddOrUpdate}>
            {editingIndex !== null ? 'Update Education' : 'Add Education'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <Card key={index} className="bg-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{edu.institution}</CardTitle>
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
              <p>{edu.degree}</p>
              <p className="text-sm text-gray-400">{edu.duration}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EducationForm;