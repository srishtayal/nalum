import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  User,
  Briefcase,
  MapPin,
  Edit,
  Linkedin,
  Github,
  Twitter,
  Globe,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";
import { toast } from "sonner";

interface Profile {
  user: {
    name: string;
    email: string;
    role: string;
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
  experience?: Array<{
    company: string;
    role: string;
    duration: string;
  }>;
}

const ShowProfile = () => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProfile(response.data.profile);
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
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <UserAvatar
                  src={profile.profile_picture}
                  name={profile.user.name}
                  size="xl"
                />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.user.name}
                  </h2>
                  <p className="text-gray-600 mb-1">{profile.user.email}</p>
                  {profile.current_role && profile.current_company && (
                    <p className="text-lg text-gray-700 mb-2">
                      {profile.current_role} at {profile.current_company}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                    <Badge variant="secondary" className="bg-nsut-maroon/10 text-nsut-maroon">
                      {profile.batch}
                    </Badge>
                    <Badge variant="secondary">{profile.branch}</Badge>
                    <Badge variant="secondary">{profile.campus}</Badge>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/dashboard/update-profile")}
                  className="bg-nsut-maroon hover:bg-nsut-maroon/90"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Social Links */}
              {profile.social_media && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {profile.social_media.linkedin && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={profile.social_media.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {profile.social_media.github && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={profile.social_media.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {profile.social_media.twitter && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={profile.social_media.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {profile.social_media.personal_website && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={profile.social_media.personal_website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-nsut-maroon" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Batch</p>
                  <p className="text-lg font-semibold">{profile.batch}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Branch</p>
                  <p className="text-lg font-semibold">{profile.branch}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Campus</p>
                  <p className="text-lg font-semibold">{profile.campus}</p>
                </div>
              </CardContent>
            </Card>

            {/* Current Position */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-nsut-maroon" />
                  Current Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.current_company || profile.current_role ? (
                  <>
                    {profile.current_role && (
                      <div>
                        <p className="text-sm text-gray-600">Role</p>
                        <p className="text-lg font-semibold">{profile.current_role}</p>
                      </div>
                    )}
                    {profile.current_company && profile.current_role && <Separator />}
                    {profile.current_company && (
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="text-lg font-semibold">{profile.current_company}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 italic">No current position specified</p>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-nsut-maroon" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {profile.experience && profile.experience.length > 0 && (
              <Card className={profile.skills && profile.skills.length > 0 ? "" : "lg:col-span-2"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-nsut-maroon" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.experience.map((exp, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-4" />}
                        <div>
                          <p className="font-semibold text-lg">{exp.role}</p>
                          <p className="text-gray-700">{exp.company}</p>
                          <p className="text-sm text-gray-500 mt-1">{exp.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProfile;