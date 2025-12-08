import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCheck, UserX, Inbox } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useConnections } from "@/hooks/useConnections";

export const ConnectionRequests = () => {
  const { pendingRequests, isLoadingConnections } = useChatContext();
  const { respondToRequest } = useConnections();

  const handleAccept = (connectionId: string) => {
    respondToRequest.mutate({ connectionId, accept: true });
  };

  const handleReject = (connectionId: string) => {
    respondToRequest.mutate({ connectionId, accept: false });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Inbox className="h-5 w-5" />
          Connection Requests
        </h3>
        {pendingRequests.length > 0 && (
          <Badge variant="default">{pendingRequests.length}</Badge>
        )}
      </div>

      <ScrollArea className="max-h-[400px]">
        {isLoadingConnections ? (
          <div className="text-center text-muted-foreground py-8">Loading...</div>
        ) : pendingRequests.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No pending requests
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request: any) => (
              <div
                key={request._id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card"
              >
                <Avatar>
                  <AvatarFallback>
                    {request.requester?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {request.requester?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {request.requester?.email}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handleAccept(request._id)}
                    disabled={respondToRequest.isPending}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleReject(request._id)}
                    disabled={respondToRequest.isPending}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
