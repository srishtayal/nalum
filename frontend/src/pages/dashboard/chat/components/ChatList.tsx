import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MessageSquare } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

interface ChatListProps {
  onSelectConversation: (conversation: any) => void;
  selectedConversationId: string | null;
}

export const ChatList = ({ onSelectConversation, selectedConversationId }: ChatListProps) => {
  const { isConnected, connections } = useChatContext();
  const { conversations, isLoading } = useConversations();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Get accepted connections
  const acceptedConnections = connections.filter((conn: any) => conn.status === 'accepted');

  // Create a map of conversations by participant ID for quick lookup
  const conversationMap = new Map(
    conversations.map((conv: any) => [conv.otherParticipant?._id, conv])
  );

  // Merge conversations with connections (show connections even without messages)
  const allChats = acceptedConnections.map((connection: any) => {
    // Determine who the other user is (not the current user)
    const otherUser = connection.requester._id === user?.id
      ? connection.recipient 
      : connection.requester;
    
    const existingConversation = conversationMap.get(otherUser._id);
    
    if (existingConversation) {
      return existingConversation;
    }
    
    // Return connection as a "conversation" placeholder
    return {
      _id: `connection-${connection._id}`,
      isConnectionOnly: true,
      connectionId: connection._id,
      otherParticipant: otherUser,
      lastMessage: null,
      unreadCount: 0,
    };
  });

  const filteredChats = allChats.filter((chat: any) =>
    chat.otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full md:w-80 h-full flex flex-col">
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Messages</h2>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground space-y-2">
            <MessageSquare className="h-12 w-12 mx-auto opacity-20" />
            <p>No connections yet</p>
            <p className="text-xs">Go to "Find" tab to connect with alumni</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredChats.map((chat: any) => (
              <button
                key={chat._id}
                onClick={() => onSelectConversation(chat)}
                className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                  selectedConversationId === chat._id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {chat.otherParticipant?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate">
                        {chat.otherParticipant?.name || "Unknown User"}
                      </p>
                      {chat.lastMessage?.createdAt && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(chat.lastMessage.createdAt), "MMM d")}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.isConnectionOnly ? (
                          <span className="italic">Click to start chatting</span>
                        ) : (
                          chat.lastMessage?.content || "No messages yet"
                        )}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge variant="default" className="text-xs">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
