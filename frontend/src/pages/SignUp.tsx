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
import { GraduationCap, Mail, Lock, User } from "lucide-react";
import nsutLogo from "@/assets/nsut-logo.svg";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";

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
    <>
      <style>{`
        .signup-input {
          transition: all 0.3s ease;
        }
        .signup-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
        }
        .signup-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .signup-button::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .signup-button:hover::before {
          width: 300px;
          height: 300px;
        }
        .signup-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(192, 4, 4, 0.3);
        }
        .signup-link {
          position: relative;
          transition: color 0.3s ease;
        }
        .signup-link::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #FFD700 0%, #C00404 100%);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .signup-link:hover::after {
          width: 100%;
        }
      `}</style>
      <div
        className="min-h-screen flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${nsutCampusHero})` }}
      >
        <div className="flex flex-1 h-full w-full items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg p-4">
                    <img src={nsutLogo} alt="NSUT Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
                <h2 className="text-3xl font-serif font-bold text-white mb-2">
                  Create Account
                </h2>
                <p className="text-white/90">Join the NSUT Alumni Portal</p>
              </div>

              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="signup-input pl-11 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:bg-white/25 focus-visible:ring-white/50 focus-visible:border-white/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="signup-input pl-11 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:bg-white/25 focus-visible:ring-white/50 focus-visible:border-white/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white font-medium">Are you a student or an alumnus?</Label>
                  <Select
                    onValueChange={(value) => handleChange("role", value)}
                    defaultValue="student"
                  >
                    <SelectTrigger className="h-12 bg-white/20 border-white/30 text-white focus:ring-white/50 focus:border-white/50">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="signup-input pl-11 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:bg-white/25 focus-visible:ring-white/50 focus-visible:border-white/50"
                    />
                  </div>
                </div>
                
                {unverifiedEmail ? (
                  <div className="text-sm text-center text-white/90">
                    Looks like the email you entered isn't verified, verify by{" "}
                    <Link
                      to="/otp-verification"
                      state={{ email: formData.email }}
                      className="font-semibold text-nsut-yellow signup-link"
                    >
                      clicking here
                    </Link>
                  </div>
                ) : (
                  <Button
                    onClick={handleSignUp}
                    type="button"
                    className="signup-button w-full h-12 bg-nsut-maroon hover:bg-[#800000] text-white font-semibold text-base relative z-10"
                  >
                    Sign Up
                  </Button>
                )}
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/10 backdrop-blur-xl px-3 text-white/80 font-medium">
                      Already a member?
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-white">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-nsut-yellow signup-link"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/30">
                <div className="flex items-center justify-center text-sm text-white/90">
                  <GraduationCap className="h-4 w-4 mr-2 text-nsut-yellow" />
                  <span>NSUT Alumni Portal - Since 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
