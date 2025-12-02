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
  const [isSendingOtp, setIsSendingOtp] = useState(false);
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
      
      setIsSendingOtp(true);
      await api.post('/auth/send-otp', { email });
      toast({ 
        title: "OTP sent successfully!", 
        description: "Please check your email inbox (and spam folder)"
      });
      setIsOtpSent(true);
      setIsVerificationDisabled(true);
      setTimer(60);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({ 
          title: error.response?.data?.message || "Failed to send OTP", 
          description: "Please try again or contact support if the issue persists",
          variant: "destructive" 
        });
      } else {
        toast({ title: "An error occurred", variant: "destructive" });
      }
    } finally {
      setIsSendingOtp(false);
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-900">Email Address</Label>
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={true}
            readOnly={true}
            className="flex-1 h-12 bg-gray-50 cursor-not-allowed"
          />
          <Button
            onClick={sendOtp}
            disabled={isVerificationDisabled || isSendingOtp}
            className="bg-nsut-maroon hover:bg-nsut-maroon/90 text-white font-semibold px-6 min-w-[120px]"
          >
            {isSendingOtp ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Sending...
              </span>
            ) : isVerificationDisabled ? (
              `${timer}s`
            ) : (
              "Send OTP"
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          OTP will be sent to this email address
        </p>
      </div>
      {isOtpSent && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ✉️ We've sent a 6-digit verification code to <strong>{email}</strong>. Please check your inbox (and spam folder) and enter the code below.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              ⏱️ Note: Email delivery may take 10-30 seconds depending on server load.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-gray-900">Verification Code</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="h-12 text-center text-2xl tracking-widest font-semibold"
            />
          </div>
          <Button 
            onClick={verifyOtp} 
            className="w-full h-12 bg-nsut-maroon hover:bg-nsut-maroon/90 text-white font-semibold text-base"
          >
            Verify Email
          </Button>
          {!isVerificationDisabled && (
            <p className="text-center text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                onClick={sendOtp}
                className="font-medium text-nsut-maroon hover:text-nsut-maroon/80"
              >
                Resend OTP
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailVerification;