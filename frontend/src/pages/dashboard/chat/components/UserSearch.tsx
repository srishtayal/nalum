import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Loader2, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useConnections } from "@/hooks/useConnections";

export const UserSearch = () => {
  const [query, setQuery] = useState("");
  const { sendRequest } = useConnections();
  const navigate = useNavigate();

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
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Search className="h-5 w-5" />
          Find Alumni
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/dashboard/alumni")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : searchResults.length === 0 && query ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No alumni found</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/dashboard/alumni")}
                className="mt-2"
              >
                Try advanced search with filters
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
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <Avatar>
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    
                    {isConnected ? (
                      <Button size="sm" variant="outline" disabled>
                        Connected
                      </Button>
                    ) : isPending ? (
                      <Button size="sm" variant="outline" disabled>
                        Pending
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleSendRequest(user._id)}
                        disabled={sendRequest.isPending}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8 space-y-3">
              <p>Search for alumni by name or email</p>
              <p className="text-sm">Or use advanced search with more filters</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard/alumni")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Alumni Directory
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
    </Card>
  );
};
