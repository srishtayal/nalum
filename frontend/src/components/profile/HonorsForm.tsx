import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Pencil } from 'lucide-react';

interface Honor {
  title: string;
}

interface HonorsFormProps {
  honors: Honor[];
  setHonors: React.Dispatch<React.SetStateAction<Honor[]>>;
}

const HonorsForm: React.FC<HonorsFormProps> = ({ honors, setHonors }) => {
  const [currentHonor, setCurrentHonor] = useState<Honor>({ title: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (value: string) => {
    setCurrentHonor({ title: value });
  };

  const handleAddOrUpdate = () => {
    if (honors.length >= 5 && editingIndex === null) {
      return;
    }

    if (editingIndex !== null) {
      const newHonors = [...honors];
      newHonors[editingIndex] = currentHonor;
      setHonors(newHonors);
      setEditingIndex(null);
    } else {
      setHonors([...honors, currentHonor]);
    }
    setCurrentHonor({ title: '' });
  };

  const handleEdit = (index: number) => {
    setCurrentHonor(honors[index]);
    setEditingIndex(index);
  };

  const handleRemove = (index: number) => {
    const newHonors = honors.filter((_, i) => i !== index);
    setHonors(newHonors);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          value={currentHonor.title}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Honor or award"
          className="bg-white/80 border-gray-300 text-black"
        />
        <Button onClick={handleAddOrUpdate} disabled={honors.length >= 5 && editingIndex === null}>
          {editingIndex !== null ? 'Update' : 'Add'}
        </Button>
      </div>

      <div className="space-y-4">
        {honors.map((honor, index) => (
          <Card key={index} className="bg-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{honor.title}</CardTitle>
              <div>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(index)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleRemove(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HonorsForm;