import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  GraduationCap,
  Mail,
  Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import nsutLogo from "@/assets/nsut-logo.svg";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";
import Header from "@/components/Header";
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

      navigate("/dashboard");
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
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-200">Sign in to your NSUT Alumni account</p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-200">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-black" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 bg-white/20 border-none text-white ${
                    errors.email ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-black" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`pl-10 pr-10 bg-white/20 border-none text-white ${
                    errors.password ? "border-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
            </div>
            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <Label htmlFor="remember" className="text-sm text-white">
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-white hover:text-gray-300"
              >
                Forgot password?
              </Link>
            </div>
            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full bg-[#8B0712] text-white hover:bg-white hover:text-[black] border-none"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-white">
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
                className="font-medium text-white underline hover:text-gray-300"
              >
                Create your account
              </Link>
            </p>
          </div>
          {/* Footer Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center text-sm text-gray-300">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span>NSUT Alumni Portal - Since 1983</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
