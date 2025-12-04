import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User, 
  Users, 
  Edit2, 
  LogOut,
  Home
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";

interface Profile {
  user: {
    name: string;
    email: string;
  };
  profile_picture?: string;
}

const Dashboard = () => {
  const { email, logout, accessToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
      to: "/",
      icon: Home,
      title: "Home Page",
      desc: "Return to main site"
    },
    {
      to: "/dashboard/profile",
      icon: User,
      title: "View Profile",
      desc: "See your profile"
    },
    {
      to: "/dashboard/update-profile",
      icon: Edit2,
      title: "Edit Profile",
      desc: "Update information"
    },
    {
      to: "/dashboard/alumni",
      icon: Users,
      title: "Alumni Directory",
      desc: "Search alumni"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 lg:hidden"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="ml-2 text-xl font-bold text-gray-900">NALUM Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              {!isLoading && profile && (
                <UserAvatar 
                  src={profile.profile_picture} 
                  name={profile.user.name} 
                  size="sm"
                />
              )}
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <action.icon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{action.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.user.name || 'User'}!
          </h2>
          <p className="text-gray-600">
            Manage your profile and connect with the NSUT alumni community.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-nsut-maroon/10 transition-colors">
                    <Icon className="h-6 w-6 text-gray-600 group-hover:text-nsut-maroon transition-colors" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {action.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
