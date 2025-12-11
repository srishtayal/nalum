import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  Edit2,
  Users,
  LogOut,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import api from "@/lib/api";
import nsutLogo from "@/assets/nsut-logo.svg";

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { logout } = useAuth();
  const location = useLocation();
  const { profile } = useProfile();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { data } = await api.get("/chat/connections/pending");
        setPendingCount(data?.data?.length || 0);
      } catch (error) {
        console.error("Failed to fetch pending requests:", error);
      }
    };

    fetchPendingCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const isChatPage = location.pathname.startsWith("/dashboard/chat");

  const navItems = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Dashboard",
      exact: true,
    },
    {
      to: "/dashboard/update-profile",
      icon: Edit2,
      label: "Edit Profile",
    },
    {
      to: "/dashboard/alumni",
      icon: Users,
      label: "Directory",
    },
    {
      to: "/dashboard/connections",
      icon: UserPlus,
      label: "Connections",
      badge: pendingCount,
    },
    {
      to: "/dashboard/chat",
      icon: MessageSquare,
      label: "Messages",
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={cn(
      "h-screen flex flex-col border-r border-white/10 bg-slate-950/50 backdrop-blur-xl shadow-xl sticky top-0 transition-all duration-300",
      isChatPage ? "w-20" : "w-64"
    )}>
      <div className={cn(
        "flex items-center border-b border-white/10",
        isChatPage ? "justify-center p-4" : "p-6"
      )}>
        <img src={nsutLogo} alt="NALUM" className="h-8 w-8 flex-shrink-0" />
        <h1 className={cn(
          "text-2xl font-bold text-white tracking-wider transition-all duration-300 ease-in-out",
          isChatPage ? "opacity-0 max-w-0 ml-0 overflow-hidden" : "opacity-100 max-w-full ml-3"
        )}>
          NALUM
        </h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center transition-all duration-200 group rounded-lg border focus:outline-none",
              isActive(item.to, item.exact)
                ? "bg-blue-500/20 text-blue-200 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white",
              isChatPage ? "justify-center px-2 py-3" : "px-4 py-3 gap-3"
            )}
            title={isChatPage ? item.label : undefined}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-colors flex-shrink-0",
              isActive(item.to, item.exact) ? "text-blue-300" : "text-gray-500 group-hover:text-white"
            )} />
            <span className={cn(
              "font-medium transition-all duration-300 ease-in-out",
              isChatPage ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-full"
            )}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-4">
        {/* Profile Picture Link */}
        {profile && (
          <Link
            to="/dashboard/profile"
            onClick={onNavigate}
            className={cn(
              "flex items-center rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10",
              isChatPage ? "justify-center p-2" : "gap-3 px-4 py-3"
            )}
            title={isChatPage ? profile.user.name : undefined}
          >
            <UserAvatar
              src={profile.profile_picture}
              name={profile.user.name}
              size="sm"
              className="border-2 border-transparent group-hover:border-blue-400/50 transition-all flex-shrink-0"
            />
            <div className={cn(
              "flex flex-col min-w-0 transition-all duration-300 ease-in-out",
              isChatPage ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-full"
            )}>
              <span className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                {profile.user.name}
              </span>
              <span className="text-xs text-gray-500 group-hover:text-gray-400 truncate">
                View Profile
              </span>
            </div>
          </Link>
        )}

        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20",
            isChatPage ? "justify-center p-2" : "gap-3 px-4 py-3"
          )}
          title={isChatPage ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className={cn(
            "font-medium transition-all duration-300 ease-in-out",
            isChatPage ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-full"
          )}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
