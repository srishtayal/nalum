import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Pencil } from 'lucide-react';

interface Publication {
  title: string;
}

interface PublicationsFormProps {
  publications: Publication[];
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
}

const PublicationsForm: React.FC<PublicationsFormProps> = ({ publications, setPublications }) => {
  const [currentPublication, setCurrentPublication] = useState<Publication>({ title: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (value: string) => {
    setCurrentPublication({ title: value });
  };

  const handleAddOrUpdate = () => {
    if (publications.length >= 5 && editingIndex === null) {
      // Optionally, show a toast or message that the limit is reached
      return;
    }

    if (editingIndex !== null) {
      const newPublications = [...publications];
      newPublications[editingIndex] = currentPublication;
      setPublications(newPublications);
      setEditingIndex(null);
    } else {
      setPublications([...publications, currentPublication]);
    }
    setCurrentPublication({ title: '' });
  };

  const handleEdit = (index: number) => {
    setCurrentPublication(publications[index]);
    setEditingIndex(index);
  };

  const handleRemove = (index: number) => {
    const newPublications = publications.filter((_, i) => i !== index);
    setPublications(newPublications);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          value={currentPublication.title}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Publication title"
          className="bg-white/80 border-gray-300 text-black"
        />
        <Button onClick={handleAddOrUpdate} disabled={publications.length >= 5 && editingIndex === null}>
          {editingIndex !== null ? 'Update' : 'Add'}
        </Button>
      </div>

      <div className="space-y-4">
        {publications.map((pub, index) => (
          <Card key={index} className="bg-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{pub.title}</CardTitle>
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

export default PublicationsForm;