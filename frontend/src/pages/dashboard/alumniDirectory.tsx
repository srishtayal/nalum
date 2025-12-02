import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Search,
  Filter,
  X,
  Loader2,
  ArrowLeft,
  Mail,
  Briefcase,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";
import { toast } from "sonner";

interface AlumniProfile {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  batch: string;
  branch: string;
  campus: string;
  current_company?: string;
  current_role?: string;
  profile_picture?: string;
  skills?: string[];
}

interface Filters {
  name: string;
  batch: string;
  branch: string;
  campus: string;
  skills: string[];
}

const AlumniDirectory = () => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [lastSearchedFilters, setLastSearchedFilters] = useState<Filters>({
    name: "",
    batch: "",
    branch: "",
    campus: "",
    skills: [],
  });

  const [filters, setFilters] = useState<Filters>({
    name: "",
    batch: "",
    branch: "",
    campus: "",
    skills: [],
  });

  // Fetch current user profile for navbar
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProfile(response.data.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  // Fetch alumni based on filters
  const fetchAlumni = async (page = 1) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const params: any = {
        page,
        limit: 12,
      };

      if (filters.name) params.name = filters.name;
      if (filters.batch) params.graduationYear = filters.batch;
      if (filters.branch) params.branch = filters.branch;
      if (filters.campus) params.campus = filters.campus;
      if (filters.skills.length > 0) params.skills = filters.skills.join(",");

      const response = await api.get("/profile/search", {
        params,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Always update alumni state, even if empty
      setAlumni(response.data.profiles || []);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching alumni:", error);
      // Clear alumni on error
      setAlumni([]);
      toast.error("Failed to load alumni", {
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

  useEffect(() => {
    // Don't fetch on initial load
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
      setFilters((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSearch = () => {
    setAlumni([]); // Clear previous results before new search
    setCurrentPage(1);
    setLastSearchedFilters({ ...filters }); // Store the filters we're searching with
    fetchAlumni(1);
  };

  const handleClearResults = () => {
    setFilters({
      name: "",
      batch: "",
      branch: "",
      campus: "",
      skills: [],
    });
    setLastSearchedFilters({
      name: "",
      batch: "",
      branch: "",
      campus: "",
      skills: [],
    });
    setAlumni([]);
    setHasSearched(false);
    setCurrentPage(1);
  };

  // Check if current filters differ from last searched filters
  const hasFiltersChanged = () => {
    return (
      filters.name !== lastSearchedFilters.name ||
      filters.batch !== lastSearchedFilters.batch ||
      filters.branch !== lastSearchedFilters.branch ||
      filters.campus !== lastSearchedFilters.campus ||
      filters.skills.length !== lastSearchedFilters.skills.length ||
      filters.skills.some((skill, index) => skill !== lastSearchedFilters.skills[index])
    );
  };

  const showClearButton = hasSearched && !hasFiltersChanged();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchAlumni(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const branches = [
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
    "Information Technology",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Biotechnology",
    "Instrumentation and Control Engineering",
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header/Navbar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-nsut-maroon" />
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              NALUM Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">
              {profile?.user.email}
            </span>
            {profile && (
              <UserAvatar
                src={profile.profile_picture}
                name={profile.user.name}
                size="md"
              />
            )}
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
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Alumni Directory
            </h2>
            <p className="text-gray-600">
              Connect with fellow NSUT alumni from across batches and branches
            </p>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search by name..."
                      value={filters.name}
                      onChange={(e) => handleFilterChange("name", e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {(filters.batch ||
                      filters.branch ||
                      filters.campus ||
                      filters.skills.length > 0) && (
                      <Badge variant="secondary" className="ml-1">
                        {[
                          filters.batch,
                          filters.branch,
                          filters.campus,
                          ...filters.skills,
                        ].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                  {showClearButton ? (
                    <Button 
                      onClick={handleClearResults} 
                      variant="outline"
                      className="gap-2 border-nsut-maroon text-nsut-maroon hover:bg-nsut-maroon hover:text-white"
                    >
                      <X className="h-4 w-4" />
                      Clear Results
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSearch} 
                      className="gap-2 bg-nsut-maroon hover:bg-nsut-maroon/90"
                    >
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  )}
                </div>

                {/* Filter Panel */}
                {showFilters && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Batch Filter */}
                      <div className="space-y-2">
                        <Label htmlFor="batch">Batch</Label>
                        <Input
                          id="batch"
                          placeholder="e.g., 2020"
                          value={filters.batch}
                          onChange={(e) => handleFilterChange("batch", e.target.value)}
                        />
                      </div>

                      {/* Branch Filter */}
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Select
                          value={filters.branch}
                          onValueChange={(value) => handleFilterChange("branch", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Branches" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch} value={branch}>
                                {branch}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {filters.branch && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFilterChange("branch", "")}
                            className="text-xs h-6 px-2"
                          >
                            Clear
                          </Button>
                        )}
                      </div>

                      {/* Campus Filter */}
                      <div className="space-y-2">
                        <Label htmlFor="campus">Campus</Label>
                        <Select
                          value={filters.campus}
                          onValueChange={(value) => handleFilterChange("campus", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Campuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Main Campus">Main Campus</SelectItem>
                            <SelectItem value="East Campus">East Campus</SelectItem>
                            <SelectItem value="West Campus">West Campus</SelectItem>
                          </SelectContent>
                        </Select>
                        {filters.campus && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFilterChange("campus", "")}
                            className="text-xs h-6 px-2"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Skills Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <div className="flex gap-2">
                        <Input
                          id="skills"
                          placeholder="Add skill to filter"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddSkill} variant="outline">
                          Add
                        </Button>
                      </div>
                      {filters.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {filters.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="gap-1 cursor-pointer hover:bg-gray-200"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              {skill}
                              <X className="h-3 w-3" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={handleClearResults}>
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-nsut-maroon mx-auto mb-4" />
                <p className="text-gray-600">Searching alumni...</p>
              </div>
            </div>
          ) : !hasSearched ? (
            <Card>
              <CardContent className="py-20 text-center">
                <GraduationCap className="h-20 w-20 text-nsut-maroon/20 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Connect? 🎓
                </h3>
                <p className="text-gray-600 mb-2 text-lg">
                  Use the search bar and filters above to find alumni
                </p>
                <p className="text-gray-500 text-sm">
                  Search by name, batch, branch, campus, or skills
                </p>
              </CardContent>
            </Card>
          ) : alumni.length === 0 ? (
            <Card>
              <CardContent className="py-20 text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🔍</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Oops! No Alumni Found
                </h3>
                <p className="text-gray-600 mb-2">
                  We couldn't find anyone matching these criteria
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Try adjusting your filters or search with different parameters
                </p>
                <Button 
                  onClick={handleClearResults} 
                  variant="outline"
                  className="border-nsut-maroon text-nsut-maroon hover:bg-nsut-maroon hover:text-white"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Alumni Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {alumni.map((alumnus) => (
                  <Card
                    key={alumnus._id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <UserAvatar
                          src={alumnus.profile_picture}
                          name={alumnus.user.name}
                          size="lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {alumnus.user.name}
                          </h3>
                          {alumnus.current_role && alumnus.current_company && (
                            <p className="text-sm text-gray-600 truncate">
                              {alumnus.current_role} at {alumnus.current_company}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GraduationCap className="h-4 w-4" />
                          <span>
                            {alumnus.branch} • {alumnus.batch}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{alumnus.campus}</span>
                        </div>
                      </div>

                      {alumnus.skills && alumnus.skills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {alumnus.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {alumnus.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{alumnus.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          window.location.href = `mailto:${alumnus.user.email}`;
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={
                              currentPage === page
                                ? "bg-nsut-maroon hover:bg-nsut-maroon/90"
                                : ""
                            }
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniDirectory;
