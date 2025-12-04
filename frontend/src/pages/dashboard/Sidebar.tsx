import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  Home, 
  Edit2, 
  Users, 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";

interface Profile {
  user: {
    name: string;
    email: string;
  };
  profile_picture?: string;
}

const Sidebar = () => {
  const { logout, accessToken } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setProfile(response.data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

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
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 h-screen flex flex-col border-r border-white/20 bg-white/10 backdrop-blur-xl shadow-xl sticky top-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          NALUM
        </h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive(item.to, item.exact)
                ? "bg-blue-500/20 text-blue-200 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-colors",
              isActive(item.to, item.exact) ? "text-blue-300" : "text-gray-500 group-hover:text-white"
            )} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-4">
        {/* Profile Picture Link */}
        {profile && (
          <Link 
            to="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10"
          >
            <UserAvatar 
              src={profile.profile_picture} 
              name={profile.user.name} 
              size="sm"
              className="border-2 border-transparent group-hover:border-blue-400/50 transition-all"
            />
            <div className="flex flex-col min-w-0">
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;