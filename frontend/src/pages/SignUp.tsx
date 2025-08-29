import { useState } from "react";
import { Link } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
} from "lucide-react";
import nsutLogo from "@/assets/nsut-logo.svg";
import nsutCampusHero from "@/assets/nsut-campus-hero.png";

const SignUp = () => {
  const [formData, setFormData] = useState<any>({
    email: "",
    name: "",
    batch: "",
    branch: "",
    campus: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    identityProof: null,
  });
  const [userType, setUserType] = useState<"student" | "alumni" | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userType) newErrors.userType = "Please select Student or Alumni";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (
      userType === "student" &&
      !formData.email.endsWith("@nsut.ac.in")
    ) {
      newErrors.email = "Students must register with @nsut.ac.in email";
    }

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.batch) newErrors.batch = "Batch is required";
    if (!formData.branch) newErrors.branch = "Branch is required";
    if (!formData.campus) newErrors.campus = "Campus is required";

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special char";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Enter email before sending OTP" }));
      return;
    }
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `Verification code sent to ${formData.email}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!otp) {
      toast({
        title: "Enter OTP",
        description: "Please enter the OTP sent to your email",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (userType === "alumni" && !formData.referralCode) {
        toast({
          title: "Registration Pending",
          description: "Your alumni account is pending admin verification.",
        });
      } else {
        toast({
          title: "Registration Successful!",
          description: "Welcome to the NSUT Alumni Portal.",
        });
      }
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${nsutCampusHero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-[#8B0712]  bg-opacity-70" />
      <div className="w-full max-w-lg relative z-10">
        <Link
          to="/"
          className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="bg-white/95 shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img src={nsutLogo} alt="NSUT Logo" className="h-16 w-16" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Join the NSUT Alumni & Student Network
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Type */}
              <div className="space-y-2">
                <Label className="text-gray-800">User Type</Label>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={userType === "student" ? "default" : "outline"}
                    onClick={() => setUserType("student")}
                  >
                    Student
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "alumni" ? "default" : "outline"}
                    onClick={() => setUserType("alumni")}
                  >
                    Alumni
                  </Button>
                </div>
                {errors.userType && (
                  <p className="text-sm text-red-600">{errors.userType}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-600" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* OTP */}
              {!otpSent ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendOtp}
                  className="w-full"
                >
                  Send OTP
                </Button>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-gray-800">
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-800">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`pl-10 ${errors.name ? "border-red-600" : ""}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Batch/Branch/Campus */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch" className="text-gray-800">
                    Batch
                  </Label>
                  <Input
                    id="batch"
                    placeholder="2025"
                    value={formData.batch}
                    onChange={(e) => handleInputChange("batch", e.target.value)}
                    className={errors.batch ? "border-red-600" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-gray-800">
                    Branch
                  </Label>
                  <Input
                    id="branch"
                    placeholder="CSE"
                    value={formData.branch}
                    onChange={(e) => handleInputChange("branch", e.target.value)}
                    className={errors.branch ? "border-red-600" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus" className="text-gray-800">
                    Campus
                  </Label>
                  <Input
                    id="campus"
                    placeholder="Main"
                    value={formData.campus}
                    onChange={(e) => handleInputChange("campus", e.target.value)}
                    className={errors.campus ? "border-red-600" : ""}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-800">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`pl-10 ${errors.phone ? "border-red-600" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-800">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`pl-10 ${errors.password ? "border-red-600" : ""}`}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-800">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={errors.confirmPassword ? "border-red-600" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Alumni-only */}
              {userType === "alumni" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="referralCode" className="text-gray-800">
                      Referral Code (Optional)
                    </Label>
                    <Input
                      id="referralCode"
                      placeholder="Enter referral code (if any)"
                      value={formData.referralCode}
                      onChange={(e) =>
                        handleInputChange("referralCode", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="identityProof" className="text-gray-800">
                      Identity/Graduation Proof (Optional)
                    </Label>
                    <Input
                      id="identityProof"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) =>
                        handleInputChange(
                          "identityProof",
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </div>
                </>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#8B0712] hover:bg-[#a50c1a] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Already have account */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#8B0712] hover:text-[#a50c1a]"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center text-sm text-gray-300">
            <GraduationCap className="h-4 w-4 mr-2" />
            NSUT Alumni Portal - Since 1983
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
