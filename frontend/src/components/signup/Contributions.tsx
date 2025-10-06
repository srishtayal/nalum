
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ContributionsProps {
  formData: {
    projects: { title: string; description: string; link: string }[];
    publications: { title: string; description: string; journal: string; date: string }[];
    honours: { title: string; description: string; duration: string }[];
  };
  handleChange: (field: string, value: any) => void;
}

const Contributions = ({ formData, handleChange }: ContributionsProps) => {
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "" });
  const [newPublication, setNewPublication] = useState({ title: "", description: "", journal: "", date: "" });
  const [newHonor, setNewHonor] = useState({ title: "", description: "", duration: "" });

  const handleAddProject = () => {
    if (newProject.title) {
      handleChange("projects", [...formData.projects, newProject]);
      setNewProject({ title: "", description: "", link: "" });
    }
  };

  const handleAddPublication = () => {
    if (newPublication.title) {
      handleChange("publications", [...formData.publications, newPublication]);
      setNewPublication({ title: "", description: "", journal: "", date: "" });
    }
  };

  const handleAddHonor = () => {
    if (newHonor.title) {
      handleChange("honours", [...formData.honours, newHonor]);
      setNewHonor({ title: "", description: "", duration: "" });
    }
  };

  const handleRemove = (field: string, index: number) => {
    const updatedList = [...(formData as any)[field]];
    updatedList.splice(index, 1);
    handleChange(field, updatedList);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Projects, Publications, and Honors</h3>
      <Tabs defaultValue="projects">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="honours">Honours</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <div className="space-y-4 p-4 border rounded-lg mt-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Project Title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Project Description" />
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} placeholder="https://github.com/user/project" />
            </div>
            <Button onClick={handleAddProject} className="w-full">Add Project</Button>
          </div>
          <div className="space-y-2 mt-4">
            {formData.projects.map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <button onClick={() => handleRemove("projects", index)} className="rounded-full hover:bg-gray-200 p-1"><X className="h-4 w-4" /></button>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{item.link}</a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="publications">
          <div className="space-y-4 p-4 border rounded-lg mt-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newPublication.title} onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })} placeholder="Publication Title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={newPublication.description} onChange={(e) => setNewPublication({ ...newPublication, description: e.target.value })} placeholder="Publication Description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Journal / Conference</Label>
                <Input value={newPublication.journal} onChange={(e) => setNewPublication({ ...newPublication, journal: e.target.value })} placeholder="e.g., IEEE" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input value={newPublication.date} onChange={(e) => setNewPublication({ ...newPublication, date: e.target.value })} placeholder="e.g., October 2023" />
              </div>
            </div>
            <Button onClick={handleAddPublication} className="w-full">Add Publication</Button>
          </div>
          <div className="space-y-2 mt-4">
            {formData.publications.map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <button onClick={() => handleRemove("publications", index)} className="rounded-full hover:bg-gray-200 p-1"><X className="h-4 w-4" /></button>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500">{item.journal} - {item.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="honours">
          <div className="space-y-4 p-4 border rounded-lg mt-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newHonor.title} onChange={(e) => setNewHonor({ ...newHonor, title: e.target.value })} placeholder="Honor/Award Title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={newHonor.description} onChange={(e) => setNewHonor({ ...newHonor, description: e.target.value })} placeholder="Honor Description" />
            </div>
            <div className="space-y-2">
              <Label>Duration / Date</Label>
              <Input value={newHonor.duration} onChange={(e) => setNewHonor({ ...newHonor, duration: e.target.value })} placeholder="e.g., 2023" />
            </div>
            <Button onClick={handleAddHonor} className="w-full">Add Honor/Award</Button>
          </div>
          <div className="space-y-2 mt-4">
            {formData.honours.map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <button onClick={() => handleRemove("honours", index)} className="rounded-full hover:bg-gray-200 p-1"><X className="h-4 w-4" /></button>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500">{item.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contributions;
