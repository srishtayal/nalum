import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Loader2, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useConnections } from "@/hooks/useConnections";

/**
 * UserSearch Component
 * 
 * Allows users to search for alumni by name or email to send connection requests.
 * Uses a debounced search query (implicitly handled by user input speed/state)
 * and displays results in a scrollable list.
 */
export const UserSearch = () => {
  const [query, setQuery] = useState("");
  const { sendRequest } = useConnections();
  const navigate = useNavigate();

  // Fetch users based on search query
  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["search-users", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const { data } = await api.get(`/chat/search/users?q=${query}`);
      return data.data || [];
    },
    enabled: query.trim().length > 0,
  });

  const handleSendRequest = (userId: string) => {
    sendRequest.mutate(userId);
  };

  return (
    <div className="p-4 h-full flex flex-col bg-transparent">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-100">
          <Search className="h-5 w-5 text-indigo-400" />
          Find Alumni
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/dashboard/alumni")}
          className="text-xs text-gray-300 hover:text-white hover:bg-white/10"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Advanced
        </Button>
      </div>

      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        {/* Search Input */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 focus:bg-white/10 backdrop-blur-sm rounded-xl text-gray-100 placeholder:text-gray-500"
          />
        </div>

        {/* Results List */}
        <ScrollArea className="flex-1 -mx-2 px-2">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500" />
            </div>
          ) : searchResults.length === 0 && query ? (
            <div className="text-center text-gray-400 py-8">
              <p>No alumni found</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/dashboard/alumni")}
                className="mt-2 text-indigo-400"
              >
                Try advanced search
              </Button>
            </div>
          ) : query ? (
            <div className="space-y-2">
              {searchResults.map((user: any) => {
                const isConnected = user.connectionStatus === 'accepted';
                const isPending = user.connectionStatus === 'pending';
                
                return (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm shadow-sm"
                  >
                    <Avatar className="border border-white/10">
                      <AvatarFallback className="bg-indigo-500/20 text-indigo-200">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate text-gray-200">{user.name || "Unknown User"}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    {isConnected ? (
                      <Button size="sm" variant="ghost" disabled className="text-green-400 bg-green-500/10">
                        Connected
                      </Button>
                    ) : isPending ? (
                      <Button size="sm" variant="ghost" disabled className="text-amber-400 bg-amber-500/10">
                        Pending
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleSendRequest(user._id)}
                        disabled={sendRequest.isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm border border-white/10"
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12 space-y-3">
              <div className="h-12 w-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-2">
                <Search className="h-6 w-6 opacity-40" />
              </div>
              <p>Search for alumni by name or email</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard/alumni")}
                className="bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Open Alumni Directory
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
