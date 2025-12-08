import { useEffect, useState } from "react";

export const useTypingIndicator = (socket: any, conversationId: string | null) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleTypingStart = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId && !typingUsers.includes(data.userId)) {
        setTypingUsers((prev) => [...prev, data.userId]);
      }
    };

    const handleTypingStop = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
      }
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, conversationId, typingUsers]);

  const emitTyping = (isTyping: boolean, receiverId: string) => {
    if (socket && conversationId) {
      const event = isTyping ? "typing:start" : "typing:stop";
      socket.emit(event, { conversationId, receiverId });
    }
  };

  return { typingUsers, emitTyping };
};
