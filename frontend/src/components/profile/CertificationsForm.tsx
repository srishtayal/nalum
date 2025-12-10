import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Pencil } from 'lucide-react';

interface Certification {
  title: string;
}

interface CertificationsFormProps {
  certifications: Certification[];
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ certifications, setCertifications }) => {
  const [currentCertification, setCurrentCertification] = useState<Certification>({ title: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (value: string) => {
    setCurrentCertification({ title: value });
  };

  const handleAddOrUpdate = () => {
    if (certifications.length >= 5 && editingIndex === null) {
      return;
    }

    if (editingIndex !== null) {
      const newCertifications = [...certifications];
      newCertifications[editingIndex] = currentCertification;
      setCertifications(newCertifications);
      setEditingIndex(null);
    } else {
      setCertifications([...certifications, currentCertification]);
    }
    setCurrentCertification({ title: '' });
  };

  const handleEdit = (index: number) => {
    setCurrentCertification(certifications[index]);
    setEditingIndex(index);
  };

  const handleRemove = (index: number) => {
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          value={currentCertification.title}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Certification title"
          className="bg-white/80 border-gray-300 text-black"
        />
        <Button onClick={handleAddOrUpdate} disabled={certifications.length >= 5 && editingIndex === null}>
          {editingIndex !== null ? 'Update' : 'Add'}
        </Button>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <Card key={index} className="bg-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{cert.title}</CardTitle>
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

export default CertificationsForm;