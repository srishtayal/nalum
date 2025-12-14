import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

import { useMergedChats } from "@/hooks/useMergedChats";

/**
 * ChatPageContent Component
 * 
 * Main layout for the chat dashboard.
 * Implements a responsive glassmorphism design with a dark translucent theme.
 * 
 * Structure:
 * - Left Sidebar: Tabs for ChatList, ConnectionRequests, and UserSearch.
 * - Right Area: ChatWindow (active conversation) or placeholder.
 */
const ChatPageContent = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const location = useLocation();
  const { allChats } = useMergedChats();

  const selectedConversation = useMemo(() =>
    allChats.find((c: any) => c._id === selectedChatId) || null,
    [allChats, selectedChatId]
  );

  useEffect(() => {
    if (location.state?.conversation) {
      // If passing a conversation object, we can extract ID to select it
      // Ideally the object fits the shape in allChats.
      // If it is a newly created conversation, it might have a real _id.
      // If it comes from viewProfile, it is the result of createConversation.
      const conv = location.state.conversation;
      // We need to ensure we select the item that corresponds to this conversation.
      // If allChats has updated, we find it there.
      // If allChats hasn't updated yet, we might have an issue, but usually cache invalidation happens fast.
      // However, if we just rely on ID, we are safe once allChats updates.
      if (conv._id) {
        setSelectedChatId(conv._id);
      }

      // Clear state so it doesn't persist if we navigate away and back without intent
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);


  return (
    <div className="h-full p-2 md:p-4 bg-transparent">
      <div className="h-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {/* Left Sidebar - Glass Panel */}
          {/* Hidden on mobile when a conversation is selected to show the chat window */}
          <div className={`${selectedConversation ? "hidden md:block" : "block"} md:col-span-1 h-full min-h-0`}>
            <div className="h-full flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex-1 mt-0 overflow-hidden min-h-0">
                  <ChatList
                    onSelectConversation={(chat: any) => setSelectedChatId(chat._id)}
                    selectedConversation={selectedConversation}
                    chats={allChats}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Area - Chat Window Glass Panel */}
          <div className={`${selectedConversation ? "block" : "hidden md:block"} md:col-span-2 h-full min-h-0`}>
            <div className="h-full flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl overflow-hidden relative">
              {selectedConversation ? (
                <ChatWindow
                  conversation={selectedConversation}
                  onBack={() => setSelectedChatId(null)}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-400 p-8">
                    <div className="h-20 w-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                      <MessageSquare className="h-10 w-10 opacity-50" />
                    </div>
                    <p className="text-xl font-medium mb-2 text-gray-200">Select a conversation</p>
                    <p className="text-sm opacity-70">Choose a conversation from the list to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChatPage = () => {
  return (
    <ChatPageContent />
  );
};
