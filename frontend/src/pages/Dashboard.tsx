import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, User, Calendar, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { email, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header/Navbar placeholder */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-nsut-maroon" />
            <h1 className="text-2xl font-serif font-bold text-gray-900">NALUM Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{email}</span>
            <Button
              onClick={logout}
              variant="outline"
              className="border-nsut-maroon text-nsut-maroon hover:bg-nsut-maroon hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard! 🎉
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Your profile has been successfully created. This is your personal dashboard where you can manage your alumni profile and connect with the NSUT community.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This dashboard is under development. More features and sections will be added soon!
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="bg-nsut-maroon/10 p-3 rounded-lg">
                  <User className="h-6 w-6 text-nsut-maroon" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Profile Status</p>
                  <p className="text-xl font-bold text-gray-900">Complete</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="bg-nsut-maroon/10 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-nsut-maroon" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Events</p>
                  <p className="text-xl font-bold text-gray-900">Coming Soon</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="bg-nsut-maroon/10 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-nsut-maroon" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Messages</p>
                  <p className="text-xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 justify-start"
                asChild
              >
                <Link to="/">
                  <GraduationCap className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <p className="font-semibold">View Home Page</p>
                    <p className="text-sm text-gray-500">Explore alumni resources</p>
                  </div>
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-4 justify-start"
                disabled
              >
                <User className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Edit Profile</p>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
