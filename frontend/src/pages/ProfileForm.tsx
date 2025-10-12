import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";
import Header from "@/components/Header";
import MultiStepForm from "@/components/profile/MultiStepForm";
import ProfileStep from "@/components/profile/ProfileStep";
import EducationForm from "@/components/profile/EducationForm";
import ExperienceForm from "@/components/profile/ExperienceForm";
import SkillsForm from "@/components/profile/SkillsForm";
import PublicationsForm from "@/components/profile/PublicationsForm";
import HonorsForm from "@/components/profile/HonorsForm";
import CertificationsForm from "@/components/profile/CertificationsForm";
import GeneralInfoForm from "@/components/profile/GeneralInfoForm";
import SocialMediaForm, {
  SocialLink,
} from "@/components/profile/SocialMediaForm";

// Interfaces for the form data
interface Education {
  institution: string;
  degree: string;
  duration: string;
}

interface Experience {
  company: string;
  role: string;
  duration: string;
}

interface Publication {
  title: string;
}

interface Honor {
  title: string;
}

interface Certification {
  title: string;
}

const ProfileForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formMode, setFormMode] = useState<"options" | "parse" | "manual">(
    "options"
  );

  // Form state
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [honors, setHonors] = useState<Honor[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [batch, setBatch] = useState("");
  const [branch, setBranch] = useState("");
  const [campus, setCampus] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const { data } = await api.get("/profile/status");
        if (data.profileCompleted) {
          toast({ title: "You have already completed your profile." });
          navigate("/home");
        }
      } catch (error) {
        // Handle error, e.g., if the user is not authenticated
        console.error("Failed to check profile status", error);
      }
    };

    checkProfileStatus();
  }, [navigate, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleParse = async () => {
    if (!cvFile) {
      toast({ title: "Please select a file to parse.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", cvFile);

    try {
      const response = await api.post("/parser/parse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const parsedData = response.data;

      // Populate form with parsed data
      setEducation(parsedData.education?.slice(0, 5) || []);
      setExperience(
        parsedData.experience?.slice(0, 5).map((exp: any) => ({
          company: exp.company,
          role: exp.role,
          duration: exp.timeline, // Pass timeline string directly
        })) || []
      );
      setSkills(parsedData.skills?.slice(0, 6) || []);
      setPublications(
        parsedData.publications?.slice(0, 5).map((p: string) => ({ title: p })) || []
      );
      setHonors(
        parsedData.honors?.slice(0, 5).map((h: string) => ({ title: h })) || []
      );
      setCertifications(
        parsedData.certifications?.slice(0, 5).map((c: string) => ({ title: c })) ||
          []
      );

      toast({ title: "CV parsed successfully!" });
      setFormMode("manual"); // Switch to the multi-step form to show the parsed data
    } catch (error) {
      toast({ title: "Error parsing CV.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setFormMode("manual");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const socialMediaObject = socialLinks.reduce((acc, link) => {
      acc[link.network] = link.url;
      return acc;
    }, {} as { [key in SocialLink["network"]]?: string });

    const profileData = {
      education,
      experience,
      skills,
      publications,
      honors,
      certifications,
      batch,
      branch,
      campus,
      social_media: socialMediaObject,
    };

    try {
      await api.post("/profile/create", profileData);
      toast({ title: "Profile created successfully!" });
      navigate("/home");
    } catch (error) {
      toast({ title: "Error creating profile.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${nsutCampusHero})` }}
    >
      <Header />
      <div className="flex flex-1 h-full w-full items-center justify-center p-4">
        {formMode === "options" && (
          <div className="w-full max-w-4xl z-10 px-6 py-8 bg-black/30 backdrop-blur-md rounded-lg shadow-lg border border-white/30 text-white text-center">
            <h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>
            <p className="mb-6">
              You can either upload your CV to parse the data or fill the form
              manually.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setFormMode("parse")}
                variant="hero"
                className="bg-[#8B0712] text-white hover:bg-white hover:text-[black] border-none"
              >
                Parse CV
              </Button>
              <Button
                onClick={() => setFormMode("manual")}
                variant="hero"
                className="bg-[#8B0712] text-white hover:bg-white hover:text-[black] border-none"
              >
                Fill Manually
              </Button>
            </div>
          </div>
        )}

        {formMode === "parse" && (
          <div className="w-full max-w-4xl z-10 px-6 py-8 bg-black/30 backdrop-blur-md rounded-lg shadow-lg border border-white/30 text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">Parse Your CV</h1>
            <div className="mb-6">
              <Label htmlFor="cv" className="text-white">
                Upload your CV (from LinkedIn)
              </Label>
              <div className="flex gap-4 mt-2">
                <Input
                  id="cv"
                  type="file"
                  onChange={handleFileChange}
                  className="bg-white/20 border-none text-white file:text-gray-300 file:border-none file:bg-transparent"
                />
                <Button
                  onClick={handleParse}
                  disabled={isLoading || !cvFile}
                  variant="hero"
                  className="bg-[#8B0712] text-white hover:bg-white hover:text-[black] border-none"
                >
                  {isLoading ? "Parsing..." : "Parse CV"}
                </Button>
              </div>
            </div>
            <Button onClick={() => setFormMode("options")} variant="link">
              Back
            </Button>
          </div>
        )}

        {formMode === "manual" && (
          <MultiStepForm>
            <ProfileStep title="General Information">
              <GeneralInfoForm
                batch={batch}
                setBatch={setBatch}
                branch={branch}
                setBranch={setBranch}
                campus={campus}
                setCampus={setCampus}
              />
            </ProfileStep>
            <ProfileStep title="Education">
              <EducationForm education={education} setEducation={setEducation} />
            </ProfileStep>
            <ProfileStep title="Experience">
              <ExperienceForm
                experience={experience}
                setExperience={setExperience}
              />
            </ProfileStep>
            <ProfileStep title="Skills">
              <SkillsForm skills={skills} setSkills={setSkills} />
            </ProfileStep>
            <ProfileStep title="Social Media">
              <SocialMediaForm
                socialLinks={socialLinks}
                setSocialLinks={setSocialLinks}
              />
            </ProfileStep>
            <ProfileStep title="Publications">
              <PublicationsForm
                publications={publications}
                setPublications={setPublications}
              />
            </ProfileStep>
            <ProfileStep title="Honors & Awards">
              <HonorsForm honors={honors} setHonors={setHonors} />
            </ProfileStep>
            <ProfileStep title="Certifications">
              <CertificationsForm
                certifications={certifications}
                setCertifications={setCertifications}
              />
            </ProfileStep>
            <ProfileStep title="Review & Submit">
              <div className="text-center">
                <p>You have completed all the steps.</p>
                <Button
                  onClick={handleSubmit}
                  className="mt-6 w-full bg-[#8B0712] text-white hover:bg-white hover:text-[black] border-none"
                  size="lg"
                  variant="hero"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </ProfileStep>
          </MultiStepForm>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
