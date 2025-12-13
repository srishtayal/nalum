import { useState } from "react";
import { ChatProvider } from "@/context/ChatContext";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

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
  const [selectedConversation, setSelectedConversation] = useState<any>(null);


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
                    onSelectConversation={setSelectedConversation}
                    selectedConversation={selectedConversation}
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
                  onBack={() => setSelectedConversation(null)}
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
    <ChatProvider>
      <ChatPageContent />
    </ChatProvider>
  );
};
