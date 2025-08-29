import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowLeft, GraduationCap, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import nsutLogo from "@/assets/nsut-logo.svg";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful!",
        description: "Welcome back to NSUT Alumni Portal",
      });
      // Here you would redirect to dashboard
      console.log("Login attempt:", formData);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative p-4"
      style={{
        backgroundImage: `url(${nsutCampusHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Maroon overlay */}
      <div className="absolute inset-0 bg-[#8B0712] bg-opacity-80 pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        {/* Campus Hero Image */}
        {/* <div className="flex justify-center mb-8">
          <img 
          src={nsutCampusHero} 
          alt="NSUT Campus" 
          className="h-32 w-auto rounded-xl shadow-lg object-cover" 
        />
        </div> */}
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-100 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="card-elevated">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img src={nsutLogo} alt="NSUT Logo" className="h-16 w-16" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-600">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-800">
              Sign in to your NSUT Alumni account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
              {/* Email Field */}
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
                {errors.email && (
                  <p className="text-sm text-red-300">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
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
                {errors.password && (
                  <p className="text-sm text-red-300">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-800">
                    Remember me
                  </Label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-gray-800 hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
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
                  <span className="bg-card px-2 text-gray-800">
                    New to NSUT Alumni?
                  </span>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-100">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="font-medium text-white underline hover:text-gray-300"
                >
                  Create your account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alumni Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4 mr-2 text-gray-100" />
            <span className="text-gray-100">NSUT Alumni Portal - Since 1983</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;