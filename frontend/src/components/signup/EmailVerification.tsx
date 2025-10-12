import { useState, useEffect } from "react";
import axios from "axios";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EmailVerificationProps {
  email: string;
  onEmailChange: (email: string) => void;
  onVerified: () => void;
}

const EmailVerification = ({ email, onEmailChange, onVerified }: EmailVerificationProps) => {
  const { toast } = useToast();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerificationDisabled, setIsVerificationDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isVerificationDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsVerificationDisabled(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVerificationDisabled, timer]);

  const sendOtp = async () => {
    try {
      if (!email) {
        toast({ title: "Please enter your email", variant: "destructive" });
        return;
      }
      await api.post('/auth/send-otp', { email });
      toast({ title: "OTP sent to your email!" });
      setIsOtpSent(true);
      setIsVerificationDisabled(true);
      setTimer(60);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({ title: error.response?.data?.message || "An error occurred", variant: "destructive" });
      } else {
        toast({ title: "An error occurred", variant: "destructive" });
      }
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await api.post('/auth/verify-account-otp', { email, otp });
      if (!response.data.err) {
        toast({ title: "Email verified successfully!" });
        onVerified();
      } else {
        toast({ title: response.data.message || "Invalid OTP", variant: "destructive" });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({ title: error.response?.data?.message || "An error occurred", variant: "destructive" });
      } else {
        toast({ title: "An error occurred", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Verify Your Email</h3>
      <p className="text-sm text-gray-200">
        We'll send a 6-digit OTP to your email address to get started.
      </p>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email Address</Label>
        <div className="flex gap-2 pd-2">
          <Input
            id="email"
            type="email"
            placeholder="e.g., your.email@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={isOtpSent}
            className="bg-white/20 border-none text-white"
          />
          <Button
            onClick={sendOtp}
            disabled={isVerificationDisabled}
            className="bg-[#8B0712] text-white hover:bg-gray-700"
          >
            {isVerificationDisabled ? `Resend in ${timer}s` : "Send OTP"}
          </Button>
        </div>
      </div>
      {isOtpSent && (
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-white">Enter OTP</Label>
          <Input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="bg-white/20 border-none text-white"
          />
          <Button onClick={verifyOtp} className="w-full bg-[#8B0712] text-white hover:bg-gray-700">Verify OTP</Button>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;