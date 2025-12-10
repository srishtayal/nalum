import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SkillsFormProps {
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ skills, setSkills }) => {
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput && skills.length < 6 && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Add a skill"
          className="bg-white/80 border-gray-300 text-black"
        />
        <Button onClick={handleAddSkill} disabled={skills.length >= 6}>
          Add Skill
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <Badge key={skill} variant="secondary" className="flex items-center gap-2">
            {skill}
            <button onClick={() => handleRemoveSkill(skill)} className="focus:outline-none">
              <X className="h-4 w-4" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;