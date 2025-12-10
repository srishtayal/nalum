import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export const useMessages = (conversationId: string | null, socket: any) => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam = 1 }) => {
      if (!conversationId) return { data: [], hasMore: false, page: 1 };
      const { data } = await api.get(
        `/chat/messages/${conversationId}?page=${pageParam}&limit=50`
      );
      return {
        data: data.data || [],
        hasMore: data.hasMore || false,
        page: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    enabled: !!conversationId,
  });

  const messages = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join the conversation room
    socket.emit('conversation:join', conversationId);
    console.log('Joined conversation room:', conversationId);

    const handleNewMessage = (data: any) => {
      console.log('Received message:new event:', data);
      if (data.conversationId === conversationId) {
        queryClient.setQueryData(["messages", conversationId], (old: any) => {
          if (!old) return { pages: [{ data: [data.message], hasMore: false, page: 1 }], pageParams: [1] };
          
          const newPages = [...old.pages];
          // Check if message already exists (avoid duplicates)
          const messageExists = newPages[0].data.some((m: any) => m._id === data.message._id);
          if (!messageExists) {
            newPages[0] = {
              ...newPages[0],
              data: [...newPages[0].data, data.message],
            };
          }
          
          return { ...old, pages: newPages };
        });
      }
    };

    const handleMessageSent = (data: any) => {
      console.log('Received message:sent event:', data);
      // Add the confirmed message
      if (data.conversationId === conversationId) {
        queryClient.setQueryData(["messages", conversationId], (old: any) => {
          if (!old) return { pages: [{ data: [data.message], hasMore: false, page: 1 }], pageParams: [1] };
          
          const newPages = [...old.pages];
          // Check if message already exists (avoid duplicates)
          const messageExists = newPages[0].data.some((m: any) => m._id === data.message._id);
          if (!messageExists) {
            newPages[0] = {
              ...newPages[0],
              data: [...newPages[0].data, data.message],
            };
          }
          
          return { ...old, pages: newPages };
        });
      }
    };

    const handleMessageRead = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    };

    const handleMessageDeleted = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:sent", handleMessageSent);
    socket.on("message:read", handleMessageRead);
    socket.on("message:deleted", handleMessageDeleted);

    return () => {
      socket.emit('conversation:leave', conversationId);
      socket.off("message:new", handleNewMessage);
      socket.off("message:sent", handleMessageSent);
      socket.off("message:read", handleMessageRead);
      socket.off("message:deleted", handleMessageDeleted);
    };
  }, [socket, conversationId, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async ({ content, conversationId, receiverId }: { content: string; conversationId: string; receiverId: string }) => {
      if (socket && socket.connected) {
        // Send via socket with conversationId
        socket.emit("message:send", { conversationId, content });
        // Don't return anything - let message:sent handle it
        return null;
      } else {
        // HTTP fallback - needs conversationId too
        const { data } = await api.post("/chat/messages", {
          conversationId,
          content,
        });
        return data;
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send message");
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (messageId: string) => {
      await api.put(`/chat/messages/${messageId}/read`);
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (messageId: string) => {
      await api.delete(`/chat/messages/${messageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      toast.success("Message deleted");
    },
  });

  return {
    messages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    sendMessage,
    markAsRead,
    deleteMessage,
  };
};
