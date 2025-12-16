import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, MapPin, GraduationCap, BadgeIcon, UserPlus } from "lucide-react";
import api from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";
import { ConnectionButton } from "@/components/ui/ConnectionButton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useProfile } from "@/context/ProfileContext";
import { cn } from "@/lib/utils";

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

interface PeopleYouMightKnowProps {
  className?: string;
  hideHeader?: boolean;
  fullHeight?: boolean;
}

const PeopleYouMightKnow = ({
  className,
  hideHeader,
  fullHeight,
}: PeopleYouMightKnowProps) => {
  const navigate = useNavigate();
  const { profile } = useProfile();
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

  // Prioritized filtering based on user's batch and branch
  const filteredSuggestions = useMemo(() => {
    if (!profile?.batch || !suggestions.length) {
      return suggestions.slice(0, 6);
    }

    const userBatch = profile.batch;
    const userBranch = profile.branch;
    const userBatchNum = parseInt(userBatch);

    // Priority 1: Same year AND same branch
    const priority1 = suggestions.filter(
      (s) => s.batch === userBatch && s.branch === userBranch
    );

    // Priority 2: Same year but different branch
    const priority2 = suggestions.filter(
      (s) => s.batch === userBatch && s.branch !== userBranch
    );

    // Priority 3: Year is ±1 from user's year
    const priority3 = suggestions.filter((s) => {
      if (!s.batch) return false;
      const suggestionBatchNum = parseInt(s.batch);
      return (
        Math.abs(suggestionBatchNum - userBatchNum) === 1 &&
        !priority1.includes(s) &&
        !priority2.includes(s)
      );
    });

    // Combine in priority order and limit to 6
    const combined = [...priority1, ...priority2, ...priority3];
    return combined.slice(0, 6);
  }, [suggestions, profile]);

  const handleConnect = async (userId: string, message?: string) => {
    try {
      await api.post("/chat/connections/request", {
        recipientId: userId,
        requestMessage: message,
      });
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

  if (!filteredSuggestions.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md text-gray-300">
        No suggestions available.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md w-full max-w-xs ml-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-white">
          People you might know
        </h3>
      </div>

      <div className="flex flex-col space-y-2 max-h-[240px] overflow-y-auto pr-2">
        {filteredSuggestions.map((profile) => {
          // Skip if user data is null or undefined
          if (!profile.user || !profile.user._id) {
            return null;
          }

          return (
            <div
              key={profile._id}
              onClick={() => navigate(`/dashboard/alumni/${profile.user._id}`)}
              className="w-full cursor-pointer rounded-lg border border-white/10 bg-white/5 p- shadow-md transition hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <UserAvatar
                    src={profile.profile_picture}
                    name={profile.user.name}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight line-clamp-1">
                      {profile.user.name}
                    </p>
                    {profile.batch && (
                      <div className="flex items-center text-xs text-gray-400 gap-1">
                        <GraduationCap className="h-3 w-3" />
                        <span>{profile.batch}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(profile.user._id);
                  }}
                  className="p-1 text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors flex-shrink-0"
                  title="Connect"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PeopleYouMightKnow;
