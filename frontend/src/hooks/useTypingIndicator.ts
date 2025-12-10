import { useEffect, useState } from "react";

export const useTypingIndicator = (socket: any, conversationId: string | null) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleTypingIndicator = (data: { userId: string; conversationId: string; isTyping: boolean }) => {
      if (data.conversationId !== conversationId) return;

      setTypingUsers((prev) => {
        if (data.isTyping) {
          return prev.includes(data.userId) ? prev : [...prev, data.userId];
        } else {
          return prev.filter((id) => id !== data.userId);
        }
      });
    };

    socket.on("typing:indicator", handleTypingIndicator);

    return () => {
      socket.off("typing:indicator", handleTypingIndicator);
    };
  }, [socket, conversationId]);

  const emitTyping = (isTyping: boolean, receiverId: string) => {
    if (socket && conversationId) {
      const event = isTyping ? "typing:start" : "typing:stop";
      socket.emit(event, { conversationId, receiverId });
    }
  };

  return { typingUsers, emitTyping };
};
