import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useConversations = () => {
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await api.get("/chat/conversations");
      return data.data || [];
    },
  });

  const createConversation = useMutation({
    mutationFn: async (participantId: string) => {
      const { data } = await api.post("/chat/conversations", {
        participantId,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create conversation");
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (conversationId: string) => {
      await api.put(`/chat/conversations/${conversationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const archiveConversation = useMutation({
    mutationFn: async (conversationId: string) => {
      await api.delete(`/chat/conversations/${conversationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Conversation archived");
    },
  });

  return {
    conversations,
    isLoading,
    createConversation,
    markAsRead,
    archiveConversation,
  };
};
