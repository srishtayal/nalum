import { createContext, useContext, ReactNode } from "react";
import { useSocket } from "../hooks/useSocket";
import { useConnections } from "../hooks/useConnections";

interface ChatContextType {
  socket: any;
  isConnected: boolean;
  connections: any[];
  pendingRequests: any[];
  isLoadingConnections: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { socket, isConnected } = useSocket();
  const { connections, pendingRequests, isLoadingConnections } = useConnections();

  return (
    <ChatContext.Provider
      value={{
        socket,
        isConnected,
        connections,
        pendingRequests,
        isLoadingConnections,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};
