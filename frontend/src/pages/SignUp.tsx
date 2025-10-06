import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import nsutLogo from "@/assets/nsut-logo.svg";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";
import Header from "@/components/Header";

// Step Components
import RoleSelection from "@/components/signup/RoleSelection";
import PersonalInfo from "@/components/signup/PersonalInfo";
import Skills from "@/components/signup/Skills";
import Experience from "@/components/signup/Experience";
import Education from "@/components/signup/Education";
import Contributions from "@/components/signup/Contributions";
import Socials from "@/components/signup/Socials";
import Password from "@/components/signup/Password";
import Review from "@/components/signup/Review";

const TOTAL_STEPS = 8;

const Signup = () => {
  const [step, setStep] = useState(0);
  const [cameFromReview, setCameFromReview] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    name: "",
    batch: "",
    branch: "",
    campus: "",
    status: "",
    skills: [] as string[],
    experiences: [] as { role: string; company: string; duration: string }[],
    educations: [] as { degree: string; institution: string; duration: string }[],
    projects: [] as { title: string; description: string; link: string }[],
    publications: [] as { title: string; description: string; journal: string; date: string }[],
    honours: [] as { title: string; description: string; duration: string }[],
    socials: { linkedin: "", github: "", portfolio: "" },
    resume: null as File | null,
    password: "",
  });

  const nextStep = () => {
    if (cameFromReview) {
      setStep(TOTAL_STEPS);
      setCameFromReview(false);
    } else {
      setStep((prev) => (prev < TOTAL_STEPS ? prev + 1 : prev));
    }
  };
  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : prev));

  const editStep = (stepNumber: number) => {
    setCameFromReview(true);
    setStep(stepNumber);
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const data = new FormData();

    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);
    data.append('name', formData.name);
    data.append('batch', formData.batch);
    data.append('branch', formData.branch);
    data.append('campus', formData.campus);
    data.append('status', formData.status);
    data.append('skills', JSON.stringify(formData.skills));
    data.append('experience', JSON.stringify(formData.experiences));
    data.append('education', JSON.stringify(formData.educations));
    data.append('honours', JSON.stringify(formData.honours));
    data.append('projects', JSON.stringify(formData.projects));
    data.append('publications', JSON.stringify(formData.publications));
    data.append('social_media', JSON.stringify(formData.socials));
    
    if (formData.resume) {
      data.append('custom_cv', formData.resume);
    }

    try {
      console.log("Submitting form data:", { ...formData, resume: formData.resume ? formData.resume.name : null });
      const response = await axios.post('https://nalum-p4wh.onrender.com/auth/sign-up', data, {
        headers: {
          'Content-Type': 'multipart/form-data',

        },
      });

      if (response.data.success) {
        toast({ title: "Registration successful!" });
        navigate("/login");
      } else {
        toast({ title: response.data.message || "An error occurred", variant: "destructive" });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({ title: error.response?.data?.message || "An error occurred", variant: "destructive" });
      } else {
        toast({ title: "An error occurred", variant: "destructive" });
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <RoleSelection handleChange={handleChange} nextStep={nextStep} />;
      case 1:
        return <PersonalInfo formData={formData} handleChange={handleChange} />;
      case 2:
        return <Skills formData={formData} handleChange={handleChange} />;
      case 3:
        return <Experience formData={formData} handleChange={handleChange} />;
      case 4:
        return <Education formData={formData} handleChange={handleChange} />;
      case 5:
        return <Contributions formData={formData} handleChange={handleChange} />;
      case 6:
        return <Socials formData={formData} handleChange={handleChange} />;
      case 7:
        return <Password formData={formData} handleChange={handleChange} />;
      case 8:
        return <Review formData={formData} setStep={editStep} />;
      default:
        return <RoleSelection handleChange={handleChange} nextStep={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#8B0712] flex flex-col">
      <Header />
      <div className="flex flex-1 h-full w-full">
        {/* Left Image */}
        <div className="hidden md:flex w-3/5 h-full items-center justify-center bg-[#8B0712] relative">
          <img
            src={nsutCampusHero}
            alt="NSUT Campus"
            className="object-cover w-full h-full max-h-screen rounded-none"
            style={{ minHeight: "100vh" }}
          />
          <div className="absolute inset-0 hero-gradient opacity-35"></div>
        </div>
        {/* Right Form */}
        <div className="w-full md:w-2/5 min-h-full flex items-center justify-center bg-white">
          <div className="w-full max-w-md z-10 px-6 py-8">
            <div className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <img src={nsutLogo} alt="NSUT Logo" className="h-16 w-16" />
              </div>
              <h2 className="text-3xl font-extrabold text-[#8B0712] mb-2">Create Account</h2>
              <p className="text-gray-700">Join the NSUT Alumni Portal</p>
              {/* Progress Bar */}
              <div className="flex items-center gap-4 mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#8B0712] h-2.5 rounded-full"
                    style={{ width: `${((step + 1) / (TOTAL_STEPS + 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm font-semibold text-gray-600">
                  Step {step + 1} of {TOTAL_STEPS + 1}
                </div>
              </div>
            </div>
            <div className="pt-2 pb-2 overflow-y-auto" style={{ maxHeight: "calc(50vh)" }}>{renderStep()}</div>
            <div className="mt-6 flex justify-between">
              {step > 0 && (
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              {step > 0 && step < TOTAL_STEPS && (
                <Button onClick={nextStep} className="ml-auto">
                  {cameFromReview ? "Return to Review" : "Next"}
                </Button>
              )}
              {step === TOTAL_STEPS && (
                <Button onClick={handleSubmit} className="ml-auto">
                  Submit
                </Button>
              )}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#8B0712] underline hover:text-gray-600"
                >
                  Sign In
                </Link>
              </p>
            </div>
            <div className="mt-6 text-center text-sm text-gray-400">
              <GraduationCap className="h-4 w-4 inline mr-2" />
              NSUT Alumni Portal - Since 1983
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
