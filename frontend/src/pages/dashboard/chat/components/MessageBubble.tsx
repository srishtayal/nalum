import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: any;
  isOwn: boolean;
  onDelete: (messageId: string) => void;
}

/**
 * MessageBubble Component
 * 
 * Displays a single message in the chat conversation.
 * 
 * Features:
 * - Differentiates between "Own" (sent by current user) and "Other" (received) messages.
 * - Supports system messages with a distinct style.
 * - Displays read status and timestamp.
 * - Allows message deletion for the sender.
 */
export const MessageBubble = ({ message, isOwn, onDelete }: MessageBubbleProps) => {
  // Handle system messages
  if (message.messageType === 'system') {
    return (
      <div className="flex justify-center my-4 animate-in fade-in zoom-in-95 duration-300">
        <span className="px-3 py-1 text-xs font-medium text-gray-400 bg-white/5 rounded-full border border-white/10">
          {message.content}
        </span>
      </div>
    );
  }

  // Calculate read status: Check if anyone other than the sender is in the readBy array
  const senderId = message.sender?._id || message.sender;
  const isRead = message.readBy?.some((r: any) => {
    const readerId = r.user?._id || r.user;
    return readerId?.toString() !== senderId?.toString();
  });

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] sm:max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {/* Message Content Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 shadow-sm border text-sm backdrop-blur-sm ${
            isOwn
              ? "bg-indigo-600 text-white border-indigo-500/50 rounded-br-none"
              : "bg-white/10 text-gray-100 border-white/10 rounded-bl-none"
          }`}
        >
          <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
        </div>
        
        {/* Message Metadata (Time, Status, Actions) */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-gray-400 font-medium">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
          
          {message.isOptimistic && (
             <span className="text-[10px] text-gray-400 font-medium italic">Sending...</span>
          )}

          {!message.isOptimistic && isOwn && isRead && (
            <span className="text-[10px] text-gray-400 font-medium">Read</span>
          )}
          
          {isOwn && !message.isOptimistic && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400 text-gray-400"
              onClick={() => onDelete(message._id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
