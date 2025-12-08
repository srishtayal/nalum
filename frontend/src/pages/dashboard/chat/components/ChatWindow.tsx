import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { MessageInput } from "./MessageInput";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { useChatContext } from "@/context/ChatContext";
import { useMessages } from "@/hooks/useMessages";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/context/AuthContext";

interface ChatWindowProps {
  conversation: any;
  onBack: () => void;
}

export const ChatWindow = ({ conversation, onBack }: ChatWindowProps) => {
  const { socket } = useChatContext();
  const { user } = useAuth();
  const { createConversation } = useConversations();
  
  // For connection-only items, conversationId might not exist yet
  const conversationId = conversation.isConnectionOnly ? null : conversation._id;
  
  const { messages, isLoading, sendMessage, deleteMessage } = useMessages(
    conversationId,
    socket
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    let targetConversationId = conversationId;
    
    // If this is a connection-only (no conversation yet), create it first
    if (conversation.isConnectionOnly) {
      try {
        const result = await createConversation.mutateAsync(conversation.otherParticipant._id);
        targetConversationId = result.data._id;
      } catch (error) {
        console.error('Failed to create conversation:', error);
        return;
      }
    }
    
    sendMessage.mutate({
      content,
      conversationId: targetConversationId,
      receiverId: conversation.otherParticipant._id,
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm("Delete this message?")) {
      deleteMessage.mutate(messageId);
    }
  };

  return (
    <Card className="flex-1 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar>
          <AvatarFallback>
            {conversation.otherParticipant?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <p className="font-semibold">{conversation.otherParticipant?.name || "Unknown User"}</p>
          <p className="text-xs text-muted-foreground">{conversation.otherParticipant?.email}</p>
        </div>
        
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            {conversation.isConnectionOnly ? (
              <div className="space-y-2">
                <p>You're connected with {conversation.otherParticipant?.name}!</p>
                <p className="text-sm">Send a message to start the conversation</p>
              </div>
            ) : (
              "No messages yet. Start the conversation!"
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: any) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.senderId === user?.id}
                onDelete={handleDeleteMessage}
              />
            ))}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      {/* Typing Indicator */}
      {conversationId && <TypingIndicator conversationId={conversationId} />}

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={sendMessage.isPending || createConversation.isPending}
        conversationId={conversationId || 'temp'}
        receiverId={conversation.otherParticipant._id}
      />
    </Card>
  );
};
