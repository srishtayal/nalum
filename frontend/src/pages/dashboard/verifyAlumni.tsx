import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
import { ShieldCheck, Mail, Database, UserCheck, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";

interface VerificationMatch {
  name: string;
  roll_no: string;
  batch: string;
  branch: string;
  similarity: number;
}

interface VerificationStatus {
  verified_alumni: boolean;
}

interface ApiErrorResponse {
  message?: string;
}

const VerifyAlumni = () => {
  const { accessToken ,role } = useAuth();
  const [activeMethod, setActiveMethod] = useState<'code' | 'database' | 'manual' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | undefined>(undefined);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Code verification state
  const [verificationCode, setVerificationCode] = useState("");

  // Database verification state
  const [dbName, setDbName] = useState("");
  const [dbRollNo, setDbRollNo] = useState("");
  const [dbBatch, setDbBatch] = useState("");
  const [dbBranch, setDbBranch] = useState("");
  const [matches, setMatches] = useState<VerificationMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  // Manual verification state
  const [manualName, setManualName] = useState("");
  const [manualRollNo, setManualRollNo] = useState("");
  const [manualBatch, setManualBatch] = useState("");
  const [manualBranch, setManualBranch] = useState("");
  const [manualSubmitted, setManualSubmitted] = useState(false);

  // Check verification status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await api.get('/alumni/status', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setVerificationStatus(response.data);
      } catch (error) {
        console.error('Error checking verification status:', error);
        toast.error('Failed to check verification status');
      } finally {
        setIsCheckingStatus(false);
      }
    };

    if (accessToken) {
      checkStatus();
    }
  }, [accessToken]);

  // Method 1: Code Verification
  const handleCodeVerification = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter a verification code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/alumni/verify-code', 
        { code: verificationCode },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        toast.success('🎉 Alumni status verified successfully!');
        setVerificationStatus({ verified_alumni: true });
        setVerificationCode("");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || 'Verification failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Method 2: Database Verification
  const handleDatabaseCheck = async () => {
    if (!dbName.trim() || !dbBatch.trim() || !dbBranch) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setMatches([]);
    setSelectedMatch(null);

    try {
      const response = await api.post('/alumni/check-manual',
        {
          name: dbName,
          roll_no: dbRollNo,
          batch: dbBatch,
          branch: dbBranch
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        const foundMatches = response.data.matches || [];
        
        if (foundMatches.length > 0) {
          setMatches(foundMatches);
          toast.success(`Found ${foundMatches.length} potential match(es)!`);
        } else {
          toast.info('No exact matches found. Your request has been sent to admins for manual verification.');
          setManualSubmitted(true);
          setActiveMethod('manual');
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || 'Database check failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMatch = async () => {
    if (!selectedMatch) {
      toast.error('Please select a match to confirm');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/alumni/confirm-match',
        { roll_no: selectedMatch },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        toast.success('🎉 Alumni status verified successfully!');
        setVerificationStatus({ verified_alumni: true });
        setMatches([]);
        setSelectedMatch(null);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || 'Confirmation failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Method 3: Manual Verification (Admin Review)
  const handleManualSubmit = async () => {
    if (!manualName.trim() || !manualBatch.trim() || !manualBranch) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/alumni/check-manual',
        {
          name: manualName,
          roll_no: manualRollNo,
          batch: manualBatch,
          branch: manualBranch
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Your verification request has been submitted to admins for review');
        setManualSubmitted(true);
        // Clear form
        setManualName("");
        setManualRollNo("");
        setManualBatch("");
        setManualBranch("");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || 'Submission failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-nsut-maroon mx-auto mb-4" />
          <p className="text-gray-600">Checking verification status...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus?.verified_alumni) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Alumni Status Verified! 🎉</h2>
              <p className="text-gray-600 mb-6">
                Your alumni status has been successfully verified. You now have full access to all dashboard features.
              </p>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-nsut-maroon hover:bg-nsut-maroon/90"
              >
                Go to Dashboard
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <ShieldCheck className="h-16 w-16 text-nsut-maroon mx-auto mb-4" />
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              Verify Your Alumni Status
            </h1>
            <p className="text-lg text-gray-600">
              Complete verification to unlock all dashboard features
            </p>
          </div>

          {/* Verification Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Method 1: Code Verification */}
            <Card 
              className={`p-6 cursor-pointer transition-all border-2 ${
                activeMethod === 'code' 
                  ? 'border-nsut-maroon bg-nsut-maroon/5' 
                  : 'border-gray-200 hover:border-nsut-maroon/50'
              }`}
              onClick={() => setActiveMethod('code')}
            >
              <Mail className="h-10 w-10 text-nsut-maroon mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Verification Code</h3>
              <p className="text-sm text-gray-600">
                Use the 10-digit code sent to your alumni email
              </p>
            </Card>

            {/* Method 2: Database Check */}
            <Card 
              className={`p-6 cursor-pointer transition-all border-2 ${
                activeMethod === 'database' 
                  ? 'border-nsut-maroon bg-nsut-maroon/5' 
                  : 'border-gray-200 hover:border-nsut-maroon/50'
              }`}
              onClick={() => setActiveMethod('database')}
            >
              <Database className="h-10 w-10 text-nsut-maroon mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Database Check</h3>
              <p className="text-sm text-gray-600">
                Verify against college alumni database
              </p>
            </Card>

            {/* Method 3: Manual Verification */}
            <Card 
              className={`p-6 cursor-pointer transition-all border-2 ${
                activeMethod === 'manual' 
                  ? 'border-nsut-maroon bg-nsut-maroon/5' 
                  : 'border-gray-200 hover:border-nsut-maroon/50'
              }`}
              onClick={() => setActiveMethod('manual')}
            >
              <UserCheck className="h-10 w-10 text-nsut-maroon mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Manual Review</h3>
              <p className="text-sm text-gray-600">
                Submit details for admin verification
              </p>
            </Card>
          </div>

          {/* Verification Forms */}
          {activeMethod && (
            <Card className="p-8">
              {/* Code Verification Form */}
              {activeMethod === 'code' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Enter Verification Code
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Enter the 10-digit verification code that was sent to your registered alumni email address.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="code">Verification Code</Label>
                      <Input
                        id="code"
                        placeholder="Enter 10-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={10}
                        className="font-mono tracking-wider"
                      />
                    </div>

                    <Button
                      onClick={handleCodeVerification}
                      disabled={isLoading || verificationCode.length !== 10}
                      className="w-full bg-nsut-maroon hover:bg-nsut-maroon/90"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify Code'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Database Check Form */}
              {activeMethod === 'database' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Database Verification
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Enter your details to check against the college alumni database.
                  </p>

                  {matches.length === 0 ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="db-name">Full Name *</Label>
                        <Input
                          id="db-name"
                          placeholder="Enter your full name"
                          value={dbName}
                          onChange={(e) => setDbName(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="db-roll">Roll Number (Optional)</Label>
                        <Input
                          id="db-roll"
                          placeholder="Enter your roll number"
                          value={dbRollNo}
                          onChange={(e) => setDbRollNo(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="db-batch">Batch/Year *</Label>
                          <Input
                            id="db-batch"
                            placeholder="e.g., 2020"
                            value={dbBatch}
                            onChange={(e) => setDbBatch(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="db-branch">Branch *</Label>
                          <Select value={dbBranch} onValueChange={setDbBranch}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CSE">Computer Science</SelectItem>
                              <SelectItem value="IT">Information Technology</SelectItem>
                              <SelectItem value="ECE">Electronics & Communication</SelectItem>
                              <SelectItem value="EE">Electrical Engineering</SelectItem>
                              <SelectItem value="ME">Mechanical Engineering</SelectItem>
                              <SelectItem value="ICE">Instrumentation & Control</SelectItem>
                              <SelectItem value="MPAE">Manufacturing Process & Automation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        onClick={handleDatabaseCheck}
                        disabled={isLoading}
                        className="w-full bg-nsut-maroon hover:bg-nsut-maroon/90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Checking Database...
                          </>
                        ) : (
                          'Check Database'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800 font-medium">
                          Found {matches.length} potential match(es). Please select your record:
                        </p>
                      </div>

                      <div className="space-y-3">
                        {matches.map((match, index) => (
                          <div
                            key={index}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              selectedMatch === match.roll_no
                                ? 'border-nsut-maroon bg-nsut-maroon/5'
                                : 'border-gray-200 hover:border-nsut-maroon/50'
                            }`}
                            onClick={() => setSelectedMatch(match.roll_no)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{match.name}</p>
                                <p className="text-sm text-gray-600">Roll No: {match.roll_no}</p>
                                <p className="text-sm text-gray-600">
                                  {match.branch} • Batch {match.batch}
                                </p>
                              </div>
                              {match.similarity && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {(match.similarity * 100).toFixed(0)}% match
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleConfirmMatch}
                          disabled={!selectedMatch || isLoading}
                          className="flex-1 bg-nsut-maroon hover:bg-nsut-maroon/90"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            'Confirm Selection'
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setMatches([]);
                            setSelectedMatch(null);
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Manual Verification Form */}
              {activeMethod === 'manual' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Manual Verification Request
                  </h3>
                  
                  {manualSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Request Submitted Successfully
                      </h4>
                      <p className="text-gray-600 mb-6">
                        Your verification request has been sent to the admin team. You'll receive an email once your status is reviewed.
                      </p>
                      <Button
                        onClick={() => setManualSubmitted(false)}
                        variant="outline"
                      >
                        Submit Another Request
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-6">
                        Submit your details for manual verification by the admin team. This process may take 2-3 business days.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="manual-name">Full Name *</Label>
                          <Input
                            id="manual-name"
                            placeholder="Enter your full name"
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="manual-roll">Roll Number (Optional)</Label>
                          <Input
                            id="manual-roll"
                            placeholder="Enter your roll number"
                            value={manualRollNo}
                            onChange={(e) => setManualRollNo(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="manual-batch">Batch/Year *</Label>
                            <Input
                              id="manual-batch"
                              placeholder="e.g., 2020"
                              value={manualBatch}
                              onChange={(e) => setManualBatch(e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor="manual-branch">Branch *</Label>
                            <Select value={manualBranch} onValueChange={setManualBranch}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CSE">Computer Science</SelectItem>
                                <SelectItem value="IT">Information Technology</SelectItem>
                                <SelectItem value="ECE">Electronics & Communication</SelectItem>
                                <SelectItem value="EE">Electrical Engineering</SelectItem>
                                <SelectItem value="ME">Mechanical Engineering</SelectItem>
                                <SelectItem value="ICE">Instrumentation & Control</SelectItem>
                                <SelectItem value="MPAE">Manufacturing Process & Automation</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Please ensure all information is accurate. The admin team will verify your details against college records.
                          </p>
                        </div>

                        <Button
                          onClick={handleManualSubmit}
                          disabled={isLoading}
                          className="w-full bg-nsut-maroon hover:bg-nsut-maroon/90"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit for Review'
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* Help Section */}
          <Card className="mt-8 p-6 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• <strong>Verification Code:</strong> Check your alumni email for the 10-digit code</p>
              <p>• <strong>Database Check:</strong> Use your official name and details as registered with the college</p>
              <p>• <strong>Manual Review:</strong> Contact admin@nsut.ac.in if you face issues</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerifyAlumni;
