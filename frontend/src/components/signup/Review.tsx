
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReviewProps {
  formData: {
    email: string;
    name: string;
    batch: string;
    branch: string;
    campus: string;
    status: string;
    skills: string[];
    experiences: { role: string; company: string; duration: string }[];
    educations: { degree: string; institution: string; duration: string }[];
    projects: { title: string; description: string; link: string }[];
    publications: { title: string; description: string; journal: string; date: string }[];
    honours: { title: string; description: string; duration: string }[];
    socials: { linkedin: string; github: string; portfolio: string };
    resume: File | null;
    password: string;
    role: string;
  };
  setStep: (step: number) => void;
}

const Review = ({ formData, setStep }: ReviewProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review Your Information</h3>

      {/* Personal Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Personal Information</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setStep(1)}>Edit</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Batch:</strong> {formData.batch}</p>
          <p><strong>Branch:</strong> {formData.branch}</p>
          <p><strong>Campus:</strong> {formData.campus}</p>
          <p><strong>Status:</strong> {formData.status}</p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Skills</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setStep(2)}>Edit</Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => <Badge key={index}>{skill}</Badge>)}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Experience</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setStep(3)}>Edit</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.experiences.map((exp, index) => (
            <div key={index} className="border-b pb-2">
              <p className="font-semibold">{exp.role} at {exp.company}</p>
              <p className="text-sm text-gray-500">{exp.duration}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Education</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setStep(4)}>Edit</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.educations.map((edu, index) => (
            <div key={index} className="border-b pb-2">
              <p className="font-semibold">{edu.degree} from {edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.duration}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contributions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Projects, Publications, & Honors</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setStep(5)}>Edit</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <h4 className="font-semibold">Projects</h4>
          {formData.projects.map((proj, index) => <p key={index}>{proj.title}</p>)}
          <h4 className="font-semibold">Publications</h4>
          {formData.publications.map((pub, index) => <p key={index}>{pub.title}</p>)}
          <h4 className="font-semibold">Honours</h4>
          {formData.honours.map((honor, index) => <p key={index}>{honor.title}</p>)}
        </CardContent>
      </Card>

      {/* Socials & Resume */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Socials & Resume</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setStep(6)}>Edit</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>LinkedIn:</strong> {formData.socials.linkedin}</p>
          <p><strong>GitHub:</strong> {formData.socials.github}</p>
          <p><strong>Portfolio:</strong> {formData.socials.portfolio}</p>
          <p><strong>Resume:</strong> {formData.resume?.name || "Not uploaded"}</p>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Password</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setStep(7)}>Edit</Button>
        </CardHeader>
        <CardContent>
          <p>************</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Review;
