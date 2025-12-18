import { useMemo } from "react";
// import { useChatContext } from "@/context/ChatContext"; // Removed unused
// import { useConversations } from "@/context/ChatContext"; // Removed incorrect import
import { useAuth } from "@/context/AuthContext";

// Correct imports based on previous file reads
import { useConversations as useConversationsHook } from "@/hooks/useConversations";

export const useMergedChats = () => {
    const { conversations, isLoading } = useConversationsHook();
    const { user } = useAuth();

    // Return only existing conversations, sorted by last message
    const allChats = useMemo(() => {
        return conversations.sort((a: any, b: any) => {
            const dateA = new Date(a.lastMessage?.timestamp || a.lastMessage?.createdAt || a.updatedAt || 0).getTime();
            const dateB = new Date(b.lastMessage?.timestamp || b.lastMessage?.createdAt || b.updatedAt || 0).getTime();
            return dateB - dateA;
        });
    }, [conversations]);

    return {
        allChats,
        isLoading
    };
};
