import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import nsutLogo from "@/assets/nsut-logo.svg";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";
import Header from "@/components/Header";

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
  });
  const [unverifiedEmail, setUnverifiedEmail] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    try {
      const response = await api.post('/auth/sign-up', {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        }
      );

      if (!response.data.err) {
        toast({ title: "Registration successful! Please verify your email." });
        navigate("/otp-verification", { state: { email: formData.email } });
      } else {
        toast({
          title: response.data.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.code === "USER_NOT_VERIFIED") {
          setUnverifiedEmail(true);
          toast({
            title: "Email not verified",
            description: "This email is already registered but not verified.",
            variant: "destructive",
          });
        } else {
          toast({
            title: error.response?.data?.message || "An error occurred",
            variant: "destructive",
          });
        }
      } else {
        toast({ title: "An error occurred", variant: "destructive" });
      }
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${nsutCampusHero})` }}
    >
      <Header />
      <div className="flex flex-1 h-full w-full items-center justify-center">
        <div className="w-full max-w-md z-10 px-6 py-8 bg-black/30 backdrop-blur-md rounded-lg shadow-lg border border-white/30">
          <div className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img src={nsutLogo} alt="NSUT Logo" className="h-16 w-16" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-200">Join the NSUT Alumni Portal</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                placeholder=""
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-white/20 border-none text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-white/20 border-none text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Are you a student or an alumnus?</Label>
              <Select
                onValueChange={(value) => handleChange("role", value)}
                defaultValue="student"
              >
                <SelectTrigger className="bg-white/20 border-none text-white">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                onChange={(e) => handleChange("password", e.target.value)}
                className="bg-white/20 border-none text-white"
              />
            </div>
            {unverifiedEmail ? (
              <div className="text-sm text-center text-gray-200">
                Looks like the email you entered isn't verified, verify by{" "}
                <Link
                  to="/otp-verification"
                  state={{ email: formData.email }}
                  className="font-semibold text-white underline hover:text-gray-300"
                >
                  clicking here
                </Link>
              </div>
            ) : (
              <Button
                onClick={handleSignUp}
                className="w-full bg-[#8B0712] text-white hover:bg-gray-700"
              >
                Sign Up
              </Button>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-200">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-white underline hover:text-gray-300"
              >
                Sign In
              </Link>
            </p>
          </div>
          <div className="mt-6 text-center text-sm text-gray-300">
            <GraduationCap className="h-4 w-4 inline mr-2" />
            NSUT Alumni Portal - Since 1983
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
