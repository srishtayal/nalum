import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";
// import { useAuth } from "@/context/AuthContext"; // Removed unused
import { cn } from "@/lib/utils";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Removed
// import { Menu } from "lucide-react"; // Removed
import { Home, MessageSquare, Search, ArrowLeft, Users } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import nsutLogo from "@/assets/nsut-logo.svg";
import { useConversations } from "@/hooks/useConversations"; // Restored import
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api, { searchUsers } from "@/lib/api";

import { useChatContext } from "@/context/ChatContext";
import { useEffect, useState, useRef } from "react";

const DashboardContent = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const currentQueryRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isChatPage = location.pathname.startsWith("/dashboard/chat");
  const isConnectionsPage = location.pathname.startsWith("/dashboard/connections");
  const { profile } = useProfile();
  // const { logout } = useAuth(); // Removed unused
  const { conversations } = useConversations(); // Restored hook usage
  const { socket } = useChatContext();
  const queryClient = useQueryClient();

  // Auto-focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Calculate total unread count
  const unreadCount = conversations.reduce((acc: number, conv: any) => acc + (conv.unreadCount || 0), 0);

  // ... (keeping existing query code) ...
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ["connections", "received"],
    queryFn: async () => {
      const { data } = await api.get("/chat/connections/pending");
      return data.data;
    },
  });

  // ... (keeping existing socket code) ...
  useEffect(() => {
    if (!socket) return;
    const handleConnectionRequest = () => {
      queryClient.invalidateQueries({ queryKey: ["connections", "received"] });
    };
    socket.on("connection_request", handleConnectionRequest);
    return () => {
      socket.off("connection_request", handleConnectionRequest);
    };
  }, [socket, queryClient]);

  const hasPendingRequests = pendingRequests.length > 0;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {/* ... (background glow) ... */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      {/* Mobile Top Bar - Main Dashboard */}
      {!isChatPage && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={nsutLogo} alt="NALUM" className="h-8 w-8" />
            <span className={`font-bold text-white tracking-wider text-lg transition-all duration-300 ${isSearchOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              NALUM
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className={`flex items-center bg-white/10 rounded-full transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? 'flex-1 mx-2 pl-3 pr-1 py-1.5 opacity-100' : 'w-0 p-0 opacity-0 border-none'}`}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-gray-400 min-w-0"
                value={searchQuery}
                onChange={(e) => {
                  const query = e.target.value;
                  setSearchQuery(query);
                  currentQueryRef.current = query;

                  if (searchDebounceRef.current) {
                    clearTimeout(searchDebounceRef.current);
                  }

                  if (query.trim().length > 0) {
                    setIsSearching(true);
                    searchDebounceRef.current = setTimeout(async () => {
                      if (currentQueryRef.current !== query) return;
                      try {
                        const { data } = await searchUsers(query);
                        if (currentQueryRef.current === query) {
                          setSearchResults(data.profiles || []);
                        }
                      } catch (error) {
                        console.error("Search failed", error);
                      } finally {
                        if (currentQueryRef.current === query) {
                          setIsSearching(false);
                        }
                      }
                    }, 50);
                  } else {
                    setSearchResults([]);
                    setIsSearching(false);
                  }
                }}
                onBlur={() => {
                  // Delay closing to allow clicking on results
                  setTimeout(() => {
                    if (searchQuery.trim() === "") {
                      setIsSearchOpen(false);
                    }
                  }, 200);
                }}
              />
            </div>

            <button
              onClick={() => {
                const newState = !isSearchOpen;
                setIsSearchOpen(newState);
                if (newState) {
                  // Focus will be handled by useEffect
                } else {
                  setSearchQuery("");
                  setSearchResults([]);
                  currentQueryRef.current = "";
                }
              }}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Search className="h-6 w-6" />
            </button>

            <Link to="/dashboard/chat" className="p-2 text-gray-400 hover:text-white transition-colors relative flex-shrink-0">
              <MessageSquare className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-950" />
              )}
            </Link>
          </div>
        </div>
      )}

      {/* Vertical Search Results (Mobile) */}
      {isSearchOpen && searchResults.length > 0 && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg animate-in slide-in-from-top-2 duration-200 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-col p-2 gap-1">
            {searchResults.map((profile) => (
              <Link
                key={profile._id}
                to={`/dashboard/alumni/${profile.user._id}`}
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="relative flex-shrink-0">
                  <UserAvatar
                    src={profile.profile_picture}
                    name={profile.user.name}
                    className="h-10 w-10 border border-slate-700"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-white truncate">
                    {profile.user.name}
                  </span>
                  <span className="text-xs text-gray-400 truncate">
                    {profile.batch} • {profile.branch}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Top Bar - Chat Page (Back Button) */}
      {/* Only show on the main chat list page, NOT when inside a conversation (chat details) */}
      {isChatPage && !location.pathname.match(/\/dashboard\/chat\/.+/) && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 h-16 flex items-center">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
            <ArrowLeft className="h-6 w-6" />
            <span className="font-medium text-lg">Back</span>
          </Link>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      {!isChatPage && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-lg border-t border-white/10 flex items-center justify-between px-8 py-2 shadow-2xl md:hidden h-16">
          <Link
            to="/dashboard/connections"
            className={cn(
              "p-2 rounded-xl transition-all duration-300 relative",
              location.pathname === "/dashboard/connections"
                ? "bg-blue-600/20 text-blue-400"
                : "text-gray-400 hover:text-white"
            )}
          >
            <Users className="h-5 w-5" />
            {hasPendingRequests && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-950" />
            )}
          </Link>

          <Link
            to="/dashboard"
            className={cn(
              "p-2 rounded-xl transition-all duration-300",
              location.pathname === "/dashboard"
                ? "bg-blue-600/20 text-blue-400"
                : "text-gray-400 hover:text-white"
            )}
          >
            <Home className="h-5 w-5" />
          </Link>

          <Link
            to="/dashboard/profile"
            className={cn(
              "flex flex-col items-center gap-1 p-1 rounded-full transition-all border-2",
              location.pathname.startsWith("/dashboard/profile")
                ? "border-blue-500"
                : "border-transparent"
            )}
          >
            <UserAvatar
              src={profile?.profile_picture}
              name={profile?.user?.name || "User"}
              size="sm"
              className="h-7 w-7"
            />
            {/* <span className="text-[10px] font-medium text-gray-400">Profile</span> */}
          </Link>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative z-10 scrollbar-hide">
        <div className={cn(
          "relative mx-auto transition-all duration-300 min-h-full flex flex-col",
          isChatPage
            ? location.pathname.match(/\/dashboard\/chat\/.+/) ? "pt-0 pb-0 px-0 max-w-full h-full" : "pt-16 pb-0 px-0 max-w-full h-full"
            : isConnectionsPage
              ? "pt-16 pb-0 px-0 max-w-full"
              : "px-4 pt-28 pb-20 md:p-8 max-w-7xl"
        )}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <ProfileProvider>
      <DashboardContent />
    </ProfileProvider>
  );
};

export default DashboardLayout;
