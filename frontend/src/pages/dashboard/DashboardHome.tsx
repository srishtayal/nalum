import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Users, 
  Edit2, 
  ArrowRight 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";

interface Profile {
  user: {
    name: string;
    email: string;
  };
  profile_picture?: string;
}

const DashboardHome = () => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setProfile(response.data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  const quickActions = [
    {
      to: "/dashboard/profile",
      icon: User,
      title: "View Profile",
      desc: "Check your public profile",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      to: "/dashboard/update-profile",
      icon: Edit2,
      title: "Edit Profile",
      desc: "Update your details",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      to: "/dashboard/alumni",
      icon: Users,
      title: "Directory",
      desc: "Connect with alumni",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {profile?.user.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-gray-400">
            Manage your profile and connect with the NSUT community.
          </p>
        </div>
        {!isLoading && profile && (
          <div className="hidden sm:block">
            <UserAvatar 
              src={profile.profile_picture} 
              name={profile.user.name} 
              size="lg"
              className="border-2 border-white/20 shadow-lg"
            />
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className={`
                  group p-6 rounded-2xl border transition-all duration-300
                  bg-white/5 hover:bg-white/10 hover:-translate-y-1
                  ${action.border}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${action.bg}`}>
                    <Icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-200 mb-1 group-hover:text-white">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-400">
                  {action.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity or Info Section (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-gray-400">Profile Completion</span>
              <span className="text-green-400 font-mono">85%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-gray-400">Alumni Connections</span>
              <span className="text-blue-400 font-mono">12</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-gray-400">Upcoming Events</span>
              <span className="text-purple-400 font-mono">0</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-center items-center text-center">
          <div className="p-4 rounded-full bg-white/5 mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Join the Community</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xs">
            Connect with alumni, share your journey, and stay updated with campus news.
          </p>
          <Link 
            to="/dashboard/alumni"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            Explore Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
