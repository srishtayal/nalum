import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";
// import { useAuth } from "@/context/AuthContext"; // Removed unused
import { cn } from "@/lib/utils";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Removed
// import { Menu } from "lucide-react"; // Removed
import { Home, MessageSquare, Search, ArrowLeft } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import nsutLogo from "@/assets/nsut-logo.svg";
import { useConversations } from "@/hooks/useConversations"; // Restored import



const DashboardContent = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/dashboard/chat");
  const { profile } = useProfile();
  // const { logout } = useAuth(); // Removed unused
  const { conversations } = useConversations(); // Restored hook usage

  // Calculate total unread count
  // Calculate total unread count
  const unreadCount = conversations.reduce((acc: number, conv: any) => acc + (conv.unreadCount || 0), 0);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {/* Fixed Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      {/* Mobile Top Bar - Main Dashboard */}
      {!isChatPage && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={nsutLogo} alt="NALUM" className="h-8 w-8" />
            <span className="font-bold text-white tracking-wider text-lg">NALUM</span>
          </div>
          <Link to="/dashboard/chat" className="p-2 text-gray-400 hover:text-white transition-colors relative">
            <MessageSquare className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-950" />
            )}
          </Link>
        </div>
      )}

      {/* Mobile Top Bar - Chat Page (Back Button) */}
      {isChatPage && (
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
            to="/dashboard/alumni"
            className={cn(
              "p-2 rounded-xl transition-all duration-300",
              location.pathname === "/dashboard/alumni"
                ? "bg-blue-600/20 text-blue-400"
                : "text-gray-400 hover:text-white"
            )}
          >
            <Search className="h-5 w-5" />
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
            ? "pt-16 pb-0 px-0 max-w-full h-full" // Added pt-16 for chat header
            : "pt-20 md:pt-8 p-4 md:p-8 pb-20 md:pb-8 max-w-7xl" // Reduced pb from 28 to 20 since bar is smaller/docked
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
