import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import api from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";

interface SuggestedPerson {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  profile_picture?: string;
  current_company?: string;
  current_role?: string;
  branch: string;
  batch: string;
}

const DashboardHome = () => {
  const { accessToken } = useAuth();
  const { profile, isLoading } = useProfile();
  const [suggestedPeople, setSuggestedPeople] = useState<SuggestedPerson[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    // Fetch suggested people when profile data is available
    if (profile?.branch && profile?.batch) {
      fetchSuggestedPeople(profile.branch, profile.batch);
    }
  }, [profile?.branch, profile?.batch, accessToken]);

  const fetchSuggestedPeople = async (branch: string, batch: string) => {
    // Check localStorage first for cached suggestions
    const cachedKey = `suggestions_${branch}_${batch}`;
    const cached = localStorage.getItem(cachedKey);
    
    if (cached) {
      const cachedData = JSON.parse(cached);
      // Filter out current user from cached data
      setSuggestedPeople(cachedData.filter((p: SuggestedPerson) => p.user._id !== profile?.user._id));
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await api.get("/profile/search", {
        params: { branch, graduationYear: batch, limit: 10 },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const suggestions = response.data.profiles || [];
      
      // Cache suggestions in localStorage
      localStorage.setItem(cachedKey, JSON.stringify(suggestions));
      
      // Filter out current user before setting state
      setSuggestedPeople(suggestions.filter((p: SuggestedPerson) => p.user._id !== profile?.user._id));
    } catch (error) {
      console.error("Error fetching suggested people:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Header */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {profile?.user.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-gray-400">
              Manage your profile and connect with the NSUT community.
            </p>
          </div>
          {!isLoading && profile && (
            <div className="hidden sm:block">
              <UserAvatar
                src={profile.profile_picture}
                name={profile.user.name}
                size="lg"
                className="border-2 border-white/20 shadow-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* People You Might Know Section */}
      <div className="lg:w-96 lg:ml-auto p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            People You Might Know
          </h3>
          <Link
            to="/dashboard/alumni"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All
          </Link>
        </div>

        {loadingSuggestions ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Loading...
          </div>
        ) : suggestedPeople.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-10 w-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-xs">
              No suggestions available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestedPeople.slice(0, 6).map((person) => (
              <Link
                key={person._id}
                to={`/dashboard/profile/${person.user._id}`}
                className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={person.profile_picture}
                    name={person.user.name}
                    size="sm"
                    className="border border-white/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm truncate">
                      {person.user.name}
                    </h4>
                    <p className="text-gray-400 text-xs truncate">
                      {person.branch} • {person.batch}
                    </p>
                    {person.current_company && (
                      <p className="text-gray-500 text-xs truncate">
                        {person.current_role && `${person.current_role} at `}
                        {person.current_company}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
