import { Link, useLocation } from "react-router-dom";
import { Home, Edit2, Users, LogOut, MessageSquare, Calendar, Sparkles, FileText, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import nsutLogo from "@/assets/nsut-logo.svg";
import { useConversations } from "@/hooks/useConversations"; // Restored import

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const { profile } = useProfile();
  const { conversations } = useConversations(); // Restored hook usage

  // Calculate total unread count
  const unreadCount = conversations.reduce((acc: number, conv: any) => acc + (conv.unreadCount || 0), 0);

  const navItems = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Dashboard",
      exact: true,
    },
    {
      to: "/dashboard/alumni",
      icon: Users,
      label: "Directory",
    },
    {
      to: "/dashboard/chat",
      icon: MessageSquare,
      label: "Messages",
      hasBadge: true, // Restored flag
    },
    {
      to: "/dashboard/events",
      icon: Calendar,
      label: "Events",
    },
    {
      to: "/dashboard/queries",
      icon: MessageSquare,
      label: "Queries",
    },
    ...(user?.role === "alumni"
      ? [
          {
            to: "/dashboard/posts",
            icon: FileText,
            label: "My Posts",
          },
          {
            to: "/dashboard/host-event",
            icon: Sparkles,
            label: "Host Event",
          },
          {
            to: "/dashboard/giving",
            icon: Heart,
            label: "Giving",
          },
        ]
      : []),
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="group/sidebar h-screen flex flex-col border-r border-white/10 bg-slate-950/50 backdrop-blur-xl shadow-xl sticky top-0 transition-all duration-300 w-20 hover:w-64">
      <div className="flex items-center border-b border-white/10 justify-center group-hover/sidebar:justify-start p-4 group-hover/sidebar:p-6 transition-all duration-300">
        <img src={nsutLogo} alt="NALUM" width="32" height="32" className="h-8 w-8 flex-shrink-0" />
        <h1 className="text-2xl font-bold text-white tracking-wider transition-all duration-300 ease-in-out opacity-0 max-w-0 ml-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-full group-hover/sidebar:ml-3">
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
              "flex items-center transition-all duration-200 group rounded-lg border focus:outline-none justify-center group-hover/sidebar:justify-start px-2 py-3 group-hover/sidebar:px-4 group-hover/sidebar:gap-3",
              isActive(item.to, item.exact)
                ? "bg-blue-500/20 text-blue-200 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <div className="relative">
              <item.icon className={cn(
                  "h-5 w-5 transition-colors flex-shrink-0",
                  isActive(item.to, item.exact) ? "text-blue-300" : "text-gray-500 group-hover:text-white"
                )} />
              {/* Notification Dot */}
              {item.hasBadge && unreadCount > 0 && (
                <span className={cn(
                    "absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-slate-900",
                    "animate-in zoom-in duration-300"
                  )} />
              )}
            </div>
            <span className={cn(
                "font-medium transition-all duration-300 ease-in-out opacity-0 max-w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-full"
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
            className="flex items-center rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10 justify-center group-hover/sidebar:justify-start p-2 group-hover/sidebar:gap-3 group-hover/sidebar:px-4 group-hover/sidebar:py-3"
          >
            <UserAvatar
              src={profile.profile_picture}
              name={profile.user.name}
              size="sm"
              className="border-2 border-transparent group-hover:border-blue-400/50 transition-all flex-shrink-0"
            />
            <div className="flex flex-col min-w-0 transition-all duration-300 ease-in-out opacity-0 max-w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-full">
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
          className="w-full flex items-center rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20 justify-center group-hover/sidebar:justify-start p-2 group-hover/sidebar:gap-3 group-hover/sidebar:px-4 group-hover/sidebar:py-3"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium transition-all duration-300 ease-in-out opacity-0 max-w-0 overflow-hidden whitespace-nowrap group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-full">Logout</span>
        </button>
      </div>
    </aside >
  );
};

export default Sidebar;
