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
      // Update profile data
      await api.put(
        "/profile/update",
        {
          ...formData,
          // Filter out empty experience entries
          experience: formData.experience.filter(
            (exp) => exp.company || exp.role || exp.duration
          ),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

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
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-nsut-maroon mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
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
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header/Navbar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-nsut-maroon" />
            <h1 className="text-2xl font-serif font-bold text-gray-900">NALUM Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">{profile.user.email}</span>
            <UserAvatar src={profile.profile_picture} name={profile.user.name} size="md" />
            <Button
              onClick={logout}
              variant="outline"
              className="border-nsut-maroon text-nsut-maroon hover:bg-nsut-maroon hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/dashboard/profile")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <UserAvatar
                    src={profile.profile_picture}
                    name={profile.user.name}
                    size="xl"
                  />
                  <ProfilePictureUpload
                    onImageSelect={(file) => setProfilePicture(file)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch *</Label>
                    <Input
                      id="batch"
                      value={formData.batch}
                      onChange={(e) => handleInputChange("batch", e.target.value)}
                      placeholder="e.g., 2020"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch *</Label>
                    <Input
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => handleInputChange("branch", e.target.value)}
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus">Campus *</Label>
                  <Select
                    value={formData.campus}
                    onValueChange={(value) => handleInputChange("campus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dwarka">Dwarka</SelectItem>
                      <SelectItem value="East Campus">East Campus</SelectItem>
                      <SelectItem value="Ambedkar Institute">Ambedkar Institute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Current Position */}
            <Card>
              <CardHeader>
                <CardTitle>Current Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_role">Current Role</Label>
                  <Input
                    id="current_role"
                    value={formData.current_role}
                    onChange={(e) => handleInputChange("current_role", e.target.value)}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_company">Current Company</Label>
                  <Input
                    id="current_company"
                    value={formData.current_company}
                    onChange={(e) => handleInputChange("current_company", e.target.value)}
                    placeholder="e.g., Google"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.social_media.linkedin}
                    onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.social_media.github}
                    onChange={(e) => handleSocialMediaChange("github", e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.social_media.twitter}
                    onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    value={formData.social_media.personal_website}
                    onChange={(e) => handleSocialMediaChange("personal_website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  />
                  <Button type="button" onClick={handleAddSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                      >
                        <span className="text-sm">{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Experience</CardTitle>
                  <Button type="button" onClick={handleAddExperience} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.experience.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No experience added yet. Click "Add Experience" to get started.
                  </p>
                ) : (
                  formData.experience.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">Experience {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExperience(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) =>
                              handleExperienceChange(index, "company", e.target.value)
                            }
                            placeholder="Company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Input
                            value={exp.role}
                            onChange={(e) =>
                              handleExperienceChange(index, "role", e.target.value)
                            }
                            placeholder="Your role"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            value={exp.duration}
                            onChange={(e) =>
                              handleExperienceChange(index, "duration", e.target.value)
                            }
                            placeholder="e.g., Jan 2020 - Dec 2022"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-nsut-maroon hover:bg-nsut-maroon/90"
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