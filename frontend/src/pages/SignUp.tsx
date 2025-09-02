import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import nsutLogo from "@/assets/nsut-logo.svg";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";
import Header from "@/components/Header";

const Signup = () => {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState<"student" | "alumni" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // ---------------------------
  // STEP RENDERING
  // ---------------------------
  const renderStep = () => {
    // STEP 0: USER TYPE SELECTION
    if (step === 0) {
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-700 text-center">
            Select User Type
          </h2>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => {
                setUserType("student");
                nextStep();
              }}
              className="bg-[#8B0712] text-white hover:bg-gray-700"
            >
              Student
            </Button>
            <Button
              onClick={() => {
                setUserType("alumni");
                nextStep();
              }}
              className="bg-gray-600 text-white hover:bg-[#8B0712]"
            >
              Alumni
            </Button>
          </div>
        </div>
      );
    }

    // STUDENT FLOW
    if (userType === "student") {
      if (step === 1) {
        return (
          <div className="space-y-4">
            <Label>Email (must end with @nsut.ac.in)</Label>
            <Input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Button onClick={() => toast({ title: "OTP Sent!" })}>
              Send OTP
            </Button>
            <Input
              placeholder="Enter OTP"
              value={formData.otp || ""}
              onChange={(e) => handleChange("otp", e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        );
      }
      if (step === 2) {
        return (
          <div className="space-y-6">
            {/* Batch, Branch, Campus in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Input
                  id="batch"
                  value={formData.batch || ""}
                  onChange={(e) => handleChange("batch", e.target.value)}
                  placeholder="2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  value={formData.branch || ""}
                  onChange={(e) => handleChange("branch", e.target.value)}
                  placeholder="CSE"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus">Campus</Label>
                <Input
                  id="campus"
                  value={formData.campus || ""}
                  onChange={(e) => handleChange("campus", e.target.value)}
                  placeholder="Main"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 987654321"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        );

      }
      if (step === 3) {
        return (
          <div className="space-y-4">
            <Label>Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm"
            >
              {showPassword ? "Hide" : "Show"} Password
            </Button>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button
                onClick={() => toast({ title: "Student Registered!" })}
              >
                Finish
              </Button>
            </div>
          </div>
        );
      }
    }

    // ALUMNI FLOW
    if (userType === "alumni") {
      if (step === 1) {
        return (
          <div className="space-y-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Button onClick={() => toast({ title: "Verification link sent" })}>
              Send Verification Link
            </Button>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        );
      }
      if (step === 2) {
        return (
          <div className="space-y-4">
            <Label>Full Name</Label>
            <Input
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Label>Batch</Label>
            <Input
              value={formData.batch || ""}
              onChange={(e) => handleChange("batch", e.target.value)}
            />
            <Label>Branch</Label>
            <Input
              value={formData.branch || ""}
              onChange={(e) => handleChange("branch", e.target.value)}
            />
            <Label>Campus</Label>
            <Input
              value={formData.campus || ""}
              onChange={(e) => handleChange("campus", e.target.value)}
            />
            <Label>Phone Number</Label>
            <Input
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        );
      }
      if (step === 3) {
        return (
          <div className="space-y-4">
            <Label>Referral Code (Optional)</Label>
            <Input
              value={formData.referral || ""}
              onChange={(e) => handleChange("referral", e.target.value)}
            />
            <Label>Proof of Graduation (Optional)</Label>
            <Input type="file" onChange={(e) => console.log(e.target.files)} />
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </div>
        );
      }
      if (step === 4) {
        return (
          <div className="space-y-4">
            <Label>Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm"
            >
              {showPassword ? "Hide" : "Show"} Password
            </Button>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button
                onClick={() => toast({ title: "Alumni Registered!" })}
              >
                Finish
              </Button>
            </div>
          </div>
        );
      }
    }

    return null;
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
          <div className="w-full max-w-md z-10 p-8">
            <div className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <img src={nsutLogo} alt="NSUT Logo" className="h-16 w-16" />
              </div>
              <h2 className="text-3xl font-extrabold text-[#8B0712] mb-2">Create Account</h2>
              <p className="text-gray-700">Join the NSUT Alumni Portal</p>
              {/* Step Indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(userType === 'alumni' ? 5 : userType === 'student' ? 4 : 1)].map((_, i) => (
                  <span key={i} className={`h-2 w-8 rounded-full transition-all duration-300 ${step === i ? 'bg-[#8B0712]' : 'bg-gray-300'}`}></span>
                ))}
              </div>
            </div>
            <div className="pt-2 pb-2">{renderStep()}</div>
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
