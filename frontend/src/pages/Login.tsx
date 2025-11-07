import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import nsutLogo from "@/assets/nsut-logo.svg";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";
import apiClient from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { accessToken, setAuth } = useAuth();
  const navigate = useNavigate();

  // handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Email + Password validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await apiClient.post("/auth/sign-in", formData);
      const { access_token, email, user } = response.data.data;
      const verified_alumni = user?.verified_alumni || false;
      setAuth(access_token, email, verified_alumni);
      toast({
        title: "Login Successful!",
        description: "Welcome back to the NSUT Alumni Portal 🎉",
      });

      // Check profile completion status
      const profileStatusResponse = await apiClient.get("/profile/status", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log("Profile Status Response:", profileStatusResponse.data);
      if (!profileStatusResponse.data.profileCompleted) {
        navigate("/profile-form");
      } else {
        navigate("/home");
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        error.response?.data?.code === 401
      ) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email before logging in.",
          variant: "destructive",
        });
        navigate("/otp-verification", { state: { email: formData.email } });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        console.error("Login error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-input {
          transition: all 0.3s ease;
        }
        .login-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(192, 4, 4, 0.1);
        }
        .login-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .login-button::before {
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
        .login-button:hover::before {
          width: 300px;
          height: 300px;
        }
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(192, 4, 4, 0.3);
        }
        .login-link {
          position: relative;
          transition: color 0.3s ease;
        }
        .login-link::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #FFD700 0%, #C00404 100%);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .login-link:hover::after {
          width: 100%;
        }
        .login-link:hover {
          color: #C00404;
        }
      `}</style>
      <div 
        className="min-h-screen flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${nsutCampusHero})` }}
      >
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Glassmorphism Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg p-4">
                    <img src={nsutLogo} alt="NSUT Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
                <h2 className="text-3xl font-serif font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-white/90">
                  Sign in to your NSUT Alumni account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`login-input pl-11 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:bg-white/25 ${
                        errors.email 
                          ? "border-red-400 focus-visible:ring-red-400" 
                          : "focus-visible:ring-white/50 focus-visible:border-white/50"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-300 flex items-center gap-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`login-input pl-11 pr-11 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:bg-white/25 ${
                        errors.password 
                          ? "border-red-400 focus-visible:ring-red-400" 
                          : "focus-visible:ring-white/50 focus-visible:border-white/50"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-white/70 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-300 flex items-center gap-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-nsut-yellow border-white/30 rounded focus:ring-nsut-yellow bg-white/20"
                    />
                    <Label htmlFor="remember" className="text-sm text-white cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-white login-link font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="login-button w-full h-12 bg-nsut-maroon hover:bg-[#800000] text-white font-semibold text-base relative z-10"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/10 backdrop-blur-xl px-3 text-white/80 font-medium">
                      New to NSUT Alumni?
                    </span>
                  </div>
                </div>
              </div>

              {/* Signup Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-white">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-nsut-yellow login-link"
                  >
                    Create your account
                  </Link>
                </p>
              </div>

              {/* Footer Badge */}
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

export default Login;
