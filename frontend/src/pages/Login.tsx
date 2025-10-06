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
import { Eye, EyeOff, ArrowLeft, GraduationCap, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import nsutLogo from "@/assets/nsut-logo.svg";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";
import Header from "@/components/Header";
import apiClient from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { accessToken, setAccessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect in Login triggered with accessToken:", accessToken);
    if (accessToken) {
      navigate("/home");
    }
  }, [accessToken, navigate]);

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
      const { access_token } = response.data.data;
      setAccessToken(access_token);
      toast({
        title: "Login Successful!",
        description: "Welcome back to the NSUT Alumni Portal 🎉",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#8B0712] flex flex-col">
      <Header />
      <div className="flex flex-1 h-full w-full">
        {/* Left: Campus Image Full Screen */}
        <div className="hidden md:flex w-3/5 h-full items-center justify-center bg-[#8B0712]">
          <img
            src={nsutCampusHero}
            alt="NSUT Campus"
            className="object-cover w-full h-full max-h-screen rounded-none"
            style={{ minHeight: '100vh' }}
          />
           <div className="absolute inset-0 hero-gradient opacity-35 w-3/5"></div>
        </div>
        {/* Right: Login Form Full Screen */}
        <div className="w-full md:w-2/5 min-h-full flex items-center justify-center bg-white">
          <div className="w-full max-w-md z-10">
            <div>
              <div className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <img src={nsutLogo} alt="NSUT Logo" className="h-16 w-16" />
                </div>
                <h2 className="text-2xl font-bold text-gray-600">Welcome Back</h2>
                <p className="text-gray-800">Sign in to your NSUT Alumni account</p>
              </div>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-800" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
                </div>
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-800">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-800" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
                </div>
                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-800">Remember me</Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gray-800 hover:text-[#8B0712]"
                  >
                    Forgot password?
                  </Link>
                </div>
                {/* Submit */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full bg-[#8B0712] text-white hover:bg-white hover:text-[#8B0712] border-none"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-800">New to NSUT Alumni?</span>
                  </div>
                </div>
              </div>
              {/* Signup Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-800">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-[#8B0712] underline hover:text-gray-600"
                  >
                    Create your account
                  </Link>
                </p>
              </div>
            </div>
            {/* Footer Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center text-sm text-gray-100">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>NSUT Alumni Portal - Since 1983</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
