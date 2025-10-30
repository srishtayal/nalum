import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  Calendar,
  FileText,
  Ban,
  LogOut,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const { logout, admin } = useAdminAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-panel/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Verification Queue",
      path: "/admin-panel/verifications",
      icon: CheckCircle,
    },
    {
      name: "User Management",
      path: "/admin-panel/users",
      icon: Users,
    },
    {
      name: "Event Approvals",
      path: "/admin-panel/events",
      icon: Calendar,
    },
    {
      name: "Newsletters",
      path: "/admin-panel/newsletters",
      icon: FileText,
    },
    {
      name: "Banned Users",
      path: "/admin-panel/banned",
      icon: Ban,
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Nalum Admin</h1>
        <p className="text-sm text-gray-400 mt-1">{admin?.name}</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
