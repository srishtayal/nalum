import { useState } from "react";
import { ChatProvider } from "@/context/ChatContext";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";
import { ConnectionRequests } from "./components/ConnectionRequests";
import { UserSearch } from "./components/UserSearch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, UserPlus } from "lucide-react";

const ChatPageContent = () => {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  return (
    <div className="h-[calc(100vh-4rem)] p-4">
      <div className="h-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {/* Left Sidebar - Mobile Tabs / Desktop Always Visible */}
          <div className={`${selectedConversation ? "hidden md:block" : "block"} md:col-span-1`}>
            <Tabs defaultValue="chats" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chats">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chats
                </TabsTrigger>
                <TabsTrigger value="requests">
                  <Users className="h-4 w-4 mr-2" />
                  Requests
                </TabsTrigger>
                <TabsTrigger value="search">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chats" className="flex-1 mt-4">
                <ChatList
                  onSelectConversation={setSelectedConversation}
                  selectedConversationId={selectedConversation?._id}
                />
              </TabsContent>

              <TabsContent value="requests" className="flex-1 mt-4 overflow-auto">
                <ConnectionRequests />
              </TabsContent>

              <TabsContent value="search" className="flex-1 mt-4 overflow-auto">
                <UserSearch />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Area - Chat Window */}
          <div className={`${selectedConversation ? "block" : "hidden md:block"} md:col-span-2`}>
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                onBack={() => setSelectedConversation(null)}
              />
            ) : (
              <div className="h-full flex items-center justify-center border rounded-lg bg-muted/10">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            )}
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
