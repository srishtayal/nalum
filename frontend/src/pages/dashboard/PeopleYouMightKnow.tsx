import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, MapPin, GraduationCap, BadgeIcon } from "lucide-react";
import api from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";
import { ConnectionButton } from "@/components/ui/ConnectionButton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SuggestionProfile {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  batch?: string;
  branch?: string;
  campus?: string;
  profile_picture?: string;
  connectionStatus?: string;
}

const PeopleYouMightKnow = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<SuggestionProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/profile/suggestions");
      setSuggestions(data?.suggestions || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load suggestions"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleConnect = async (userId: string) => {
    try {
      await api.post("/chat/connections/request", { recipientId: userId });
      toast.success("Connection request sent");
      fetchSuggestions();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send request");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md flex items-center gap-3 text-gray-200">
        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
        <span>Loading suggestions...</span>
      </div>
    );
  }

  if (!suggestions.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md text-gray-300">
        No suggestions available.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">
          People you might know
        </h3>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
          {suggestions.length} suggestions
        </Badge>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {suggestions.slice(0, 6).map((profile) => (
          <div
            key={profile._id}
            onClick={() => navigate(`/dashboard/alumni/${profile.user._id}`)}
            className="min-w-[230px] max-w-[230px] cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 shadow-md transition hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-blue-500/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <UserAvatar
                src={profile.profile_picture}
                name={profile.user.name}
                size="md"
              />
              <div>
                <p className="text-white font-semibold leading-tight line-clamp-1">
                  {profile.user.name}
                </p>
                {profile.batch && (
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <GraduationCap className="h-3 w-3" />
                    <span>Batch {profile.batch}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-300">
              {profile.branch && (
                <div className="flex items-center gap-1">
                  <BadgeIcon className="h-4 w-4 text-blue-400" />
                  <span className="line-clamp-1">{profile.branch}</span>
                </div>
              )}
              {profile.campus && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className="line-clamp-1">{profile.campus}</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <ConnectionButton
                status={profile.connectionStatus || "not_connected"}
                userId={profile.user._id}
                onConnect={handleConnect}
                fullWidth
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleYouMightKnow;
