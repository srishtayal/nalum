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

/**
 * ChatList Component
 * 
 * Displays a list of active conversations and accepted connections.
 * It merges existing conversations with connections that don't have a conversation yet,
 * allowing users to start chatting immediately with any connection.
 */
export const ChatList = ({ onSelectConversation, selectedConversationId }: ChatListProps) => {
  const { isConnected, connections } = useChatContext();
  const { conversations, isLoading } = useConversations();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter for only accepted connections to show in the chat list
  const acceptedConnections = connections.filter((conn: any) => conn.status === 'accepted');

  // Create a map for O(1) lookup of existing conversations by participant ID
  const conversationMap = new Map(
    conversations.map((conv: any) => [conv.otherParticipant?._id, conv])
  );

  // Combine connections and conversations into a single list
  // If a conversation exists, use it. If not, create a placeholder from the connection.
  const allChats = acceptedConnections.map((connection: any) => {
    // Determine the other user (not the current user)
    const otherUser = connection.requester._id === user?.id
      ? connection.recipient 
      : connection.requester;
    
    const existingConversation = conversationMap.get(otherUser._id);
    
    if (existingConversation) {
      return existingConversation;
    }
    
    // Return connection as a "virtual" conversation
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
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* Header with Search */}
      <div className="p-3 border-b border-white/10 space-y-3 bg-black/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100">
            Messages
          </h2>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-[10px] h-5 px-2 ${isConnected ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-gray-400 border-gray-600"} backdrop-blur-sm`}
            >
              {isConnected ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm bg-white/5 border-white/10 focus:bg-white/10 transition-all text-gray-200 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Chat List Area */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-400">Loading...</div>
        ) : filteredChats.length === 0 ? (
          <div className="p-8 text-center text-gray-500 space-y-2">
            <MessageSquare className="h-10 w-10 mx-auto opacity-20" />
            <p className="text-sm">No connections yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredChats.map((chat: any) => (
              <button
                key={chat._id}
                onClick={() => onSelectConversation(chat)}
                className={`w-full p-3 text-left transition-all hover:bg-white/5 ${
                  selectedConversationId === chat._id 
                    ? "bg-white/10 border-l-2 border-indigo-500" 
                    : "border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border border-white/10 shadow-sm">
                    <AvatarFallback className="bg-white/10 text-gray-300 text-sm">
                      {chat.otherParticipant?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate text-gray-200">
                        {chat.otherParticipant?.name || "Unknown User"}
                      </p>
                      {chat.lastMessage?.createdAt && (
                        <span className="text-[10px] text-gray-500">
                          {format(new Date(chat.lastMessage.createdAt), "MMM d")}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-gray-400 truncate max-w-[140px]">
                        {chat.isConnectionOnly ? (
                          <span className="italic opacity-70">Start chatting</span>
                        ) : (
                          chat.lastMessage?.content || "No messages"
                        )}
                      </p>
                      {chat.unreadCount > 0 && (
                        <Badge variant="default" className="h-4 min-w-[16px] p-0 flex items-center justify-center text-[10px] bg-indigo-600 hover:bg-indigo-700">
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
    </div>
  );
};