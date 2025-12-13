import { useEffect, useRef, useCallback, useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import UserAvatar from "@/components/UserAvatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface ChatWindowProps {
  conversation: any;
  onBack: () => void;
}

/**
 * ChatWindow Component
 * 
 * The main interface for viewing and sending messages in a conversation.
 * Handles:
 * - Real-time message display
 * - Sending new messages (creating a conversation if one doesn't exist)
 * - Typing indicators
 * - Deleting messages
 * - Scrolling to the latest message
 */
export const ChatWindow = ({ conversation, onBack }: ChatWindowProps) => {
  const { socket, isConnected } = useChatContext();
  const { user } = useAuth();
  const { createConversation } = useConversations();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Track the real conversation ID locally to handle transitions from connection-only
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversation.isConnectionOnly ? null : conversation._id
  );
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  // Sync with prop changes
  useEffect(() => {
    setActiveConversationId(conversation.isConnectionOnly ? null : conversation._id);
  }, [conversation]);

  // Custom hook to manage message state and socket events
  const { messages, isLoading, sendMessage, deleteMessage } = useMessages(
    activeConversationId,
    socket,
    conversation.isConnectionOnly ? null : conversation.lastMessage
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const markAsRead = useCallback(() => {
    if (activeConversationId && socket && isConnected) {
      // Only mark as read if the document is visible and focused
      if (document.visibilityState === 'visible' && document.hasFocus()) {
        socket.emit('message:read', { conversationId: activeConversationId });

        // Optimistically update conversations list to show as read (gray)
        queryClient.setQueryData(["conversations"], (old: any[]) => {
          if (!old) return old;
          return old.map((c: any) =>
            c._id === activeConversationId ? { ...c, unreadCount: 0 } : c
          );
        });
      }
    }
  }, [activeConversationId, socket, isConnected, queryClient]);

  // Mark messages as read when OPENING conversation (conversationId changes)
  // and when window gains focus
  useEffect(() => {
    markAsRead();

    const handleFocus = () => {
      markAsRead();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [activeConversationId, markAsRead]);

  const handleSendMessage = async (content: string) => {
    let targetConversationId = activeConversationId;

    // If this is a connection-only (no conversation yet), create it on the backend first
    if (!targetConversationId) {
      try {
        const result = await createConversation.mutateAsync(conversation.otherParticipant._id);
        // The mutation returns the conversation object directly
        targetConversationId = result._id;
        setActiveConversationId(targetConversationId); // Switch to real ID immediately
      } catch (error) {
        console.error('Failed to create conversation:', error);
        return;
      }
    }

    const tempId = `temp-${Date.now()}`;

    // Note: sendMessage internally uses mutation variables, but the useMessages hook
    // must be observing the same conversationId for the optimistic update to be visible.
    // By setting activeConversationId above, we trigger a re-render/hook update.
    // However, since state updates are async, we pass targetConversationId here.
    sendMessage.mutate({
      content,
      conversationId: targetConversationId!,
      receiverId: conversation.otherParticipant._id,
      tempId
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessageToDelete(messageId);
  };

  const confirmDelete = () => {
    if (messageToDelete) {
      deleteMessage.mutate(messageToDelete);
      setMessageToDelete(null);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col min-h-0 bg-transparent">
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center gap-3 bg-black/20 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden text-gray-300 hover:text-white hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:bg-white/5 p-1.5 -ml-1.5 rounded-lg transition-colors"
          onClick={() => navigate(`/dashboard/alumni/${conversation.otherParticipant._id}`)}
        >
          <UserAvatar
            name={conversation.otherParticipant?.name || "Unknown User"}
            src={conversation.otherParticipant?.profile_picture || conversation.otherParticipant?.profilePicture}
            className="h-9 w-9 border border-white/10"
            size="sm"
          />

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate text-gray-200">{conversation.otherParticipant?.name || "Unknown User"}</p>
            <p className="text-xs text-gray-400 truncate">{conversation.otherParticipant?.email}</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="text-center text-gray-400 pt-10 text-sm">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 pt-10 px-4">
            {!activeConversationId ? (
              <div className="space-y-2">
                <p className="font-medium text-sm text-gray-300">You're connected with {conversation.otherParticipant?.name}!</p>
                <p className="text-xs">Send a message to start the conversation</p>
              </div>
            ) : (
              <p className="text-sm">No messages yet. Start the conversation!</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: any) => {
              const senderId = message.sender?._id || message.sender || message.senderId;
              const isOwn = message.isOptimistic || senderId === user?.id;

              return (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isOwn={isOwn}
                  onDelete={handleDeleteMessage}
                />
              );
            })}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      {/* Typing Indicator */}
      {activeConversationId && <TypingIndicator conversationId={activeConversationId} />}

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={sendMessage.isPending || createConversation.isPending}
        conversationId={activeConversationId || 'temp'}
        receiverId={conversation.otherParticipant._id}
        onInputFocus={markAsRead}
      />

      <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsend Message?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will remove the message for everyone in the chat. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">Unsend</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
