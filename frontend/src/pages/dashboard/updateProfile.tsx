import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import { toast } from "sonner";

interface Experience {
  company: string;
  role: string;
  duration: string;
}

interface Profile {
  user: {
    name: string;
    email: string;
  };
  batch: string;
  branch: string;
  campus: string;
  current_company?: string;
  current_role?: string;
  profile_picture?: string;
  social_media?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    personal_website?: string;
  };
  skills?: string[];
  experience?: Experience[];
}

const UpdateProfile = () => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const [formData, setFormData] = useState({
    batch: "",
    branch: "",
    campus: "",
    current_company: "",
    current_role: "",
    social_media: {
      linkedin: "",
      github: "",
      twitter: "",
      personal_website: "",
    },
    skills: [] as string[],
    experience: [] as Experience[],
  });

  const [newSkill, setNewSkill] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const profileData = response.data.profile;
        setProfile(profileData);
        
        setFormData({
          batch: profileData.batch || "",
          branch: profileData.branch || "",
          campus: profileData.campus || "",
          current_company: profileData.current_company || "",
          current_role: profileData.current_role || "",
          social_media: {
            linkedin: profileData.social_media?.linkedin || "",
            github: profileData.social_media?.github || "",
            twitter: profileData.social_media?.twitter || "",
            personal_website: profileData.social_media?.personal_website || "",
          },
          skills: profileData.skills || [],
          experience: profileData.experience || [],
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile", {
          description: "Please try again later",
          style: {
            background: "#800000",
            color: "white",
            border: "2px solid #FFD700",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value,
      },
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", duration: "" },
      ],
    }));
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Prepare update data - only include fields that have values
      const updateData: any = {};
      
      // Required fields - only if all three are present
      if (formData.batch && formData.branch && formData.campus) {
        updateData.batch = formData.batch;
        updateData.branch = formData.branch;
        updateData.campus = formData.campus;
      }
      
      // Optional fields
      if (formData.current_company !== undefined) updateData.current_company = formData.current_company;
      if (formData.current_role !== undefined) updateData.current_role = formData.current_role;
      if (formData.social_media) updateData.social_media = formData.social_media;
      if (formData.skills) updateData.skills = formData.skills;
      
      // Filter out empty experience entries
      if (formData.experience && formData.experience.length > 0) {
        updateData.experience = formData.experience.filter(
          (exp) => exp.company || exp.role || exp.duration
        );
      }

      console.log('Sending update data:', updateData);

      // Update profile data
      await api.put("/profile/update", updateData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Upload profile picture if changed
      if (profilePicture) {
        const pictureFormData = new FormData();
        pictureFormData.append("profile_picture", profilePicture);
        
        await api.post("/profile/picture", pictureFormData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("Profile Updated!", {
        description: "Your changes have been saved successfully",
        style: {
          background: "#800000",
          color: "white",
          border: "2px solid #FFD700",
        },
      });

      navigate("/dashboard/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update Failed", {
        description: "Failed to update profile. Please try again.",
        style: {
          background: "#800000",
          color: "white",
          border: "2px solid #FFD700",
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Profile not found</p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-100">
      {/* Main Content */}
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => navigate("/dashboard/profile")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <UserAvatar
                  src={profile.profile_picture}
                  name={profile.user.name}
                  size="xl"
                  className="ring-4 ring-white/10"
                />
                <ProfilePictureUpload
                  onImageSelect={(file) => setProfilePicture(file)}
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Academic Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch" className="text-gray-300">Batch *</Label>
                    <Input
                      id="batch"
                      value={formData.batch}
                      onChange={(e) => handleInputChange("batch", e.target.value)}
                      placeholder="e.g., 2020"
                      required
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch" className="text-gray-300">Branch *</Label>
                    <Input
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => handleInputChange("branch", e.target.value)}
                      placeholder="e.g., Computer Science"
                      required
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus" className="text-gray-300">Campus *</Label>
                  <Select
                    value={formData.campus}
                    onValueChange={(value) => handleInputChange("campus", value)}
                  >
                    <SelectTrigger className="bg-black/20 border-white/10 text-white focus:ring-blue-500/20">
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="Main Campus">Main Campus</SelectItem>
                      <SelectItem value="West Campus">West Campus</SelectItem>
                      <SelectItem value="East Campus">East Campus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Current Position */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Current Position</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_role" className="text-gray-300">Current Role</Label>
                  <Input
                    id="current_role"
                    value={formData.current_role}
                    onChange={(e) => handleInputChange("current_role", e.target.value)}
                    placeholder="e.g., Software Engineer"
                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_company" className="text-gray-300">Current Company</Label>
                  <Input
                    id="current_company"
                    value={formData.current_company}
                    onChange={(e) => handleInputChange("current_company", e.target.value)}
                    placeholder="e.g., Google"
                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Social Media Links</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-gray-300">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.social_media.linkedin}
                    onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-gray-300">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.social_media.github}
                    onChange={(e) => handleSocialMediaChange("github", e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-gray-300">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.social_media.twitter}
                    onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-300">Personal Website</Label>
                  <Input
                    id="website"
                    value={formData.social_media.personal_website}
                    onChange={(e) => handleSocialMediaChange("personal_website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                  <Button type="button" onClick={handleAddSkill} className="bg-blue-600 hover:bg-blue-500 text-white">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-white/10 border border-white/5 px-3 py-1 rounded-full text-gray-200"
                      >
                        <span className="text-sm">{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-red-400 hover:text-red-300 ml-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Experience</h3>
                <Button type="button" onClick={handleAddExperience} size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <div className="space-y-6">
                {formData.experience.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No experience added yet. Click "Add Experience" to get started.
                  </p>
                ) : (
                  formData.experience.map((exp, index) => (
                    <div key={index} className="p-4 border border-white/10 rounded-lg space-y-4 bg-black/20">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-200">Experience {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExperience(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) =>
                              handleExperienceChange(index, "company", e.target.value)
                            }
                            placeholder="Company name"
                            className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Role</Label>
                          <Input
                            value={exp.role}
                            onChange={(e) =>
                              handleExperienceChange(index, "role", e.target.value)
                            }
                            placeholder="Your role"
                            className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Duration</Label>
                          <Input
                            value={exp.duration}
                            onChange={(e) =>
                              handleExperienceChange(index, "duration", e.target.value)
                            }
                            placeholder="e.g., Jan 2020 - Dec 2022"
                            className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/profile")}
                disabled={isSaving}
                className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;